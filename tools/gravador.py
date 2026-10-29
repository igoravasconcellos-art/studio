"""Um estúdio de gravação no navegador, servido do seu próprio computador.

Uso:
    py tools/gravador.py "projetos/012. Orcamento do Zero"

Abre em http://localhost:8787. O que ele resolve, que o gravador do Windows não resolvia:

- **Medidor de nível ao vivo.** Se o microfone estiver mudo, você vê antes de gravar, em vez de
  descobrir 80 segundos depois. Foi exatamente isso que aconteceu em 29/10/2026.
- **Escolha do microfone**, para não gravar do dispositivo errado.
- **Sem processamento.** Cancelamento de eco, supressão de ruído e ganho automático ficam
  desligados: tudo isso estraga a voz para clonagem e para narração.
- **WAV 48 kHz mono de verdade**, não o Opus comprimido que o navegador grava por padrão.
- **O texto do bloco na tela**, com cronômetro e o tempo-alvo lado a lado.
- **Salva direto** em `vozes/gravado/blocoN.wav`, sem você mexer em arquivo.

O áudio nunca sai do seu computador: a página é servida de localhost e manda o arquivo de volta
para o mesmo processo, que escreve no disco.
"""

import json
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

PORTA = 8787
PALAVRAS_POR_MINUTO = 145

BLOCOS = [("bloco1", "narracao", "Abertura e a promessa"),
          ("bloco2", "bloco2", "As três colunas"),
          ("bloco3", "bloco3", "O exemplo com valores"),
          ("bloco4", "bloco4", "Como montar na prática"),
          ("bloco5", "bloco5", "Os erros e o fecho")]

PAGINA = r"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gravador</title>
<style>
  :root{
    --papel:#F6EFE6; --tinta:#3E2E26; --terracota:#B86A4B; --oliva:#7D8A6A;
    --linha:#E2D6C6; --fraco:#8A7866;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--papel);color:var(--tinta);
       font:16px/1.6 "Segoe UI",system-ui,sans-serif}
  header{padding:18px 24px;border-bottom:1px solid var(--linha);display:flex;
         gap:18px;align-items:center;flex-wrap:wrap;position:sticky;top:0;background:var(--papel);z-index:5}
  h1{font-size:18px;margin:0;font-weight:700;letter-spacing:.01em}
  select,button{font:inherit;color:inherit;border-radius:10px;border:1px solid var(--linha);
                background:#fff;padding:9px 14px;cursor:pointer}
  button:disabled{opacity:.4;cursor:default}
  .principal{background:var(--terracota);border-color:var(--terracota);color:#fff;font-weight:700}
  .parar{background:var(--tinta);border-color:var(--tinta);color:#fff;font-weight:700}
  main{max-width:900px;margin:0 auto;padding:24px}
  .medidor{height:26px;border-radius:13px;background:#E8DCCB;overflow:hidden;position:relative;
           border:1px solid var(--linha)}
  .barra{height:100%;width:0;background:var(--oliva);transition:width .05s linear}
  .barra.alto{background:var(--terracota)}
  .marca{position:absolute;top:0;bottom:0;width:2px;background:rgba(62,46,38,.35)}
  .aviso{margin-top:10px;font-weight:700;min-height:24px}
  .mudo{color:var(--terracota)}
  .ok{color:var(--oliva)}
  .abas{display:flex;gap:8px;margin:22px 0 14px;flex-wrap:wrap}
  .aba{padding:8px 14px;border-radius:999px;border:1px solid var(--linha);background:#fff;font-size:14px}
  .aba[aria-selected=true]{background:var(--tinta);color:#fff;border-color:var(--tinta)}
  .aba .feito{color:var(--oliva);font-weight:700}
  .aba[aria-selected=true] .feito{color:#C8D6B4}
  .tempos{display:flex;gap:28px;align-items:baseline;margin:18px 0}
  .relogio{font-size:44px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
  .relogio.perto{color:var(--oliva)}
  .alvo{color:var(--fraco)}
  .texto{background:#fff;border:1px solid var(--linha);border-radius:14px;padding:26px 30px;
         font-size:21px;line-height:1.85;white-space:pre-wrap;max-height:46vh;overflow:auto}
  .rodape{margin-top:18px;color:var(--fraco);font-size:14px}
  .salvo{margin-top:14px;font-weight:700;color:var(--oliva);min-height:22px}
</style></head><body>
<header>
  <h1>Gravador &mdash; <span id="projeto"></span></h1>
  <select id="dispositivos"></select>
  <button id="btGravar" class="principal" disabled>Gravar</button>
  <button id="btParar" class="parar" disabled>Parar</button>
</header>
<main>
  <div class="medidor"><div class="barra" id="barra"></div><div class="marca" style="left:70%"></div></div>
  <div class="aviso" id="aviso">Escolha o microfone e fale: a barra tem de se mexer.</div>

  <div class="abas" id="abas"></div>

  <div class="tempos">
    <div class="relogio" id="relogio">0:00</div>
    <div class="alvo">alvo <span id="alvo">&mdash;</span> &middot; <span id="palavras"></span> palavras</div>
  </div>

  <div class="texto" id="texto"></div>
  <div class="salvo" id="salvo"></div>
  <div class="rodape">
    Errou no meio? N&atilde;o pare: espere dois segundos, repita a frase inteira desde o come&ccedil;o e siga.
    Eu acho a repeti&ccedil;&atilde;o e removo a tomada ruim.
  </div>
</main>
<script>
const $ = s => document.querySelector(s);
let blocos = [], atual = 0, ctx, fonte, analisador, gravando = false, pedacos = [], taxa = 48000;
let t0 = 0, timer = null, picoRecente = 0;

async function iniciar(){
  const r = await fetch('/blocos'); const d = await r.json();
  blocos = d.blocos; $('#projeto').textContent = d.projeto;
  desenharAbas(); escolher(0);
  await listarDispositivos();
}

function desenharAbas(){
  $('#abas').innerHTML = '';
  blocos.forEach((b,i)=>{
    const el = document.createElement('button');
    el.className='aba'; el.setAttribute('aria-selected', i===atual);
    el.innerHTML = `${b.titulo} ${b.gravado?'<span class="feito">&check;</span>':''}`;
    el.onclick = ()=>escolher(i);
    $('#abas').appendChild(el);
  });
}

function escolher(i){
  if(gravando) return;
  atual = i; const b = blocos[i];
  $('#texto').textContent = b.texto;
  $('#alvo').textContent = fmt(b.alvo);
  $('#palavras').textContent = b.palavras;
  $('#salvo').textContent = b.gravado ? 'Este bloco já tem gravação. Gravar de novo substitui.' : '';
  $('#relogio').textContent = '0:00'; $('#relogio').classList.remove('perto');
  desenharAbas();
}

const fmt = s => `${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,'0')}`;

async function listarDispositivos(){
  try{ await navigator.mediaDevices.getUserMedia({audio:true}); }catch(e){
    $('#aviso').textContent = 'O navegador bloqueou o microfone. Libere e recarregue.';
    $('#aviso').className = 'aviso mudo'; return;
  }
  const ds = (await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput');
  $('#dispositivos').innerHTML = ds.map(d=>`<option value="${d.deviceId}">${d.label||'microfone'}</option>`).join('');
  $('#dispositivos').onchange = abrir; abrir();
}

async function abrir(){
  if(ctx) await ctx.close();
  const fluxo = await navigator.mediaDevices.getUserMedia({audio:{
    deviceId: {exact: $('#dispositivos').value},
    channelCount: 1,
    // Tudo desligado de proposito: esses tres estragam a voz para narracao e para clonagem.
    echoCancellation:false, noiseSuppression:false, autoGainControl:false
  }});
  ctx = new AudioContext(); taxa = ctx.sampleRate;
  fonte = ctx.createMediaStreamSource(fluxo);
  analisador = ctx.createAnalyser(); analisador.fftSize = 2048;
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  proc.onaudioprocess = e => { if(gravando) pedacos.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
  fonte.connect(analisador); analisador.connect(proc);
  proc.connect(ctx.createGain()).connect(ctx.destination);  // ganho 0: nao devolve som
  proc.context.createGain().gain.value = 0;
  medir();
  $('#btGravar').disabled = false;
}

function medir(){
  const buf = new Float32Array(analisador.fftSize);
  const passo = ()=>{
    analisador.getFloatTimeDomainData(buf);
    let p = 0; for(const v of buf) p = Math.max(p, Math.abs(v));
    picoRecente = Math.max(picoRecente*0.92, p);
    const db = 20*Math.log10(picoRecente || 1e-6);
    const largura = Math.max(0, Math.min(100, (db + 60) / 60 * 100));
    $('#barra').style.width = largura + '%';
    $('#barra').classList.toggle('alto', db > -6);
    const a = $('#aviso');
    if(db < -55){ a.textContent = 'SEM SINAL. Veja o botão de mudo do microfone e o ganho.'; a.className='aviso mudo'; }
    else if(db > -3){ a.textContent = 'Alto demais, vai estourar. Abaixe o ganho ou afaste-se.'; a.className='aviso mudo'; }
    else if(db < -35){ a.textContent = 'Fraco. Chegue mais perto ou aumente o ganho.'; a.className='aviso'; }
    else { a.textContent = 'Nível bom.'; a.className='aviso ok'; }
    requestAnimationFrame(passo);
  };
  passo();
}

$('#btGravar').onclick = ()=>{
  pedacos = []; gravando = true; t0 = Date.now();
  $('#btGravar').disabled = true; $('#btParar').disabled = false; $('#salvo').textContent = '';
  timer = setInterval(()=>{
    const s = (Date.now()-t0)/1000;
    $('#relogio').textContent = fmt(s);
    $('#relogio').classList.toggle('perto', Math.abs(s - blocos[atual].alvo) <= blocos[atual].alvo*0.08);
  }, 200);
};

$('#btParar').onclick = async ()=>{
  gravando = false; clearInterval(timer);
  $('#btParar').disabled = true; $('#salvo').textContent = 'salvando...';
  const total = pedacos.reduce((n,p)=>n+p.length, 0);
  const todos = new Float32Array(total);
  let o = 0; for(const p of pedacos){ todos.set(p, o); o += p.length; }
  const wav = paraWav(todos, taxa);
  const r = await fetch('/salvar/' + blocos[atual].arquivo, {method:'POST', body:wav});
  const d = await r.json();
  blocos[atual].gravado = true; desenharAbas();
  $('#salvo').textContent = `salvo: ${d.arquivo} (${d.segundos.toFixed(1)}s)`;
  $('#btGravar').disabled = false;
};

function paraWav(amostras, taxa){
  const buf = new ArrayBuffer(44 + amostras.length*2), v = new DataView(buf);
  const txt = (p,s)=>{ for(let i=0;i<s.length;i++) v.setUint8(p+i, s.charCodeAt(i)); };
  txt(0,'RIFF'); v.setUint32(4, 36 + amostras.length*2, true); txt(8,'WAVEfmt ');
  v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,taxa,true); v.setUint32(28,taxa*2,true); v.setUint16(32,2,true);
  v.setUint16(34,16,true); txt(36,'data'); v.setUint32(40, amostras.length*2, true);
  let p = 44;
  for(const a of amostras){ const s = Math.max(-1, Math.min(1, a)); v.setInt16(p, s*0x7FFF, true); p += 2; }
  return new Blob([buf], {type:'audio/wav'});
}

iniciar();
</script></body></html>
"""


def carregar(projeto: Path) -> list[dict]:
    dados = []
    for arquivo, texto_de, titulo in BLOCOS:
        caminho = projeto / "audio" / f"{texto_de}.txt"
        texto = caminho.read_text(encoding="utf-8").strip() if caminho.exists() else ""
        # O que vale para o TTS não vale para a leitura humana.
        texto = texto.replace("Soma o total do ano e divide por 12",
                              "Some o total do ano e divida por doze")
        n = len(texto.split())
        dados.append({"arquivo": arquivo, "titulo": titulo, "texto": texto, "palavras": n,
                      "alvo": round(n / PALAVRAS_POR_MINUTO * 60, 1),
                      "gravado": (projeto / "vozes" / "gravado" / f"{arquivo}.wav").exists()})
    return dados


class Servidor(BaseHTTPRequestHandler):
    projeto: Path

    def log_message(self, *a):  # silêncio no terminal
        pass

    def _responder(self, codigo: int, corpo: bytes, tipo: str) -> None:
        self.send_response(codigo)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def do_GET(self):
        caminho = urlparse(self.path).path
        if caminho == "/":
            self._responder(200, PAGINA.encode("utf-8"), "text/html; charset=utf-8")
        elif caminho == "/blocos":
            corpo = json.dumps({"projeto": self.projeto.name,
                                "blocos": carregar(self.projeto)}, ensure_ascii=False)
            self._responder(200, corpo.encode("utf-8"), "application/json; charset=utf-8")
        else:
            self._responder(404, b"nao encontrado", "text/plain")

    def do_POST(self):
        caminho = unquote(urlparse(self.path).path)
        m = re.fullmatch(r"/salvar/(bloco[1-5])", caminho)
        if not m:
            self._responder(404, b"nao encontrado", "text/plain")
            return
        n = int(self.headers.get("Content-Length", 0))
        dados = self.rfile.read(n)
        destino = self.projeto / "vozes" / "gravado" / f"{m.group(1)}.wav"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_bytes(dados)
        segundos = max(0, (len(dados) - 44) / 2 / 48000)
        print(f"  salvo {destino.name}  {len(dados)/1e6:.1f} MB")
        corpo = json.dumps({"arquivo": destino.name, "segundos": segundos})
        self._responder(200, corpo.encode("utf-8"), "application/json")


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    Servidor.projeto = Path(sys.argv[1]).resolve()
    if not (Servidor.projeto / "audio").exists():
        raise SystemExit(f"não achei {Servidor.projeto / 'audio'}")
    print(f"Gravador de '{Servidor.projeto.name}' em http://localhost:{PORTA}")
    print("As gravações vão para vozes/gravado/. Ctrl+C para encerrar.")
    ThreadingHTTPServer(("127.0.0.1", PORTA), Servidor).serve_forever()


if __name__ == "__main__":
    main()
