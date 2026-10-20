import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, useCurrentFrame} from 'remotion';
import {enquadrarRosto, FORMATOS_CARD, type ZonaRosto} from '../../_shared/synchronized-split';
import {Asterisco, COR, Cena, MEIA_TELA, molduraColada, FONTE, FPS, Fita, Folha, Fontes, Palavras, Papel, Texto3D, arq, clamp, suave, useAgora, useCena, useEm, useMola} from './base';
import {BoasVindas, CC, Ferramenta, Permissao, Prompt, Spinner, Terminal, Usuario} from '../../estilos/claude-code';

// ---------- Câmera: uma única instância do master; só o contêiner se move ----------

// Zona do rosto medida nos quadros reais (1/s, 53 quadros): x 680–1210, y 40–760.
const ROSTO: ZonaRosto = {x0: 680, y0: 40, x1: 1210, y1: 760};
type Ret = {l: number; t: number; w: number; h: number; r: number; vs: number; vx: number; vy: number};

const card = (l: number, t: number, w: number, h: number, r = 30): Ret => {
  const e = enquadrarRosto({w, h}, ROSTO);
  return {l, t, w, h, r, vs: e.scale, vx: e.x, vy: e.y};
};
const push = (s: number): Ret => ({l: 0, t: 0, w: 1920, h: 1080, r: 0, vs: s, vx: -945 * (s - 1), vy: -400 * (s - 1)});
const CHEIA = push(1);
const VERT = card(1300, 105, FORMATOS_CARD.vertical.w, FORMATOS_CARD.vertical.h);
const QUAD = card(1240, 230, FORMATOS_CARD.quadrado.w, FORMATOS_CARD.quadrado.h);
const MINI = card(1510, 600, FORMATOS_CARD.mini.w, FORMATOS_CARD.mini.h, 24);
// Meia tela: câmera à direita da faixa de papel, rosto inteiro pela zona medida (sem ampliar).
const ESPACO = card(MEIA_TELA.camera.l, MEIA_TELA.camera.t, FORMATOS_CARD.meia.w, FORMATOS_CARD.meia.h, 0);

// [início, layout, duração da transição]
const CAMERA: [number, Ret, number][] = [
  [0, push(1.04), 0.6],
  [0.25, VERT, 0.9],
  [4.5, QUAD, 0.9],
  [15.55, ESPACO, 0.8],
  [18.1, MINI, 0.9],
  [30.75, VERT, 0.9],
  [37.8, CHEIA, 0.8],
  [38.6, push(1.05), 1.8],
  [40.35, ESPACO, 0.8],
  [43.05, VERT, 0.9],
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
  const k = Math.min(1, c.r / 24);
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
        boxShadow: molduraColada(k),
      }}
    >
      <div style={{position: 'absolute', left: c.vx, top: c.vy, width: 1920 * c.vs, height: 1080 * c.vs}}>
        <OffthreadVideo src={arq('video/harness.mp4')} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// Fita sobre o card da câmera, só quando ele está assentado.
const FitaCamera: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = retEm(t);
  const k = interpolate(c.r, [20, 30], [0, 1], clamp);
  if (k <= 0) return null;
  return <Fita giro={-32} style={{left: c.l - 46, top: c.t + 8, opacity: k, width: 120 * Math.min(1, c.w / 500)}} />;
};

// ---------- Peças ----------

const Entra: React.FC<{em: number; de?: 'baixo' | 'esq' | 'dir' | 'cima'; giro?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  em,
  de = 'baixo',
  giro = 0,
  style,
  children,
}) => {
  const m = useMola(em);
  const d = 70 * (1 - m);
  const tr = {baixo: `translateY(${d}px)`, cima: `translateY(${-d}px)`, esq: `translateX(${-d}px)`, dir: `translateX(${d}px)`}[de];
  return <div style={{position: 'absolute', opacity: Math.min(1, m * 1.5), transform: `${tr} rotate(${giro * m}deg) scale(${0.94 + 0.06 * m})`, ...style}}>{children}</div>;
};

const Rotulo: React.FC<{children: React.ReactNode; cor?: string; fundo?: string; tamanho?: number; style?: React.CSSProperties}> = ({
  children,
  cor = '#fff',
  fundo = COR.terra,
  tamanho = 30,
  style,
}) => (
  <div
    style={{
      display: 'inline-block',
      padding: `${tamanho * 0.3}px ${tamanho * 0.65}px`,
      background: fundo,
      color: cor,
      fontFamily: FONTE.ui,
      fontWeight: 700,
      fontSize: tamanho,
      borderRadius: 6,
      boxShadow: '0 8px 18px rgba(60,30,10,.25)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

// Traço desenhado (SVG path) que acompanha a fala.
const Traco: React.FC<{d: string; em: number; dur?: number; cor?: string; espessura?: number; tracejado?: boolean; seta?: boolean; w?: number; h?: number; style?: React.CSSProperties}> = ({
  d,
  em,
  dur = 0.7,
  cor = COR.terra,
  espessura = 7,
  tracejado,
  seta,
  w = 1920,
  h = 1080,
  style,
}) => {
  const p = useEm(em, dur);
  const id = `seta-${em}`;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={cor} />
        </marker>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={w + 400} height={h + 400}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={espessura + 8} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
        strokeDasharray={tracejado ? '1 20' : undefined}
        mask={`url(#${id}-m)`}
        opacity={p > 0 ? 1 : 0}
        markerEnd={seta && p > 0.97 ? `url(#${id})` : undefined}
      />
    </svg>
  );
};

// Ilustração ou B-roll em tela cheia. O clipe desacelera um pouco para cobrir a cena e congela no fim.
const Broll: React.FC<{src: string; duracaoClipe: number}> = ({src, duracaoClipe}) => {
  const frame = useCurrentFrame();
  const {de, ate} = useCena();
  const cena = ate - de;
  const rate = Math.min(1.3, Math.max(0.75, duracaoClipe / cena));
  const fim = Math.floor(((duracaoClipe - 0.15) / rate) * FPS);
  const zoom = interpolate(frame, [0, cena * FPS], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{background: COR.papel, overflow: 'hidden'}}>
      <Freeze frame={fim} active={frame >= fim}>
        <OffthreadVideo src={arq(`hf/${src}`)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
      </Freeze>
    </AbsoluteFill>
  );
};

// ---------- Cena 1: abertura no Claude Code ----------

const Abertura: React.FC = () => {
  const t = useAgora();
  const m = useMola(0.75, 16);
  const pedidos: {txt: string; de: number; ate: number; tool: [string, string, string]}[] = [
    {txt: 'crie uma página de vendas', de: 1.18, ate: 1.62, tool: ['Write', 'index.html', 'Wrote 148 lines to index.html']},
    {txt: 'organize os arquivos da pasta', de: 2.16, ate: 2.66, tool: ['Bash', 'mkdir docs && mv *.pdf docs/', 'Moved 23 files']},
    {txt: 'termine o relatório', de: 3.46, ate: 3.9, tool: ['Update', 'relatorio.md', 'Updated relatorio.md with 3 sections']},
  ];
  const atual = pedidos.find((p) => t < p.ate + 0.28);
  return (
    <Papel>
      <div style={{position: 'absolute', left: 70, top: 92, width: 1170, height: 900, opacity: m, transform: `perspective(1800px) rotateY(${(1 - m) * 18 + 3}deg) rotateX(${(1 - m) * 8}deg) translateY(${(1 - m) * 80}px) rotate(-0.8deg)`, transformOrigin: '20% 50%'}}>
        <Terminal largura={1170} altura={900} fonte={23}>
          <BoasVindas nome="Macks Wendhell" />
          <div style={{flex: 1, overflow: 'hidden', paddingTop: 6}}>
            {pedidos
              .filter((p) => t >= p.ate + 0.28)
              .map((p) => (
                <div key={p.txt}>
                  <Usuario texto={p.txt} />
                  <Ferramenta nome={p.tool[0]} arg={p.tool[1]} resultado={t >= p.ate + 0.7 ? p.tool[2] : undefined} />
                </div>
              ))}
            {t >= 4.0 && <Spinner texto="Working…" />}
          </div>
          <Prompt texto={atual?.txt} de={atual?.de} ate={atual?.ate} />
        </Terminal>
        <Fita style={{left: -40, top: -8}} />
        <Fita giro={35} style={{right: -40, top: -8}} />
      </div>
    </Papel>
  );
};

// ---------- Cenas 2 e 3: o modelo e as peças em volta ----------

const CX = 600;
const CY = 545;

const Peca: React.FC<{em: number; n: string; nome: string; x: number; y: number; giro: number; destaque?: number; children: React.ReactNode}> = ({
  em,
  n,
  nome,
  x,
  y,
  giro,
  destaque,
  children,
}) => {
  const t = useAgora();
  const aceso = destaque !== undefined && t >= destaque;
  return (
    <Entra em={em} giro={giro} style={{left: x, top: y}}>
      <Folha style={{width: 470, height: 236}}>
        <div style={{padding: '20px 26px'}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12}}>
            <span style={{fontFamily: FONTE.mono, fontSize: 22, color: COR.terra, fontWeight: 700}}>{n}</span>
            <span style={{fontFamily: FONTE.titulo, fontSize: 44, fontWeight: 600, color: COR.tinta, letterSpacing: -1}}>{nome}</span>
          </div>
          <div style={{background: CC.fundo, borderRadius: 10, padding: '12px 16px', fontFamily: FONTE.mono, fontSize: 19, lineHeight: 1.45, color: CC.texto, boxShadow: aceso ? `0 0 0 4px ${COR.terra}` : 'none'}}>
            {children}
          </div>
        </div>
      </Folha>
    </Entra>
  );
};

const Estrutura: React.FC = () => {
  const t = useAgora();
  const mModelo = useMola(4.82, 13);
  const pAnel = useEm(8.18, 0.9);
  const pPergunta = useEm(6.44, 0.6) * (1 - pAnel);
  const anel = 235;
  return (
    <Papel>
      {/* contorno tracejado de "algo maior" e o anel de papel da estrutura */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={CX} cy={CY} r={anel} fill="none" stroke={COR.cinza} strokeWidth={4} strokeDasharray="10 16" opacity={pPergunta} />
        <circle cx={CX} cy={CY} r={anel} fill="none" stroke={COR.salvia} strokeWidth={70 * pAnel} opacity={pAnel} style={{filter: 'drop-shadow(0 10px 14px rgba(60,40,20,.25))'}} />
        <circle cx={CX} cy={CY} r={anel} fill="none" stroke={COR.salviaEscuro} strokeWidth={2} strokeDasharray="4 10" opacity={pAnel} />
      </svg>
      {pPergunta > 0.01 && (
        <div style={{position: 'absolute', left: CX + 150, top: CY - 260, fontFamily: FONTE.titulo, fontSize: 90, fontStyle: 'italic', color: COR.cinza, opacity: pPergunta}}>?</div>
      )}
      <Entra em={9.2} style={{left: CX - 105, top: CY - anel - 58}}>
        <Rotulo fundo={COR.salviaEscuro} tamanho={26}>estrutura</Rotulo>
      </Entra>

      {/* o modelo, peça central */}
      <div
        style={{
          position: 'absolute',
          left: CX - 130,
          top: CY - 130,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: COR.terra,
          boxShadow: `0 10px 0 ${COR.terraFundo}, 0 24px 40px rgba(60,30,10,.35)`,
          display: 'grid',
          placeItems: 'center',
          opacity: Math.min(1, mModelo * 1.5),
          transform: `perspective(900px) rotateX(${(1 - mModelo) * 70}deg) scale(${0.7 + 0.3 * mModelo})`,
        }}
      >
        <div style={{textAlign: 'center'}}>
          <Asterisco size={78} cor={COR.papelClaro} style={{transform: `rotate(${t * 20}deg)`}} />
          <div style={{fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 46, color: COR.papelClaro, marginTop: 2}}>modelo</div>
        </div>
      </div>
      <Palavras
        itens={[
          ['só', 5.46],
          ['uma', 5.62],
          ['parte', 5.82],
        ]}
        destaque={['parte']}
        tamanho={60}
        style={{left: CX - 150, top: CY + 160, opacity: 1 - useEm(8.0, 0.4)}}
      />

      {/* as quatro peças, uma por palavra */}
      <Peca em={10.36} n="01" nome="Contexto" x={30} y={60} giro={-2}>
        <div>
          <span style={{color: CC.verde}}>⏺</span> <b>Read</b>(CLAUDE.md)
        </div>
        <div>
          <span style={{color: CC.verde}}>⏺</span> <b>Read</b>(relatorio.md)
        </div>
      </Peca>
      <Peca em={11.8} n="02" nome="Ferramentas" x={700} y={60} giro={1.8}>
        <div>
          <span style={{color: CC.verde}}>⏺</span> <b>Bash</b>(npm run build)
        </div>
        <div style={{color: CC.apagado}}> ⎿ Build finished in 2.1s</div>
      </Peca>
      <Peca em={12.28} n="03" nome="Verificação" x={700} y={790} giro={-1.5}>
        <div>
          <span style={{color: CC.verde}}>⏺</span> <b>Bash</b>(npm test)
        </div>
        <div style={{color: CC.verde}}> ⎿ ✓ 12 testes passaram</div>
      </Peca>
      <Peca em={13.4} n="04" nome="Aprovação" x={30} y={790} giro={2} destaque={15.14}>
        <div>Do you want to proceed?</div>
        <div style={{color: t >= 15.14 ? CC.laranja : CC.texto}}>{t >= 15.14 ? '❯' : ' '} 1. Yes   <span style={{color: CC.apagado}}>2. No</span></div>
      </Peca>

      {/* ciclo: contexto → agir → conferir → aprovar */}
      <Traco em={11.6} d="M 505 175 C 580 140, 640 140, 690 175" seta espessura={6} />
      <Traco em={12.2} d="M 935 305 C 990 520, 990 600, 935 780" seta espessura={6} />
      <Traco em={13.25} d="M 690 905 C 640 945, 580 945, 505 905" seta espessura={6} />
      <Traco em={14.1} d="M 265 780 C 210 600, 210 520, 265 305" seta espessura={6} />
    </Papel>
  );
};

// ---------- Cena 4 e 10: tipografia 3D com a câmera deslocada ----------

const FaixaPapel: React.FC<{largura?: number}> = ({largura = 760}) => {
  const {de} = useCena();
  const p = useEm(de, 0.7);
  return (
    <Folha cor={COR.papel} style={{left: -30, top: -30, width: (largura + 30) * p, height: 1140}}>
      <Papel cor="transparent" />
    </Folha>
  );
};

const NomeHarness: React.FC = () => (
  <AbsoluteFill>
    <FaixaPapel />
    <Palavras
      itens={[
        ['Essa', 15.78],
        ['estrutura', 16.04],
        ['tem', 16.72],
        ['um', 17.0],
        ['nome:', 17.08],
      ]}
      destaque={['estrutura']}
      tamanho={62}
      style={{left: 80, top: 300, width: 600}}
    />
    <Texto3D em={17.6} tamanho={175} style={{left: 60, top: 510}}>
      harness
    </Texto3D>
  </AbsoluteFill>
);

const SemProgramar: React.FC = () => {
  const risco = useEm(42.85, 0.4);
  const pecas = ['Contexto', 'Ferramentas', 'Verificação', 'Aprovação'];
  return (
    <AbsoluteFill>
      <FaixaPapel />
      <Palavras
        itens={[
          ['entender', 40.56],
          ['essas', 40.94],
          ['peças', 41.28],
        ]}
        destaque={['peças']}
        tamanho={60}
        style={{left: 80, top: 190}}
      />
      {pecas.map((p, i) => (
        <Entra key={p} em={41.28 + i * 0.08} giro={i % 2 ? 2 : -2} style={{left: 80 + (i % 2) * 300, top: 300 + Math.floor(i / 2) * 80}}>
          <Rotulo fundo={[COR.terra, COR.salvia, COR.tintaSuave, COR.terraEscuro][i]} tamanho={26}>
            {p}
          </Rotulo>
        </Entra>
      ))}
      <Palavras
        itens={[
          ['não', 41.72],
          ['exige', 41.9],
          ['saber', 42.3],
        ]}
        tamanho={60}
        style={{left: 80, top: 520}}
      />
      <Texto3D em={42.6} tamanho={130} style={{left: 70, top: 630}}>
        programar
      </Texto3D>
      <svg width={700} height={120} style={{position: 'absolute', left: 50, top: 670}}>
        <path d="M 10 70 C 150 40, 300 85, 450 50 S 620 60, 680 40" fill="none" stroke={COR.tinta} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${risco} 1`} opacity={risco > 0 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Cena 5: o que significa harness ----------

const IMG_W = 1060;
const IMG_H = (IMG_W * 1536) / 2752;

const Etiqueta: React.FC<{em: number; texto: string; x: number; y: number; px: number; py: number}> = ({em, texto, x, y, px, py}) => {
  const p = useEm(em, 0.45);
  const m = useMola(em + 0.2);
  return (
    <>
      <svg width={IMG_W} height={IMG_H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <circle cx={px} cy={py} r={11 * p} fill={COR.papelClaro} stroke={COR.tinta} strokeWidth={4} />
        <line x1={px} y1={py} x2={px + (x - px) * p} y2={py + (y - py) * p} stroke={COR.tinta} strokeWidth={4} />
      </svg>
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${m}) rotate(-3deg)`}}>
        <Rotulo fundo={COR.tinta} tamanho={34}>
          {texto}
        </Rotulo>
      </div>
    </>
  );
};

const Significado: React.FC = () => (
  <Papel>
    <Entra em={18.94} giro={-2} style={{left: 70, top: 130}}>
      <Folha style={{width: 600, height: 470}}>
        <div style={{padding: '36px 44px'}}>
          <div style={{fontFamily: FONTE.ui, fontSize: 22, letterSpacing: 3, color: COR.cinza, fontWeight: 600}}>INGLÊS</div>
          <div style={{fontFamily: FONTE.titulo, fontSize: 92, fontWeight: 600, color: COR.tinta, letterSpacing: -2, lineHeight: 1.1}}>harness</div>
          <div style={{fontFamily: FONTE.mono, fontSize: 24, color: COR.cinza}}>/ˈhɑːr.nəs/ · substantivo</div>
          <div style={{height: 2, background: COR.borda, margin: '22px 0'}} />
        </div>
      </Folha>
      <Texto3D em={19.8} tamanho={104} profundidade={10} style={{left: 44, top: 300}}>
        arreio
      </Texto3D>
    </Entra>
    <Entra em={20.0} giro={1.5} style={{left: 760, top: 80}}>
      <div style={{position: 'relative', width: IMG_W, height: IMG_H}}>
        <div style={{position: 'absolute', inset: -14, background: COR.papelClaro, boxShadow: '0 30px 60px rgba(50,30,10,.3)'}} />
        <Img src={arq('hf/H2_cavalo_arreado.png')} style={{position: 'absolute', inset: 0, width: IMG_W, height: IMG_H}} />
        <Etiqueta em={20.66} texto="sela" px={IMG_W * 0.655} py={IMG_H * 0.31} x={IMG_W * 0.78} y={IMG_H * 0.08} />
        <Etiqueta em={21.4} texto="rédeas" px={IMG_W * 0.49} py={IMG_H * 0.44} x={IMG_W * 0.26} y={IMG_H * 0.62} />
        <Etiqueta em={22.78} texto="cavalo" px={IMG_W * 0.8} py={IMG_H * 0.6} x={IMG_W * 0.9} y={IMG_H * 0.84} />
        <Fita style={{left: -50, top: -14}} />
      </div>
    </Entra>
    <Palavras
      itens={[
        ['a', 20.48],
        ['sela', 20.66],
        ['e', 20.96],
        ['as', 21.22],
        ['rédeas', 21.4],
      ]}
      destaque={['sela', 'rédeas']}
      tamanho={58}
      style={{left: 110, top: 690}}
    />
  </Papel>
);

// ---------- Cenas 6 e 7: o cavalo solto e o cavalo arreado ----------

const CavaloSolto: React.FC = () => (
  <AbsoluteFill>
    <Broll src="H1_cavalo_solto.mp4" duracaoClipe={5.04} />
    <Texto3D em={24.1} tamanho={150} style={{left: 70, top: 150}}>
      força
    </Texto3D>
    <Palavras itens={[['de', 24.44], ['sobra', 24.68]]} tamanho={56} style={{left: 90, top: 340}} />
    <Palavras
      itens={[
        ['mas', 25.18],
        ['sozinho,', 25.38],
        ['vai', 25.9],
        ['para', 26.26],
        ['onde', 26.42],
        ['quiser', 26.68],
      ]}
      destaque={['quiser']}
      tamanho={52}
      style={{left: 90, top: 520, width: 520}}
    />
    <Traco em={25.38} dur={1.3} tracejado espessura={9} cor={COR.tinta} d="M 820 860 C 700 760, 980 700, 900 600 S 1180 520, 1050 420 S 1350 330, 1250 220 S 1500 200, 1420 120" seta />
    <Traco em={25.9} dur={0.9} tracejado espessura={9} cor={COR.tinta} d="M 820 860 C 900 980, 1150 900, 1300 1000" seta />
  </AbsoluteFill>
);

const CavaloArreado: React.FC = () => (
  <AbsoluteFill>
    <Broll src="H2_cavalo_arreado.mp4" duracaoClipe={5.04} />
    <Texto3D em={27.4} tamanho={140} style={{left: 80, top: 80}}>
      o arreio
    </Texto3D>
    <Palavras
      itens={[
        ['leva', 27.78],
        ['a', 28.1],
        ['força', 28.26],
        ['para', 28.64],
        ['onde', 28.86],
        ['a', 29.16],
        ['gente', 29.4],
        ['quer', 29.54],
      ]}
      destaque={['força', 'quer']}
      tamanho={50}
      style={{left: 1080, top: 120, width: 760}}
    />
    <Traco em={28.26} dur={1.2} cor={COR.terraEscuro} espessura={12} d="M 120 910 L 1380 910" seta />
    <Entra em={29.5} style={{left: 1400, top: 860}}>
      <svg width={100} height={100}>
        {[46, 32, 18].map((r, i) => (
          <circle key={r} cx={50} cy={50} r={r} fill={i % 2 ? COR.papelClaro : COR.terra} stroke={COR.terraEscuro} strokeWidth={3} />
        ))}
      </svg>
    </Entra>
  </AbsoluteFill>
);

// ---------- Cena 8: força e direção ----------

// Card que vira em 3D: frente (cavalo) → verso (IA).
const Vira: React.FC<{em: number; vira: number; x: number; frente: React.ReactNode; verso: React.ReactNode}> = ({em, vira, x, frente, verso}) => {
  const p = useEm(vira, 0.8);
  const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', display: 'grid', placeItems: 'center'};
  return (
    <Entra em={em} style={{left: x, top: 220}}>
      <div style={{width: 500, height: 420, perspective: 1600}}>
        <div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${p * 180}deg)`}}>
          <div style={{...face, background: COR.papelClaro, borderRadius: 8, boxShadow: '0 20px 40px rgba(60,40,20,.22)'}}>{frente}</div>
          <div style={{...face, background: COR.papelClaro, borderRadius: 8, boxShadow: '0 20px 40px rgba(60,40,20,.22)', transform: 'rotateY(180deg)'}}>{verso}</div>
        </div>
      </div>
    </Entra>
  );
};

const Recorte: React.FC<{cx: number; cy: number; lado: number; px: number}> = ({cx, cy, lado, px}) => {
  const w = px / lado;
  const h = (w * 1536) / 2752;
  return (
    <div style={{position: 'relative', width: px, height: px, overflow: 'hidden', borderRadius: '50%', boxShadow: 'inset 0 0 0 6px rgba(0,0,0,.05)'}}>
      <Img src={arq('hf/H2_cavalo_arreado.png')} style={{position: 'absolute', width: w, height: h, left: px / 2 - cx * w, top: px / 2 - cy * h}} />
    </div>
  );
};

const Legenda: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 56, color: COR.tinta, marginTop: 14, letterSpacing: -1}}>{children}</div>
);

const Comparacao: React.FC = () => {
  const t = useAgora();
  return (
    <Papel>
      <Palavras
        itens={[
          ['Com', 30.92],
          ['a', 31.1],
          ['IA', 31.26],
          ['é', 31.44],
          ['igual.', 31.76],
        ]}
        destaque={['IA']}
        tamanho={74}
        style={{left: 80, top: 70}}
      />
      <Vira
        em={31.3}
        vira={32.7}
        x={80}
        frente={
          <div style={{textAlign: 'center'}}>
            <Recorte cx={0.36} cy={0.3} lado={0.36} px={250} />
            <Legenda>cavalo</Legenda>
          </div>
        }
        verso={
          <div style={{textAlign: 'center'}}>
            <div style={{width: 250, height: 250, borderRadius: '50%', background: COR.terra, display: 'grid', placeItems: 'center', margin: '0 auto'}}>
              <Asterisco size={130} cor={COR.papelClaro} style={{transform: `rotate(${t * 20}deg)`}} />
            </div>
            <Legenda>modelo</Legenda>
          </div>
        }
      />
      <Vira
        em={31.5}
        vira={34.2}
        x={680}
        frente={
          <div style={{textAlign: 'center'}}>
            <Recorte cx={0.6} cy={0.3} lado={0.34} px={250} />
            <Legenda>arreio</Legenda>
          </div>
        }
        verso={
          <div style={{textAlign: 'center'}}>
            <div style={{width: 250, height: 250, borderRadius: '50%', background: COR.salvia, display: 'grid', placeItems: 'center', margin: '0 auto', position: 'relative'}}>
              <div style={{position: 'absolute', inset: 22, borderRadius: '50%', border: `14px solid ${COR.papelClaro}`, opacity: 0.9}} />
              <Asterisco size={70} cor={COR.papelClaro} />
            </div>
            <Legenda>harness</Legenda>
          </div>
        }
      />
      <Texto3D em={33.5} tamanho={92} profundidade={9} style={{left: 140, top: 690}}>
        = força
      </Texto3D>
      <Texto3D em={35.42} tamanho={92} profundidade={9} cor={COR.salvia} lado={COR.salviaEscuro} style={{left: 710, top: 690}}>
        = direção
      </Texto3D>
      <Traco em={35.94} dur={1.1} cor={COR.salviaEscuro} espessura={9} d="M 720 880 C 860 960, 1020 960, 1180 870" seta />
      <Palavras
        itens={[
          ['para', 35.94],
          ['onde', 36.12],
          ['a', 36.3],
          ['gente', 36.4],
          ['quer', 36.54],
          ['que', 36.82],
          ['a', 36.98],
          ['IA', 37.1],
          ['siga', 37.3],
        ]}
        destaque={['siga']}
        tamanho={42}
        style={{left: 140, top: 940, width: 1100}}
      />
    </Papel>
  );
};

// ---------- Cena 9: crachá ----------

const Cracha: React.FC = () => {
  const dias = ['S', 'T', 'Q', 'Q', 'S'];
  return (
    <AbsoluteFill>
      <Entra em={38.1} de="esq" giro={-1.5} style={{left: 70, top: 790}}>
        <Folha style={{width: 560, height: 190}}>
          <div style={{padding: '24px 34px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Asterisco size={36} />
              <span style={{fontFamily: FONTE.titulo, fontSize: 52, fontWeight: 600, color: COR.tinta, letterSpacing: -1}}>Macks Wendhell</span>
            </div>
            <div style={{fontFamily: FONTE.ui, fontSize: 25, color: COR.tintaSuave, marginTop: 10}}>agentes de IA no trabalho, todo dia</div>
          </div>
        </Folha>
        <Fita style={{left: -46, top: -10}} />
      </Entra>
      <div style={{position: 'absolute', left: 90, top: 690, display: 'flex', gap: 12}}>
        {dias.map((d, i) => (
          <Dia key={i} d={d} em={39.0 + i * 0.18} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Dia: React.FC<{d: string; em: number}> = ({d, em}) => {
  const m = useMola(em);
  const ok = useEm(em + 0.1, 0.25);
  return (
    <div style={{width: 72, height: 78, background: COR.papelClaro, borderRadius: 8, boxShadow: '0 8px 16px rgba(0,0,0,.3)', opacity: m, transform: `scale(${m})`, position: 'relative', fontFamily: FONTE.ui, fontWeight: 700, fontSize: 22, color: COR.cinza, textAlign: 'center', paddingTop: 6}}>
      {d}
      <svg width={72} height={50} style={{position: 'absolute', left: 0, top: 26}}>
        <path d="M 18 26 L 31 38 L 54 12" fill="none" stroke={COR.terra} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${ok} 1`} />
      </svg>
    </div>
  );
};

// ---------- Cena 11: o que vem no vídeo ----------

const Item: React.FC<{em: number; n: string; nome: string; desc: string; cor: string; i: number}> = ({em, n, nome, desc, cor, i}) => (
  <Entra em={em} de="esq" giro={i % 2 ? 0.8 : -0.8} style={{left: 80, top: 300 + i * 140}}>
    <Folha style={{width: 760, height: 118}}>
      <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 26}}>
        <div style={{width: 70, height: 70, borderRadius: 10, background: cor, color: '#fff', fontFamily: FONTE.mono, fontWeight: 700, fontSize: 28, display: 'grid', placeItems: 'center', boxShadow: '0 5px 0 rgba(0,0,0,.18)'}}>{n}</div>
        <div>
          <div style={{fontFamily: FONTE.titulo, fontWeight: 600, fontSize: 46, color: COR.tinta, letterSpacing: -1, lineHeight: 1}}>{nome}</div>
          <div style={{fontFamily: FONTE.mono, fontSize: 19, color: COR.cinza, marginTop: 6}}>{desc}</div>
        </div>
      </div>
    </Folha>
  </Entra>
);

const Carimbo: React.FC<{em: number; texto: string; giro: number; x: number; y: number; cor?: string}> = ({em, texto, giro, x, y, cor = COR.terraEscuro}) => {
  const p = useEm(em, 0.25);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '10px 22px',
        border: `5px solid ${cor}`,
        borderRadius: 10,
        color: cor,
        fontFamily: FONTE.ui,
        fontWeight: 800,
        fontSize: 32,
        letterSpacing: 1,
        textTransform: 'uppercase',
        opacity: p,
        transform: `rotate(${giro}deg) scale(${1.6 - 0.6 * p})`,
        mixBlendMode: 'multiply',
      }}
    >
      {texto}
    </div>
  );
};

const Roteiro: React.FC = () => {
  const selo = useMola(48.58, 12);
  const itens = [
    {n: '01', nome: 'Contexto', desc: 'Read(CLAUDE.md) · memória · arquivos', cor: COR.terra},
    {n: '02', nome: 'Ferramentas', desc: 'Bash · Write · MCP', cor: COR.salvia},
    {n: '03', nome: 'Verificação', desc: 'testes · conferência · ciclo', cor: COR.tintaSuave},
    {n: '04', nome: 'Aprovação', desc: 'permissões · hooks', cor: COR.terraEscuro},
  ];
  return (
    <Papel>
      <Entra em={43.6} style={{left: 84, top: 70}}>
        <Rotulo fundo={COR.tinta} tamanho={24}>
          NESTE VÍDEO
        </Rotulo>
      </Entra>
      <Texto3D em={44.52} tamanho={100} profundidade={10} style={{left: 74, top: 130}}>
        abrir cada peça
      </Texto3D>
      {itens.map((it, i) => (
        <Item key={it.n} {...it} i={i} em={44.9 + i * 0.16} />
      ))}
      <Carimbo em={46.1} texto="o que significa" giro={-6} x={890} y={330} />
      <Carimbo em={46.94} texto="+ exemplos" giro={4} x={930} y={440} cor={COR.salviaEscuro} />
      <div
        style={{
          position: 'absolute',
          left: 920,
          top: 560,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: COR.terra,
          boxShadow: `0 8px 0 ${COR.terraFundo}, 0 20px 36px rgba(60,30,10,.3)`,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          color: COR.papelClaro,
          fontFamily: FONTE.titulo,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.05,
          opacity: Math.min(1, selo * 1.5),
          transform: `rotate(${-12 + 20 * (1 - selo)}deg) scale(${selo})`,
        }}
      >
        <div>
          para quem
          <br />
          não é <i>técnico</i>
        </div>
      </div>
      <Entra em={50.0} style={{left: 80, top: 880}}>
        <div style={{width: 1130, background: CC.fundo, borderRadius: 12, padding: '4px 20px', fontFamily: FONTE.mono, fontSize: 24, color: CC.texto, boxShadow: '0 20px 40px rgba(40,25,10,.3)'}}>
          <Prompt texto="faça melhor uso dos meus agentes de IA" de={50.18} ate={52.2} placeholder="" />
        </div>
      </Entra>
    </Papel>
  );
};

// ---------- Montagem ----------

export const Harness: React.FC = () => (
  <AbsoluteFill style={{background: COR.papel}}>
    <Fontes />
    <Papel />
    <Cena de={0} ate={4.66} entrada="corte">
      <Abertura />
    </Cena>
    <Cena de={4.6} ate={15.7}>
      <Estrutura />
    </Cena>
    <Cena de={18.1} ate={23.22} entrada="corte" saida="corte">
      <Significado />
    </Cena>
    <Cena de={23.22} ate={27.02} entrada="rasgo" saida="corte">
      <CavaloSolto />
    </Cena>
    <Cena de={27.02} ate={30.92} entrada="rasgo">
      <CavaloArreado />
    </Cena>
    <Cena de={30.85} ate={37.95}>
      <Comparacao />
    </Cena>
    <Cena de={42.95} ate={52.49} saida="corte">
      <Roteiro />
    </Cena>

    <Camera />
    <FitaCamera />

    {/* camadas sobre a câmera (tipografia e crachá) */}
    <Cena de={15.6} ate={18.15} entrada="corte">
      <NomeHarness />
    </Cena>
    <Cena de={37.98} ate={40.38}>
      <Cracha />
    </Cena>
    <Cena de={40.4} ate={43.12} entrada="corte">
      <SemProgramar />
    </Cena>
  </AbsoluteFill>
);
