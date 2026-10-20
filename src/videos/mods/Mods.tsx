import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {getSynchronizedSplitState, SynchronizedSplitPanel} from '../../_shared/synchronized-split';
import {
  Broll,
  COR,
  Cena,
  Chip,
  FONTE,
  FPS,
  Fontes,
  Papel,
  Print,
  Recorte,
  Titulo,
  arq,
  clamp,
  f,
  suave,
  useAgora,
  useEm,
  useMola,
} from './base';
import {APP, ClaudeApp, Codigo, Ferramenta, ItemPainel, Linha, TituloPainel, Usuario} from './claude-app';

// ---------- Câmera: uma única instância do master, só o contêiner se move ----------

type Ret = {l: number; t: number; w: number; h: number; r: number; vs: number; vx: number; vy: number};
const zoom = (s: number): Ret => ({l: 0, t: 0, w: 1920, h: 1080, r: 0, vs: s, vx: 0, vy: -1080 * (s - 1) * 0.15});
const CHEIA = zoom(1);
const ESPACO = zoom(1.18);
const AULA_CFG = {splitCameraLeft: 1424, splitCameraTop: 60, splitCameraWidth: 456, splitCameraHeight: 960, splitCameraRadius: 28, splitVideoX: -747, splitVideoY: 0, panelGap: 0};
const aulaFim = getSynchronizedSplitState(1, AULA_CFG);
const AULA: Ret = {l: aulaFim.camera.left, t: aulaFim.camera.top, w: aulaFim.camera.width, h: aulaFim.camera.height, r: aulaFim.camera.radius, vs: 1, vx: aulaFim.video.x, vy: aulaFim.video.y};
const card = (l: number): Ret => ({l, t: 640, w: 400, h: 380, r: 26, vs: 0.62, vx: 200 - 975 * 0.62, vy: -10});
const CARD_D = card(1460);
const CARD_E = card(60);

// [início, layout, duração da transição]
const CAMERA: [number, Ret, number][] = [
  [0, zoom(1.08), 4],
  [4.0, CARD_D, 0.9],
  [13.2, CHEIA, 0.9],
  [23.1, AULA, 0.9],
  [37.0, CHEIA, 0.9],
  [43.3, AULA, 0.9],
  [52.9, ESPACO, 0.9],
  [60.4, CARD_D, 0.9],
  [85.2, AULA, 0.9],
  [92.5, CHEIA, 0.3],
  [108.0, zoom(1.06), 1.5],
  [113.3, CHEIA, 1.2],
  [133.0, CARD_D, 0.9],
  [141.8, CHEIA, 0.3],
  [153.9, CARD_D, 0.9],
  [169.6, CARD_E, 1.0],
  [185.8, ESPACO, 0.9],
  [189.2, CHEIA, 0.3],
  [198.5, CARD_D, 0.9],
  [208.0, CHEIA, 0.3],
  [221.4, zoom(1.08), 1.2],
  [229.4, CHEIA, 1.0],
  [253.4, AULA, 0.9],
  [277.3, zoom(1.06), 0.9],
  [278.3, CHEIA, 5],
  [293.5, CARD_D, 1.2],
];

const lerp = (a: Ret, b: Ret, p: number): Ret => {
  const o = {} as Ret;
  (Object.keys(a) as (keyof Ret)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * p));
  return o;
};

const retEm = (t: number) => {
  let cur = CHEIA;
  for (const [ini, lay, dur] of CAMERA) {
    if (t < ini) break;
    cur = lerp(cur, lay, suave(Math.min(1, (t - ini) / dur)));
  }
  return cur;
};

const Camera: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = retEm(t);
  const emCard = c.r > 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: c.l,
        top: c.t,
        width: c.w,
        height: c.h,
        overflow: 'hidden',
        borderRadius: c.r,
        boxShadow: emCard ? `0 0 0 ${Math.min(6, c.r / 4)}px ${COR.papelClaro}, 0 30px 70px rgba(30,20,10,.45)` : 'none',
      }}
    >
      <div style={{position: 'absolute', left: c.vx, top: c.vy, width: 1920 * c.vs, height: 1080 * c.vs}}>
        <OffthreadVideo src={arq('mods.mp4')} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// Painel da AULA: mesma curva e mesma janela de tempo da câmera (synchronized-split).
const AulaPainel: React.FC<{entra: number; sai?: number; children: React.ReactNode}> = ({entra, sai, children}) => {
  const t = useAgora();
  const pin = interpolate(t, [entra, entra + 0.9], [0, 1], {...clamp, easing: suave});
  const pout = sai ? interpolate(t, [sai - 0.9, sai], [0, 1], {...clamp, easing: suave}) : 0;
  const state = getSynchronizedSplitState(pin * (1 - pout), AULA_CFG);
  return (
    <SynchronizedSplitPanel state={state}>
      <Papel>{children}</Papel>
    </SynchronizedSplitPanel>
  );
};

const Rotulo: React.FC<{em: number; texto: string; style?: React.CSSProperties}> = ({em, texto, style}) => {
  const p = useEm(em, 0.4);
  return (
    <div style={{position: 'absolute', fontFamily: FONTE.ui, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: COR.terra, opacity: p, ...style}}>
      {texto}
    </div>
  );
};

// Cartão de papel com ícone recortado e legenda.
const Cartao: React.FC<{em: number; src: string; cx: number; cy: number; lado: number; legenda: string; w?: number; px?: number; fonte?: number; style?: React.CSSProperties}> = ({
  em,
  src,
  cx,
  cy,
  lado,
  legenda,
  w = 360,
  px = 200,
  fonte = 32,
  style,
}) => {
  const m = useMola(em);
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        padding: '26px 22px 30px',
        background: COR.papelClaro,
        border: `2px solid ${COR.borda}`,
        borderRadius: 18,
        boxShadow: '0 18px 40px rgba(40,30,20,.18)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        opacity: m,
        transform: `translateY(${(1 - m) * 50}px) rotate(${(1 - m) * -4}deg)`,
        ...style,
      }}
    >
      <Recorte src={src} cx={cx} cy={cy} lado={lado} px={px} />
      <div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: fonte, color: COR.tinta, textAlign: 'center', lineHeight: 1.2}}>{legenda}</div>
    </div>
  );
};

const PrintStats: React.FC<{largura: number}> = ({largura}) => {
  const k = largura / 959;
  return (
    <div style={{width: largura, height: 611 * k, overflow: 'hidden', borderRadius: 12}}>
      <Img src={arq('Captura de Tela 2026-10-10 às 19.20.14.png')} style={{width: 2444 * k, marginLeft: -701 * k, marginTop: -244 * k}} />
    </div>
  );
};

// Zoom de tutorial: aproxima a região da interface que está sendo explicada.
type Foco = {em: number; ate: number; x: number; y: number; s: number};
const Demo: React.FC<{foco?: Foco; children: React.ReactNode}> = ({foco, children}) => {
  const t = useAgora();
  const p = foco
    ? interpolate(t, [foco.em, foco.em + 1.2], [0, 1], {...clamp, easing: suave}) * interpolate(t, [foco.ate - 1, foco.ate], [1, 0], {...clamp, easing: suave})
    : 0;
  // Só a janela do app (primeiro filho) recebe o zoom; os chips ao lado ficam fixos.
  const [app, ...sobre] = React.Children.toArray(children);
  return (
    <Papel>
      <AbsoluteFill style={{transform: `scale(${1 + ((foco?.s ?? 1) - 1) * p})`, transformOrigin: foco ? `${foco.x}px ${foco.y}px` : undefined}}>{app}</AbsoluteFill>
      {sobre}
    </Papel>
  );
};
const APP_POS = {left: 70, top: 90};

// ---------- Cenas ----------

const C02: React.FC = () => {
  const t = useAgora();
  return (
    <Demo foco={{em: 10.2, ate: 13.6, x: 1170, y: 330, s: 1.3}}>
      <ClaudeApp
        style={APP_POS}
        inicio={t < 8.3}
        prompt={t < 8.3 ? {texto: 'Cria um mod que mostra minhas estatísticas de uso num painel', de: 5.2, ate: 7.9} : undefined}
        conversa={
          t >= 8.3 && (
            <>
              <Usuario em={8.3} texto="Cria um mod que mostra minhas estatísticas de uso num painel" />
              <Linha em={8.9}>Claro. Vou mudar a sua interface com um mod.</Linha>
              <Ferramenta em={9.4} nome="Write" arg="~/.claude/mods/estatisticas/mod.ts" />
              <Linha em={11.4} style={{color: APP.verde}}>✓ Painel adicionado à sua interface.</Linha>
            </>
          )
        }
        painel={{
          em: 9.9,
          largura: 470,
          conteudo: (
            <>
              <TituloPainel texto="Mod · Estatísticas" />
              <PrintStats largura={414} />
            </>
          ),
        }}
      />
      <Chip em={11.9} texto="personalizado pra você" tom="terra" tamanho={30} giro={3} style={{left: 1450, top: 180}} />
    </Demo>
  );
};

const TerminalRiscado: React.FC = () => {
  const m = useMola(14.9);
  const r = useEm(15.8, 0.35);
  return (
    <div style={{position: 'absolute', left: 150, top: 250, width: 300, height: 220, opacity: m, transform: `scale(${0.8 + 0.2 * m}) rotate(-3deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: '#1B1A19', borderRadius: 22, border: `4px solid ${COR.papelClaro}`, boxShadow: '0 20px 50px rgba(0,0,0,.5)', padding: 30, fontFamily: FONTE.mono, fontSize: 64, color: COR.papelClaro}}>
        {'>_'}
      </div>
      <div style={{position: 'absolute', left: -30, top: 100, width: 360 * r, height: 16, background: COR.vermelho, borderRadius: 8, transform: 'rotate(-28deg)', transformOrigin: 'left center', boxShadow: '0 4px 10px rgba(0,0,0,.3)'}} />
    </div>
  );
};

const C05: React.FC = () => (
  <AulaPainel entra={23.1} sai={37.9}>
    <Rotulo em={23.5} texto="ATÉ AQUI" style={{left: 110, top: 100}} />
    <Titulo em={23.6} linhas={['Você personalizava', 'como ele trabalha']} destaque={['como']} tamanho={92} cor={COR.tinta} style={{left: 110, top: 150}} />
    <Cartao em={30.2} src="I1_icones.png" cx={0.19} cy={0.5} lado={0.26} legenda="Skills" style={{left: 110, top: 430}} />
    <Cartao em={31.2} src="I1_icones.png" cx={0.48} cy={0.5} lado={0.26} legenda="Conectores" style={{left: 510, top: 430}} />
    <Cartao em={33.3} src="I1_icones.png" cx={0.835} cy={0.5} lado={0.26} legenda="Ferramentas" style={{left: 910, top: 430}} />
    <Chip em={34.6} texto={<>→ definiam o <b style={{color: COR.terra, margin: '0 8px'}}>como</b> nos seus documentos</>} tamanho={32} giro={-1} style={{left: 110, top: 880}} />
  </AulaPainel>
);

const C07: React.FC = () => (
  <AulaPainel entra={43.3} sai={53.8}>
    <Rotulo em={43.6} texto="COM MODS" style={{left: 110, top: 100}} />
    <Titulo em={43.7} linhas={['Muda o ambiente', 'onde ele trabalha']} destaque={['ambiente']} tamanho={92} cor={COR.tinta} style={{left: 110, top: 150}} />
    <Cartao em={44.3} src="I2_poderes.png" cx={0.2} cy={0.5} lado={0.27} legenda={'Mudar uma decisão\nantes que aconteça'} w={380} fonte={28} style={{left: 110, top: 430, whiteSpace: 'pre-line'}} />
    <Cartao em={46.3} src="I2_poderes.png" cx={0.5} cy={0.55} lado={0.27} legenda={'Alterar o que\naparece na tela'} w={380} fonte={28} style={{left: 520, top: 430, whiteSpace: 'pre-line'}} />
    <Cartao em={48.4} src="I2_poderes.png" cx={0.815} cy={0.55} lado={0.27} legenda={'Criar um recurso\nque não existia'} w={380} fonte={28} style={{left: 930, top: 430, whiteSpace: 'pre-line'}} />
  </AulaPainel>
);

const C09: React.FC = () => {
  const t = useAgora();
  const fecha = interpolate(t, [75.3, 75.7], [1, 0], {...clamp, easing: suave});
  const abre = useMola(75.9);
  return (
    <Demo foco={{em: 68.6, ate: 75.2, x: 760, y: 330, s: 1.22}}>
      {t < 75.8 && (
        <div style={{position: 'absolute', inset: 0, opacity: fecha, transform: `scale(${0.7 + 0.3 * fecha})`, transformOrigin: '50% 100%'}}>
          <ClaudeApp
            style={APP_POS}
            inicio={t < 66.9}
            abaCodeEm={60.9}
            prompt={t < 66.9 ? {texto: 'Cria um mod: quando eu terminar uma tarefa, abre um painel com meus gastos e tokens', de: 63.4, ate: 66.4} : undefined}
            cursor={t < 63.4 ? {pontos: [{t: 60.0, x: 820, y: 520}, {t: 60.8, x: 236, y: 30}, {t: 61.8, x: 236, y: 30}, {t: 62.8, x: 700, y: 770}], cliques: [60.85, 62.85]} : undefined}
            conversa={
              t >= 66.9 && (
                <>
                  <Usuario em={66.9} texto="Cria um mod: quando eu terminar uma tarefa, abre um painel com meus gastos e tokens" />
                  <Linha em={67.4}>Vou modificar o próprio sistema e criar esse painel para você.</Linha>
                  <Ferramenta em={68.0} nome="Write" arg="~/.claude/mods/painel-uso/mod.ts" />
                  <Codigo
                    de={69.6}
                    ate={71.8}
                    linhas={[
                      "export default defineMod({",
                      "  name: 'painel-uso',",
                      "  on: { taskEnd: (ctx) => {",
                      "    ctx.ui.openPane('Uso', renderStats(ctx.session))",
                      '  } },',
                      '})',
                    ]}
                  />
                  <Ferramenta em={72.2} nome="Edit" arg="interface · painel lateral" cor={COR.terra} />
                  <Linha em={73.3} style={{color: COR.terra}}>✓ Pronto. Feche e abra o app para ativar.</Linha>
                </>
              )
            }
          />
        </div>
      )}
      {t >= 75.8 && (
        <div style={{position: 'absolute', ...APP_POS, width: 1340, opacity: abre, transform: `scale(${0.9 + 0.1 * abre})`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(20,15,10,.45)'}}>
          <Img src={arq('Captura de Tela 2026-10-10 às 19.20.14.png')} style={{width: '100%', display: 'block'}} />
        </div>
      )}
      <Chip em={60.9} texto="aba Code · app desktop" tamanho={28} giro={2} style={{left: 1450, top: 140}} />
      <Chip em={63.6} texto="em linguagem natural" tom="terra" tamanho={28} giro={-2} style={{left: 1450, top: 230}} />
      <Chip em={76.4} texto="mod ativo ✓" tom="salvia" tamanho={30} giro={3} style={{left: 1450, top: 320}} />
    </Demo>
  );
};

const C10: React.FC = () => (
  <Demo>
    <Chip em={77.8} texto="docs oficiais · code.claude.com" tamanho={28} giro={-1} style={{left: 90, top: 70}} />
    <Print
      src="prints/docs-mods.png"
      largura={1300}
      recorte={{x: 690, y: 290, w: 1520, h: 700}}
      marcas={[{x: 726, y: 640, w: 1016, h: 48, em: 80.1}]}
      em={77.8}
      giro={-0.8}
      style={{left: 90, top: 180}}
    />
    <Chip em={83.4} texto="o agente muda o próprio sistema" tom="terra" tamanho={34} giro={-1.5} style={{left: 110, top: 900}} />
  </Demo>
);

const MiniTerminal: React.FC<{em: number}> = ({em}) => {
  const m = useMola(em);
  return (
    <div style={{position: 'absolute', left: 110, top: 400, width: 560, opacity: m, transform: `translateY(${(1 - m) * 40}px)`}}>
      <div style={{height: 330, background: '#1B1A19', borderRadius: 18, padding: '22px 28px', fontFamily: FONTE.mono, fontSize: 28, color: '#D8D4C8', boxShadow: '0 20px 50px rgba(0,0,0,.3)'}}>
        <div style={{display: 'flex', gap: 8, marginBottom: 28}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
          ))}
        </div>
        <div><span style={{color: COR.terra}}>$</span> claude</div>
        <div style={{color: '#8d8a80', marginTop: 10}}>{'>'} /plugin install mod</div>
      </div>
      <div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 36, marginTop: 22, color: COR.tinta}}>Terminal</div>
    </div>
  );
};

const C11: React.FC = () => {
  const m = useMola(90.6);
  const selo = useMola(91.0);
  return (
    <AulaPainel entra={85.2}>
      <Rotulo em={85.6} texto="POUCOS MOSTRAM" style={{left: 110, top: 100}} />
      <Titulo em={86.6} linhas={['Não só no terminal']} destaque={['terminal']} tamanho={92} cor={COR.tinta} style={{left: 110, top: 150}} />
      <MiniTerminal em={89.1} />
      <div style={{position: 'absolute', left: 730, top: 400, width: 600, opacity: m, transform: `translateY(${(1 - m) * 40}px)`}}>
        <div style={{borderRadius: 18, overflow: 'hidden', boxShadow: `0 0 0 4px ${COR.terra}, 0 20px 50px rgba(0,0,0,.3)`}}>
          <Img src={arq('Captura de Tela 2026-10-10 às 19.20.14.png')} style={{width: 600, display: 'block'}} />
        </div>
        <div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 36, marginTop: 22, color: COR.tinta}}>
          App desktop <span style={{color: COR.terra}}>· aba Code</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 1100, top: 330, opacity: selo, transform: `rotate(${8 - 4 * selo}deg) scale(${1.4 - 0.4 * selo})`, fontFamily: FONTE.ui, fontWeight: 700, fontSize: 26, color: '#fff', background: COR.terra, borderRadius: 999, padding: '14px 24px'}}>
        também aqui
      </div>
    </AulaPainel>
  );
};

const Contador: React.FC<{em: number; ate: number; style?: React.CSSProperties}> = ({em, ate, style}) => {
  const t = useAgora();
  const n = Math.round(interpolate(t, [em, em + 0.7], [0, ate], clamp));
  return <Chip em={em} texto={`${n} arquivos`} tom="vermelho" mono tamanho={44} style={style} />;
};

const ARQUIVOS = Array.from({length: 40}, (_, i) => `relatorio-${2022 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}.pdf`);

const ModalExclusao: React.FC = () => {
  const t = useAgora();
  const rolagem = interpolate(t, [136.2, 140.2], [0, 1], {...clamp, easing: suave});
  const pulso = interpolate(t, [140.5, 140.8, 141.1], [0, 1, 0.6], clamp);
  return (
    <div style={{width: 680, background: '#1E1D1B', border: `2px solid ${COR.terra}`, borderRadius: 18, padding: 30, color: APP.texto, fontFamily: FONTE.ui, boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
      <div style={{fontSize: 16, letterSpacing: 2, color: COR.terra, fontWeight: 700}}>⚠  MOD · CONFIRMAR EXCLUSÃO</div>
      <div style={{fontSize: 34, fontWeight: 600, margin: '14px 0 18px'}}>40 arquivos serão apagados</div>
      <div style={{height: 230, overflow: 'hidden', background: '#161615', borderRadius: 10, padding: '6px 16px', fontFamily: FONTE.mono, fontSize: 17, color: '#BDB9AD'}}>
        <div style={{transform: `translateY(${-rolagem * (40 * 30 - 220)}px)`}}>
          {ARQUIVOS.map((a) => (
            <div key={a} style={{height: 30, lineHeight: '30px'}}>🗎  relatorios-antigos/{a}</div>
          ))}
        </div>
      </div>
      <div style={{display: 'flex', gap: 12, marginTop: 22, fontSize: 19, fontWeight: 600}}>
        <div style={{padding: '12px 20px', borderRadius: 10, background: '#2B2A27'}}>Cancelar</div>
        <div style={{padding: '12px 20px', borderRadius: 10, background: COR.salvia, color: '#fff'}}>Mover para a lixeira</div>
        <div style={{padding: '12px 20px', borderRadius: 10, border: `2px solid ${COR.vermelho}`, color: '#F2A49B', boxShadow: `0 0 0 ${pulso * 8}px rgba(192,69,58,.35)`}}>Apagar</div>
      </div>
    </div>
  );
};

const C16: React.FC = () => (
  <Demo foco={{em: 134.4, ate: 141.6, x: 740, y: 470, s: 1.3}}>
    <ClaudeApp
      style={APP_POS}
      conversa={
        <>
          <Usuario em={132.9} texto="Limpa a pasta relatorios-antigos" />
          <Linha em={133.1}>Certo, vou remover a pasta inteira.</Linha>
          <Ferramenta em={133.2} nome="Bash" arg="rm -r relatorios-antigos/" cor={COR.vermelho} />
        </>
      }
      modal={{em: 133.6, conteudo: <ModalExclusao />}}
    />
    <Chip em={133.6} texto="o mod interrompe" tom="terra" tamanho={30} giro={3} style={{left: 1450, top: 180}} />
  </Demo>
);

const C18: React.FC = () => {
  const pensa = useEm(165.9, 0.5);
  return (
    <Demo foco={{em: 157.8, ate: 170.0, x: 1180, y: 380, s: 1.25}}>
      <ClaudeApp
        style={APP_POS}
        conversa={
          <>
            <Usuario em={153.8} texto="Organiza a proposta do cliente" />
            <Ferramenta em={154.4} nome="Read" arg="briefing.docx" />
            <Ferramenta em={155.0} nome="Write" arg="estrutura.md" />
            <Ferramenta em={155.6} nome="Edit" arg="proposta.docx" />
            <div style={{marginTop: 18, opacity: pensa, borderLeft: `3px solid ${COR.terra}`, paddingLeft: 16, fontStyle: 'italic', color: APP.apagado, fontSize: 20, lineHeight: 1.5}}>
              ◌ Pensando… o cliente pediu um tom mais direto. Ajustar a seção 2 antes de gerar o PDF.
            </div>
          </>
        }
        painel={{
          em: 157.3,
          largura: 440,
          conteudo: (
            <>
              <TituloPainel texto="Mod · Histórico" />
              <ItemPainel em={157.8} texto="Leu briefing.docx" />
              <ItemPainel em={158.5} texto="Criou estrutura.md" />
              <ItemPainel em={159.2} texto="Editou proposta.docx" />
              <ItemPainel em={162.2} texto="Revisou o tom" />
              <div style={{height: 18}} />
              <Linha em={163.5}><TituloPainel texto="Próximos passos" /></Linha>
              <ItemPainel em={163.8} icone="○" texto="Gerar o PDF" apagado cor={APP.apagado} />
              <ItemPainel em={164.3} icone="○" texto="Enviar para revisão" apagado cor={APP.apagado} />
            </>
          ),
        }}
      />
      <Chip em={157.5} texto="histórico de ações" tom="terra" tamanho={30} giro={3} style={{left: 1450, top: 180}} />
      <Chip em={165.9} texto="+ a janela de pensamentos" tamanho={28} giro={-2} style={{left: 1450, top: 270}} />
    </Demo>
  );
};

const C19: React.FC = () => (
  <Demo foco={{em: 175.4, ate: 186.2, x: 1640, y: 420, s: 1.25}}>
    <ClaudeApp
      style={{left: 500, top: 90}}
      conversa={
        <>
          <Usuario em={169.6} texto="Finaliza a proposta" />
          <Ferramenta em={170.2} nome="Edit" arg="proposta.docx" />
          <Linha em={172.2} style={{color: APP.verde}}>✓ Tarefa concluída.</Linha>
        </>
      }
      painel={{
        em: 174.8,
        largura: 480,
        conteudo: (
          <>
            <Linha em={179.1}><TituloPainel texto="Próximos passos" /></Linha>
            <ItemPainel em={179.3} icone="→" texto="Gerar o PDF da proposta" cor={APP.texto} />
            <ItemPainel em={179.8} icone="→" texto="Atualizar o cronograma" cor={APP.texto} />
            <div style={{height: 14}} />
            <Linha em={181.2}><TituloPainel texto="Preparando" /></Linha>
            <ItemPainel em={181.4} icone="◐" texto="Rascunho do e-mail ao cliente" cor={APP.apagado} />
            <div style={{height: 14}} />
            <Linha em={182.4}><TituloPainel texto="Precisa de você" cor={COR.terra} /></Linha>
            <ItemPainel em={182.6} icone="!" texto="Aprovar o valor final" cor={COR.terra} destaque />
          </>
        ),
      }}
    />
    <Chip em={174.8} texto="painel do lado" tom="terra" tamanho={30} giro={-3} style={{left: 70, top: 180}} />
  </Demo>
);

const C22: React.FC = () => {
  const t = useAgora();
  const pulsa = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <Demo foco={{em: 200.6, ate: 207.7, x: 1180, y: 360, s: 1.25}}>
      <ClaudeApp
        style={APP_POS}
        conversa={
          <>
            <Usuario em={198.4} texto="Continua a fase 3" />
            <Ferramenta em={199.2} nome="Edit" arg="src/prototipo/app.ts" />
            <Codigo de={200.0} ate={204.5} linhas={['import { etapas } from "./plano"', '', 'export function avancar(fase) {', '  etapas[fase].status = "em andamento"', '  return render(etapas)', '}']} />
          </>
        }
        painel={{
          em: 199.8,
          largura: 480,
          conteudo: (
            <>
              <TituloPainel texto="Mod · Plano do projeto" />
              <ItemPainel em={200.3} texto="Fase 1 · Pesquisa" />
              <ItemPainel em={200.7} texto="Fase 2 · Arquitetura" />
              <div style={{boxShadow: `0 0 0 ${2 + pulsa * 4}px rgba(217,119,87,.35)`, borderRadius: 10, marginBottom: 8}}>
                <ItemPainel em={201.1} icone="◉" texto="Fase 3 · Protótipo" cor={COR.terra} destaque />
              </div>
              <ItemPainel em={201.5} icone="○" texto="Fase 4 · Testes" apagado cor={APP.apagado} />
              <ItemPainel em={201.9} icone="○" texto="Fase 5 · Entrega" apagado cor={APP.apagado} />
            </>
          ),
        }}
      />
      <Chip em={202.2} texto="todas as etapas à vista" tom="terra" tamanho={30} giro={3} style={{left: 1450, top: 180}} />
      <Chip em={206.4} texto="o plano de ação" tamanho={28} giro={-2} style={{left: 1450, top: 270}} />
    </Demo>
  );
};

const Carimbo: React.FC = () => {
  const m = useMola(221.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: 130,
        top: 290,
        opacity: m,
        transform: `rotate(-9deg) scale(${1.6 - 0.6 * m})`,
        fontFamily: FONTE.titulo,
        fontWeight: 600,
        fontSize: 120,
        color: COR.vermelho,
        border: `7px solid ${COR.vermelho}`,
        borderRadius: 16,
        padding: '0 30px',
        background: 'rgba(250,249,245,.85)',
        letterSpacing: 4,
      }}
    >
      INÚTIL
    </div>
  );
};

const SetaDescricao: React.FC = () => {
  const t = useAgora();
  const p = useEm(245.8, 0.4);
  return (
    <div style={{position: 'absolute', left: 220, top: 520 + Math.sin(t * 5) * 14, opacity: p, fontFamily: FONTE.titulo, fontSize: 150, color: COR.terra, textShadow: '0 6px 20px rgba(0,0,0,.35)'}}>↓</div>
  );
};

const C27: React.FC = () => {
  const t = useAgora();
  const a = interpolate(t, [264.1, 264.5], [1, 0], clamp);
  const b = interpolate(t, [264.5, 264.9], [0, 1], clamp);
  const v = useMola(253.8);
  return (
    <AulaPainel entra={253.4} sai={278.2}>
      {a > 0 && (
        <AbsoluteFill style={{opacity: a}}>
          <Rotulo em={253.8} texto="SKILL × MOD" style={{left: 110, top: 80}} />
          <div style={{position: 'absolute', left: 110, top: 140, width: 1000, height: 563, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 60px rgba(40,30,20,.25)', opacity: v, transform: `translateY(${(1 - v) * 40}px)`}}>
            <Img src={arq('hf/V9a_atelie.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
            <Sequence from={f(255.3) - f(253.6)} layout="none">
              <OffthreadVideo src={arq('hf/V9_atelie.mp4')} muted playbackRate={0.9} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
            </Sequence>
          </div>
          <Chip em={256.5} texto={<><b style={{marginRight: 10}}>skill</b> instrui COMO fazer uma tarefa</>} tamanho={34} style={{left: 110, top: 760}} />
          <Chip em={260.8} texto={<><b style={{marginRight: 10}}>mod</b> muda o ambiente de TODAS</>} tom="terra" tamanho={34} style={{left: 110, top: 860}} />
        </AbsoluteFill>
      )}
      {b > 0 && (
        <AbsoluteFill style={{opacity: b}}>
          <Rotulo em={264.6} texto="NO TRABALHO" style={{left: 110, top: 80}} />
          <Titulo em={264.7} linhas={['Mais controle', 'sobre o Claude']} destaque={['controle']} tamanho={80} cor={COR.tinta} style={{left: 110, top: 125}} />
          {(
            [
              [268.4, 0.135, 0.27, 'Operações delicadas'],
              [270.6, 0.38, 0.27, 'Segurança'],
              [271.3, 0.62, 0.26, 'Acompanhar o processo'],
              [273.4, 0.867, 0.28, 'Limites da sessão'],
              [275.7, 0.138, 0.74, 'Gastos'],
              [276.5, 0.378, 0.74, 'Janela de contexto'],
              [277.7, 0.623, 0.74, 'Cache'],
            ] as const
          ).map(([em, cx, cy, legenda], i) => (
            <Cartao key={legenda} em={em} src="I3_beneficios.png" cx={cx} cy={cy} lado={0.2} legenda={legenda} w={210} px={120} fonte={22} style={{left: 110 + (i % 4) * 228, top: 330 + Math.floor(i / 4) * 290}} />
          ))}
          <Print
            src="Captura de Tela 2026-10-10 às 19.20.14.png"
            largura={360}
            recorte={{x: 701, y: 244, w: 959, h: 611}}
            marcas={[{x: 1338, y: 345, w: 297, h: 80, em: 276.1}]}
            em={275.7}
            giro={3}
            style={{left: 1030, top: 640}}
          />
        </AbsoluteFill>
      )}
    </AulaPainel>
  );
};

const C31: React.FC = () => (
  <Demo>
    <ClaudeApp style={APP_POS} inicio />
    <Chip em={293.7} texto="a seguir: demonstração" tom="terra" tamanho={30} giro={3} style={{left: 1450, top: 180}} />
    <Chip em={296.3} texto="problemas reais do dia a dia" tamanho={26} giro={-2} style={{left: 1440, top: 270}} />
  </Demo>
);

const EXEMPLOS = [127.5, 141.4, 154.1, 169.8, 188.7, 207.5];

const Trilho: React.FC = () => {
  const t = useAgora();
  const atual = EXEMPLOS.filter((e) => t >= e).length;
  return (
    <div style={{position: 'absolute', left: 30, top: 22, display: 'flex', gap: 8, alignItems: 'center', fontFamily: FONTE.ui, fontWeight: 700, fontSize: 18}}>
      <div style={{color: COR.papelClaro, background: 'rgba(20,20,19,.75)', padding: '6px 12px', borderRadius: 8, letterSpacing: 3}}>EXEMPLO</div>
      {EXEMPLOS.map((_, i) => (
        <div
          key={i}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            display: 'grid',
            placeItems: 'center',
            background: i + 1 === atual ? COR.terra : 'rgba(250,249,245,.85)',
            color: i + 1 === atual ? '#fff' : COR.cinza,
            transform: `scale(${i + 1 === atual ? 1.12 : 1})`,
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

// ---------- Composição ----------

export const Mods: React.FC = () => (
  <AbsoluteFill style={{background: COR.papel}}>
    <Fontes />

    {/* Camada de fundo: aula e demos ficam atrás da câmera (que vira painel ou card). */}
    <Cena de={4.3} ate={13.5}><C02 /></Cena>
    <Cena de={23.3} ate={37.9}><C05 /></Cena>
    <Cena de={43.5} ate={53.8}><C07 /></Cena>
    <Cena de={60.6} ate={77.6}><C09 /></Cena>
    <Cena de={77.6} ate={85.4} entrada="fade"><C10 /></Cena>
    <Cena de={85.4} ate={91.9}><C11 /></Cena>
    <Cena de={133.3} ate={141.4}><C16 /></Cena>
    <Cena de={154.1} ate={169.8}><C18 /></Cena>
    <Cena de={169.8} ate={186.0} entrada="fade"><C19 /></Cena>
    <Cena de={198.7} ate={207.5}><C22 /></Cena>
    <Cena de={253.6} ate={278.2}><C27 /></Cena>
    <Cena de={291.5} ate={299.6}><C31 /></Cena>

    <Camera />

    {/* Camada da frente: elementos sobre a câmera cheia e B-rolls em tela cheia. */}
    <Cena de={0} ate={4.3}>
      <Titulo em={0.2} linhas={['mods.']} destaque={['mods.']} tamanho={190} style={{left: 90, top: 70}} />
      <Chip em={1.0} texto="a maior atualização desde as skills" tamanho={30} style={{left: 100, top: 320}} />
      <Print src="prints/x-anuncio-recorte.png" largura={560} recorte={{x: 0, y: 40, w: 1150, h: 540}} marcas={[{x: 18, y: 58, w: 495, h: 44, em: 1.8}]} em={1.4} giro={-2.5} style={{left: 100, top: 450}} />
    </Cena>
    <Cena de={13.5} ate={18.2} saida="fade">
      <TerminalRiscado />
      <Chip em={16.0} texto="sem abrir o terminal" tom="terra" tamanho={38} style={{left: 130, top: 560}} />
    </Cena>
    <Cena de={18.2} ate={23.3} entrada="rasgo">
      <Broll src="V1_balao-janela.mp4" duracaoClipe={5.04} />
      <Chip em={19.4} texto="você pede em linguagem natural" tamanho={38} style={{left: 90, top: 820}} />
      <Chip em={20.9} texto="e o Claude configura tudo" tom="terra" tamanho={38} style={{left: 90, top: 920}} />
    </Cena>
    <Cena de={37.9} ate={43.5} entrada="fade">
      <Broll src="V2_estudio-na-janela.mp4" duracaoClipe={8.04} />
      <Chip em={41.9} texto="mods mudam ONDE ele trabalha" tom="terra" tamanho={40} style={{left: 90, top: 930}} />
    </Cena>
    <Cena de={53.8} ate={60.6} saida="fade">
      <Chip em={54.6} texto="o mais interessante" tamanho={32} style={{left: 110, top: 230}} />
      <Titulo em={56.7} linhas={['Sem abrir', 'o terminal.']} destaque={['terminal.']} tamanho={130} style={{left: 110, top: 360}} />
    </Cena>
    <Cena de={91.9} ate={102.0} entrada="rasgo">
      <Broll src="V3_documentos.mp4" duracaoClipe={8.04} />
      <Chip em={94.8} texto="para quem não é técnico" tamanho={38} style={{left: 90, top: 860}} />
      <Chip em={100.6} texto="arquivos e documentos" tom="terra" tamanho={38} style={{left: 90, top: 960}} />
    </Cena>
    <Cena de={102.0} ate={114.7} saida="fade">
      <Chip em={103.0} texto="não programa" tamanho={36} risca={104.7} style={{left: 110, top: 260}} />
      <Chip em={105.3} texto="não faz vibe coding" tamanho={36} risca={105.9} style={{left: 110, top: 360}} />
      <Chip em={106.9} texto="trabalha com documentos" tom="salvia" tamanho={36} style={{left: 110, top: 460}} />
      <Chip em={108.2} texto="o maior poder da atualização" tom="terra" tamanho={36} giro={-2.5} style={{left: 110, top: 600}} />
      <Chip em={113.5} texto="no SEU fluxo de trabalho" tom="escuro" tamanho={36} style={{left: 110, top: 720}} />
    </Cena>
    <Cena de={114.7} ate={120.0} saida="fade">
      <Titulo em={115.5} linhas={['6 exemplos', 'na prática']} destaque={['6']} tamanho={110} style={{left: 110, top: 330}} />
    </Cena>
    <Cena de={127.5} ate={133.3}>
      <Broll src="V4_pasta.mp4" duracaoClipe={5.04} />
      <Chip em={129.4} texto="o Claude vai apagar uma pasta" tamanho={36} style={{left: 90, top: 110}} />
      <Contador em={130.9} ate={40} style={{left: 90, top: 210}} />
    </Cena>
    <Cena de={141.4} ate={151.2} entrada="rasgo">
      <Broll src="V5_lixeira.mp4" duracaoClipe={8.04} />
      <Chip em={144.9} texto="outro mod: manda para a lixeira" tom="salvia" tamanho={38} style={{left: 90, top: 140}} />
    </Cena>
    <Cena de={151.2} ate={154.1}>
      <Chip em={151.3} texto="padrão: exclusão definitiva" tom="vermelho" tamanho={36} style={{left: 110, top: 360}} />
      <Chip em={153.4} texto="com mod: vai para a lixeira" tom="salvia" tamanho={36} style={{left: 110, top: 470}} />
    </Cena>
    <Cena de={186.0} ate={188.7}>
      <Titulo em={186.2} linhas={['E agora,', 'o que eu faço?']} destaque={['faço?']} tamanho={92} passo={0.09} style={{left: 110, top: 340}} />
    </Cena>
    <Cena de={188.7} ate={198.7} entrada="rasgo">
      <Broll src="V6_degraus.mp4" duracaoClipe={8.04} />
      <Chip em={192.4} texto="projeto com várias etapas" tamanho={38} style={{left: 90, top: 110}} />
      <Chip em={197.1} texto="sem se perder nas fases" tom="terra" tamanho={38} style={{left: 90, top: 210}} />
    </Cena>
    <Cena de={207.5} ate={218.0}>
      <Broll src="V7_multiplayer.mp4" duracaoClipe={8.04} />
      <Chip em={211.5} texto="um mod de jogo multiplayer" tamanho={38} style={{left: 90, top: 110}} />
      <Chip em={213.7} texto="jogando enquanto o Claude trabalha" tom="terra" tamanho={38} style={{left: 90, top: 210}} />
    </Cena>
    <Cena de={218.0} ate={230.5} saida="fade">
      <Carimbo />
      <Chip em={226.3} texto="mostra o poder da personalização" tom="terra" tamanho={34} style={{left: 110, top: 640}} />
    </Cena>
    <Cena de={230.5} ate={242.3} entrada="rasgo">
      <Broll src="V8_harness.mp4" duracaoClipe={10.04} />
      <Chip em={234.4} texto="harness" tom="escuro" mono tamanho={50} style={{left: 90, top: 860}} />
      <Chip em={235.2} texto="o motor que coordena o agente" tamanho={38} style={{left: 400, top: 875}} />
      <Chip em={239.4} texto="você só descreve a mudança" tom="terra" tamanho={38} style={{left: 90, top: 975}} />
    </Cena>
    <Cena de={242.3} ate={253.6} saida="fade">
      <Chip em={243.3} texto="exporta para outros sistemas" tamanho={36} style={{left: 110, top: 280}} />
      <Chip em={245.6} texto="mods + prompts na descrição" tom="terra" tamanho={40} style={{left: 110, top: 400}} />
      <SetaDescricao />
    </Cena>
    <Cena de={285.0} ate={291.6} saida="fade">
      <Chip em={285.7} texto="um recorte importante" tamanho={30} style={{left: 110, top: 220}} />
      <Chip em={288.1} texto="Claude Code" tom="escuro" tamanho={40} giro={0} style={{left: 110, top: 320}} />
      <Chip em={289.5} texto="› aba Code" tamanho={40} giro={0} style={{left: 180, top: 430}} />
      <Chip em={290.9} texto="› app desktop" tom="terra" tamanho={40} giro={0} style={{left: 250, top: 540}} />
    </Cena>

    <Cena de={127.5} ate={230.5}><Trilho /></Cena>
  </AbsoluteFill>
);
