import React from 'react';
import {Img, interpolate} from 'remotion';
import {
  Caixa,
  CartaoAmbiente,
  CartaoConectores,
  CartaoContexto,
  CartaoProgresso,
  CartaoSaidas,
  Conversa,
  Cursor,
  Ferramenta,
  Icone,
  JanelaApp,
  Lateral,
  MsgClaude,
  MsgUsuario,
  Trabalhando,
} from '../../estilos/demo-tutorial/app';
import {APP, Asterisco, COR, Cartela, Chip, FONTE, arq, clamp, suave, useAgora, useDigitado, useEm, useMola} from './base';
import {App, ConversaRelatorio, FIXADOS, LISTA_SOLTA, Mono, N, SAIDAS, TAREFAS} from './comum';
import {BarraContexto, Folha, TituloDiagrama} from '../../estilos/demo-tutorial/diagrama';

const LATERAL = <Lateral secoes={[FIXADOS, LISTA_SOLTA()]} sel="rel" />;
const FEITO = [0, 0, 0, 0, 0];

// ---------- 0.1 · Título (0–4,75) ----------
export const C0_1: React.FC = () => {
  const m = useMola(0.15);
  const sub = useEm(4.1, 0.5);
  return (
    <div style={{position: 'absolute', left: 90, top: 760, opacity: m, transform: `translateY(${(1 - m) * 20}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <Asterisco tamanho={70} giro={m * 30} />
        <span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 84, color: '#FAF9F5', letterSpacing: -2.5, textShadow: '0 4px 30px rgba(0,0,0,.45)'}}>
          Claude Code <span style={{color: COR.terra}}>2.0</span>
        </span>
      </div>
      <div style={{fontFamily: FONTE.ui, fontSize: 34, color: 'rgba(250,249,245,.85)', marginTop: 10, marginLeft: 92, opacity: sub, textShadow: '0 2px 18px rgba(0,0,0,.5)'}}>
        o novo app para desktop
      </div>
    </div>
  );
};

// ---------- 0.2 · Mac do estúdio: a tela acende com o app (4,75–7,1) ----------
// Tela preta do H1_mac.png (2752×1536): x 796–1948, y 337–1093.
export const C0_2: React.FC = () => {
  const t = useAgora();
  const z = interpolate(t, [4.75, 7.1], [1, 1.16], {...clamp, easing: suave});
  const k = 1920 / 2752;
  const tela = {x: 796 * k, y: 337 * k, w: (1948 - 796) * k, h: (1093 - 337) * k};
  const liga = useEm(5.25, 0.5);
  const esc = tela.w / 1470;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${tela.x + tela.w / 2}px ${tela.y + tela.h / 2}px`}}>
        <Img src={arq('hf/H1_mac.png')} style={{width: 1920, height: 1080}} />
        <div style={{position: 'absolute', left: tela.x, top: tela.y, width: tela.w, height: tela.h, overflow: 'hidden', opacity: liga, background: '#1c1c1c'}}>
          <div style={{position: 'absolute', left: 0, top: (tela.h - 864 * esc) / 2, width: 1470, height: 864, transform: `scale(${esc})`, transformOrigin: '0 0'}}>
            <JanelaApp lateral={LATERAL}>
              <ConversaRelatorio feitos={FEITO} />
            </JanelaApp>
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,.07), transparent 45%)'}} />
        </div>
      </div>
    </div>
  );
};

// ---------- 0.3 · Novidades em lista (7,1–20,4) ----------
const NOVIDADES: [string, string, number][] = [
  ['projetos', 'Projetos', 8.36],
  ['chat', 'Threads', 12.0],
  ['mala', 'Mods', 12.58],
  ['lado', 'Conversa lateral', 13.0],
  ['codigo', 'Tela dividida', 14.4],
];
const ItemNovidade: React.FC<{ic: string; nome: string; em: number; i: number}> = ({ic, nome, em, i}) => {
  const m = useMola(em);
  return (
    <div style={{position: 'absolute', left: 0, top: 70 + i * 86, display: 'flex', alignItems: 'center', gap: 22, opacity: m, transform: `translateX(${(1 - m) * -30}px)`}}>
      <div style={{width: 62, height: 62, borderRadius: 16, background: 'rgba(37,37,37,.86)', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icone n={ic} t={32} cor={COR.terra} />
      </div>
      <span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 50, color: '#FAF9F5', letterSpacing: -1, textShadow: '0 3px 24px rgba(0,0,0,.55)'}}>{nome}</span>
    </div>
  );
};
export const C0_3: React.FC = () => {
  const cab = useMola(7.4);
  return (
    <div style={{position: 'absolute', left: 90, top: 150}}>
      <div style={{fontFamily: FONTE.mono, fontSize: 26, letterSpacing: 3, color: COR.terra, opacity: cab}}>NOVO NO APP</div>
      {NOVIDADES.map(([ic, nome, em], i) => (
        <ItemNovidade key={nome} ic={ic} nome={nome} em={em} i={i} />
      ))}
      <Chip em={16.2} texto="várias tarefas ao mesmo tempo" tom="terra" tamanho={32} style={{top: 540}} />
      <Chip em={18.4} texto="sem abrir várias janelas" tamanho={30} style={{top: 620}} />
    </div>
  );
};

// ---------- 0.4–0.6 · O vídeo da migração e o convite (20,4–63,6) ----------
export const C0_4: React.FC = () => {
  const t = useAgora();
  const m = useMola(23.3);
  const selo = useMola(45.4, 12);
  const sai = interpolate(t, [47.9, 48.4], [1, 0], clamp);
  return (
    <div style={{opacity: sai}}>
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 150,
          width: 540,
          padding: 9,
          background: '#FAF9F5',
          borderRadius: 14,
          boxShadow: '0 30px 70px rgba(0,0,0,.55)',
          opacity: m,
          transform: `translateY(${(1 - m) * 40}px) rotate(${-3 + (1 - m) * -4}deg)`,
        }}
      >
        <Img src={arq('vídeo migrei os projetos.png')} style={{width: '100%', borderRadius: 8, display: 'block'}} />
        <div style={{fontFamily: FONTE.ui, fontSize: 21, color: COR.cinza, padding: '10px 6px 2px'}}>no canal · migrei tudo para o Claude Code</div>
        <div
          style={{
            position: 'absolute',
            right: -30,
            bottom: 40,
            background: COR.terra,
            color: '#fff',
            fontFamily: FONTE.ui,
            fontWeight: 700,
            fontSize: 30,
            padding: '12px 20px',
            borderRadius: 12,
            border: `2px solid ${COR.terraEscuro}`,
            boxShadow: '0 16px 30px rgba(0,0,0,.4)',
            opacity: selo,
            transform: `rotate(${6 - 4 * selo}deg) scale(${1.6 - 0.6 * selo})`,
          }}
        >
          Projetos agora no Claude Code
        </div>
      </div>
      <Chip em={31.0} texto="janela de contexto" tamanho={30} style={{left: 80, top: 600}} />
      <Chip em={32.5} texto="tempo de cache" tamanho={30} style={{left: 390, top: 600}} />
      <div style={{position: 'absolute', left: 80, top: 690, fontFamily: FONTE.ui, fontSize: 28, color: '#FAF9F5', opacity: useEm(35.5, 0.4), textShadow: '0 2px 16px rgba(0,0,0,.6)'}}>feito na mão:</div>
      <Chip em={36.7} texto="CLAUDE.md" mono tom="escuro" tamanho={28} style={{left: 80, top: 740}} />
      <Chip em={38.3} texto="skills/" mono tom="escuro" tamanho={28} style={{left: 290, top: 740}} />
      <Chip em={39.0} texto="pastas" mono tom="escuro" tamanho={28} style={{left: 440, top: 740}} />
    </div>
  );
};

export const C0_6: React.FC = () => {
  const seta = useEm(60.8, 0.6);
  return (
    <>
      <Chip em={50.5} texto="cada novidade funcionando" tamanho={32} style={{left: 90, top: 210}} />
      <Chip em={52.1} texto="com exemplos de trabalho de verdade" tom="escuro" tamanho={28} style={{left: 90, top: 300}} />
      <Chip em={55.3} texto="Claude na web" tamanho={32} style={{left: 90, top: 520}} />
      <Chip em={56.4} texto="Cowork" tamanho={32} style={{left: 90, top: 610}} />
      <svg style={{position: 'absolute', left: 380, top: 545}} width={120} height={120}>
        <path d={`M10 60 H${10 + 80 * seta}`} stroke="#FAF9F5" strokeWidth={5} strokeLinecap="round" />
        {seta > 0.9 && <path d="M78 44 L94 60 L78 76" fill="none" stroke="#FAF9F5" strokeWidth={5} strokeLinecap="round" />}
      </svg>
      <Chip
        em={62.9}
        texto={
          <>
            <Asterisco tamanho={34} cor="#fff" /> Claude Code
          </>
        }
        tom="terra"
        tamanho={36}
        style={{left: 90, top: 720}}
      />
    </>
  );
};

// ---------- 1.1–1.2 · O app aberto, aba Code (64,0–77,7), câmera G ----------
export const C1_1: React.FC = () => {
  const t = useAgora();
  const dica = useEm(71.0, 0.3);
  const anel = useEm(70.9, 0.3);
  return (
    <>
      <App
        focos={[
          [64.0, 1, 735, 432],
          [70.4, 2.6, 200, 60, 1.1],
          [76.4, 1, 735, 432, 0.9],
        ]}
      >
        <JanelaApp lateral={LATERAL}>
          <ConversaRelatorio
            painel={
              <>
                <CartaoProgresso itens={TAREFAS} feitos={FEITO} />
                <CartaoAmbiente />
                <CartaoContexto usado={18} />
              </>
            }
          />
          {t > 70.4 && t < 76.6 && (
            <div style={{position: 'absolute', left: 196, top: 36, padding: '4px 9px', borderRadius: 7, background: '#111', color: APP.texto, fontFamily: FONTE.ui, fontSize: 12.5, border: `1px solid ${APP.linha}`, opacity: dica}}>
              Code
            </div>
          )}
          {t > 70.4 && t < 76.6 && <div style={{position: 'absolute', left: 202, top: 9, width: 40, height: 33, borderRadius: 8, border: `2px solid ${COR.terra}`, opacity: anel}} />}
        </JanelaApp>
      </App>
      <Chip em={67.3} texto="a interface ficou mais organizada" tamanho={30} style={{left: 50, top: 40}} />
      <Chip em={73.1} texto="as novidades chegam primeiro na aba Code" tom="terra" tamanho={30} style={{left: 50, top: 40, opacity: t < 73.1 ? 0 : undefined}} />
      <Chip em={76.5} texto="dá para usar sem programar" tom="escuro" tamanho={30} style={{left: 50, top: 1010}} />
    </>
  );
};

// ---------- 1.3 · Achar o relatório e resumir (77,7–96,4), câmera D ----------
const PEDIDO_RESUMO = 'Encontre o relatório de cliente que baixei ontem e faça um resumo.';
export const C1_3: React.FC = () => {
  const t = useAgora();
  const d = useDigitado(PEDIDO_RESUMO, 81.5, 87.4);
  const enviado = t >= 88.0;
  const cmd = useEm(90.2, 0.3);
  return (
    <App
      focos={[
        [77.7, 1, 735, 432],
        [81.3, 1.7, 700, 790, 0.8],
        [88.2, 1.5, 760, 560, 0.7],
        [90.2, 1.5, 760, 470, 0.7],
        [94.8, 1, 735, 432, 1.0],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={[FIXADOS, LISTA_SOLTA([], undefined, enviado ? ['resumo'] : [])]} sel={enviado ? 'resumo' : undefined} nav={t > 78.6 && !enviado ? 'Criar' : undefined} />}>
        <Conversa titulo={enviado ? N.resumo : 'Nova sessão'} caixa={<Caixa texto={enviado ? '' : d.texto} digitando={d.digitando && !enviado} />}>
          {enviado && (
            <>
              <MsgUsuario em={88.0}>{PEDIDO_RESUMO}</MsgUsuario>
              <Ferramenta em={89.0} texto="Procurou em 2 pastas, executou 1 comando" />
              {t >= 90.2 && (
                <div style={{fontFamily: FONTE.mono, fontSize: 13, color: APP.apagado, background: '#1e1e1e', border: `1px solid ${APP.linha}`, borderRadius: 8, padding: '8px 12px', opacity: cmd}}>
                  $ find ~/Downloads -name "*.pdf" -mtime -1
                  <br />
                  <span style={{color: APP.texto}}>~/Downloads/Relatório 3º tri - Brightline Dental.pdf</span>
                </div>
              )}
              <MsgClaude em={91.6}>
                Encontrei: <Mono>~/Downloads/Relatório 3º tri - Brightline Dental.pdf</Mono>, baixado ontem às 16h12.
                <div style={{marginTop: 8, fontWeight: 600}}>Relatório do 3º trimestre, Brightline Dental</div>
                <ul style={{margin: '4px 0 0', paddingLeft: 20}}>
                  <li>Novos pacientes: +18% sobre o 2º trimestre, puxados pelo agendamento online.</li>
                  <li>Cancelamentos caíram de 9% para 6%.</li>
                </ul>
              </MsgClaude>
            </>
          )}
        </Conversa>
        <Cursor pts={[[77.9, 500, 300], [78.5, 60, 79], [80.6, 500, 780]]} cliques={[78.6, 80.8]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 1.5 · Cartela 01/07 (96,4–98,2) ----------
export const C1_5: React.FC = () => <Cartela em={96.4} num={1} titulo={<>O novo layout</>} sub="tudo da conversa em um painel ao lado" />;

// ---------- 1.6–1.7 · Painel lateral e lista de tarefas (98,2–117,3), câmera D ----------
const MARCAS = [113.3, 114.1, 114.8, 115.4, 116.4];
export const C1_6: React.FC = () => {
  const t = useAgora();
  const lista = t >= 109.7;
  return (
    <App
      focos={[
        [98.2, 1, 735, 432],
        [100.2, 1.75, 1320, 330, 0.9],
        [105.4, 1, 735, 432, 0.8],
        [109.6, 1.6, 640, 560, 0.8],
        [116.9, 1, 735, 432, 0.6],
      ]}
    >
      <JanelaApp lateral={LATERAL}>
        <ConversaRelatorio
          final={false}
          listaEm={lista ? 109.7 : 1e9}
          feitos={MARCAS}
          painel={
            <>
              <CartaoProgresso itens={TAREFAS} feitos={MARCAS} destaque={t > 102.2 && t < 105.4 ? 1 : 0} />
              <CartaoConectores aberto={false} destaque={t > 102.8 && t < 105.4 ? 1 : 0} />
              <CartaoSaidas itens={[{...SAIDAS[1]}]} destaque={t > 103.9 && t < 105.4 ? 1 : 0} />
              <CartaoContexto usado={14} />
            </>
          }
          extra={t >= 109.7 && t < 116.4 ? <Trabalhando texto="Trabalhando no relatório" /> : undefined}
        />
      </JanelaApp>
    </App>
  );
};

// ---------- 1.8–1.9 · Ambiente e controle remoto (117,3–130,4), câmera E ----------
export const C1_8: React.FC = () => {
  const t = useAgora();
  const dica = useEm(122.4, 0.25);
  const anel = useEm(125.5, 0.25);
  return (
    <App
      focos={[
        [117.3, 1, 735, 432],
        [120.4, 2.1, 1330, 150, 0.9],
      ]}
    >
      <JanelaApp lateral={LATERAL}>
        <ConversaRelatorio
          feitos={FEITO}
          painel={
            <>
              <CartaoAmbiente destaque={t > 120.6 ? 1 : 0} remotoEm={129.9} />
              <CartaoContexto usado={18} />
              <CartaoConectores aberto={false} />
            </>
          }
        />
        {t > 122.4 && t < 127.2 && (
          <div style={{position: 'absolute', left: 1236, top: 156, padding: '6px 10px', borderRadius: 8, background: '#111', border: `1px solid ${APP.linha}`, color: APP.texto, fontFamily: FONTE.mono, fontSize: 12.5, opacity: dica}}>
            /Users/macks/Clientes
          </div>
        )}
        {t > 125.5 && t < 127.6 && (
          <div style={{position: 'absolute', left: 1210, top: 82, width: 248, height: 30, borderRadius: 8, border: `2px solid ${COR.terra}`, opacity: anel}} />
        )}
        <Cursor pts={[[121.6, 1300, 260], [122.2, 1290, 132], [127.6, 1290, 132], [128.9, 1428, 166]]} cliques={[129.9]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 1.9 · O celular acompanha a sessão (130,4–143,7), câmera Q ----------
// Tela do H2_celular.png (2752×1536): x 1155–1605, y 303–1263.
const CelularTela: React.FC = () => {
  const t = useAgora();
  const acoes: [string, number][] = [
    ['Permitir', 138.9],
    ['Compactar', 141.5],
    ['Agendar', 142.9],
  ];
  return (
    <div style={{width: 450, height: 960, background: '#1f1f1f', fontFamily: FONTE.ui, color: APP.texto, padding: '64px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16, fontSize: 19}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: APP.apagado}}>
        <Asterisco tamanho={22} /> Claude · Remote Control
      </div>
      <div style={{fontSize: 22, fontWeight: 600}}>{N.rel}</div>
      <div style={{background: APP.bolha, borderRadius: 14, padding: '12px 14px', fontSize: 17, color: '#d8d8d6'}}>Escreva o relatório desta semana para a Northwind Logistics…</div>
      <div style={{border: `1px solid ${APP.bordaCartao}`, borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10}}>
        {TAREFAS.map((x, i) => {
          const feito = i < 3 || t > 137 + i;
          return (
            <div key={x} style={{display: 'flex', gap: 10, fontSize: 16, color: feito ? APP.apagado : APP.texto}}>
              <div style={{width: 16, height: 16, borderRadius: 8, flexShrink: 0, marginTop: 2, background: feito ? APP.verde : 'transparent', border: `1.5px solid ${feito ? APP.verde : i === 3 ? COR.terra : '#666'}`}} />
              {x}
            </div>
          );
        })}
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        {acoes.map(([a, em]) => {
          const p = useMola(em);
          return (
            <span key={a} style={{padding: '9px 14px', borderRadius: 12, background: COR.terra, color: '#fff', fontWeight: 600, fontSize: 18, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
              {a}
            </span>
          );
        })}
      </div>
      <div style={{height: 50, borderRadius: 16, background: APP.caixa, display: 'flex', alignItems: 'center', padding: '0 16px', color: APP.fraco, fontSize: 17}}>Responder…</div>
    </div>
  );
};
export const C1_9: React.FC = () => {
  const t = useAgora();
  const k = interpolate(t, [130.4, 143.7], [0.82, 0.88], clamp);
  const ox = 700 - 1380 * k;
  const oy = 540 - 783 * k;
  const area = {x: 40, y: 40, w: 1320, h: 1000};
  const liga = useEm(131.0, 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: area.x, top: area.y, width: area.w, height: area.h, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 70px rgba(40,25,10,.3)', opacity: useEm(130.4, 0.4)}}>
        <div style={{position: 'absolute', left: ox - area.x, top: oy - area.y, width: 2752 * k, height: 1536 * k}}>
          <Img src={arq('hf/H2_celular.png')} style={{width: '100%', height: '100%'}} />
          <div style={{position: 'absolute', left: 1155 * k, top: 303 * k, width: 450, height: 960, transform: `scale(${k})`, transformOrigin: '0 0', borderRadius: 52, overflow: 'hidden', opacity: liga}}>
            <CelularTela />
          </div>
        </div>
      </div>
      <Chip em={133.2} texto="a sessão roda no computador" tamanho={30} style={{left: 920, top: 120}} />
      <Chip em={136.6} texto="o celular só acompanha" tom="escuro" tamanho={28} style={{left: 920, top: 200}} />
    </>
  );
};

// ---------- 1.10 · Cartão de contexto e compactar (143,7–156,0), câmera E ----------
const CTX71: [string, number][] = [
  ['609.8k', 61.0],
  ['63k', 6.3],
  ['17.4k', 1.7],
  ['10.2k', 1.0],
  ['9.8k', 1.0],
  ['9.4k', 0.9],
  ['33k', 3.3],
  ['247k', 24.8],
];
export const C1_10: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [143.7, 1, 735, 432],
        [144.6, 1.85, 1330, 330, 0.9],
      ]}
    >
      <JanelaApp lateral={LATERAL}>
        <ConversaRelatorio
          feitos={FEITO}
          painel={
            <>
              <CartaoAmbiente />
              <CartaoContexto usado={71} valores={CTX71} aberto destaque={t > 144.8 && t < 151.5 ? 1 : 0} compactarHover={t > 152.5} />
              <CartaoConectores aberto={false} />
            </>
          }
        />
        <Cursor pts={[[150.6, 1260, 300], [152.4, 1410, 465]]} cliques={[153.0]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 1.11 · O que a compactação faz (156,0–164,4), câmera G ----------
export const C1_11: React.FC = () => {
  const t = useAgora();
  const junta = useEm(157.8, 0.9);
  return (
    <>
      <TituloDiagrama em={156.0}>Compactar a sessão</TituloDiagrama>
      {Array.from({length: 7}).map((_, i) => {
        const y0 = 220 + i * 62;
        const y = y0 + (300 - y0) * junta;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 90 + (i % 2) * 120,
              top: y,
              width: 520 - (i % 3) * 90,
              height: 42,
              borderRadius: 12,
              background: i % 2 ? '#e7e2d6' : '#ddd7c9',
              opacity: (1 - junta) * useEm(156.2 + i * 0.08, 0.3),
            }}
          />
        );
      })}
      <Folha em={158.4} x={90} y={250} w={640} style={{padding: '22px 26px'}}>
        <div style={{fontSize: 22, letterSpacing: 2, color: COR.terra, fontWeight: 600}}>RESUMO DESTA CONVERSA</div>
        <div style={{fontSize: 27, lineHeight: 1.4, marginTop: 10}}>Relatório Northwind escrito, pedidos do cliente incluídos, números conferidos com o controle.</div>
      </Folha>
      <BarraContexto
        x={90}
        y={560}
        w={1080}
        valores={[
          [156.0, 71],
          [159.0, 71],
          [160.7, 18],
          [161.6, 18],
          [163.6, 23],
        ]}
      />
      <Chip em={160.1} texto="libera espaço" tom="salvia" tamanho={30} style={{left: 90, top: 760}} />
      <Chip em={161.6} texto="você continua sem perder desempenho" tamanho={30} style={{left: 330, top: 760, opacity: t < 161.6 ? 0 : undefined}} />
    </>
  );
};

