import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const FPS = 30000 / 1001;
export const DURACAO = 299.5993;
export const f = (s: number) => Math.round(s * FPS);
export const arq = (p: string) => staticFile(`001. mods/${p}`);

export const COR = {
  papel: '#F0EEE6',
  papelClaro: '#FAF9F5',
  tinta: '#141413',
  tintaSuave: '#3D3929',
  cinza: '#6B675C',
  borda: '#E3DED2',
  terra: '#D97757',
  terraEscuro: '#B5532F',
  salvia: '#788C5D',
  vermelho: '#C0453A',
};
export const FONTE = {
  titulo: "'Newsreader', Georgia, serif",
  ui: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', Menlo, monospace",
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const suave = Easing.bezier(0.65, 0, 0.35, 1);

const FONTES_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=block';

export const Fontes: React.FC = () => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTES_URL;
    link.onload = () =>
      Promise.all(['600 40px Newsreader', '400 40px Newsreader', '600 40px Inter', '400 40px Inter', '700 40px Inter', '400 40px "JetBrains Mono"'].map((x) => document.fonts.load(x)))
        .then(() => continueRender(h))
        .catch(() => continueRender(h));
    link.onerror = () => continueRender(h);
    document.head.appendChild(link);
  }, [h]);
  return null;
};

// Cada cena conhece o próprio início; os gatilhos são sempre segundos absolutos do master.
const CenaCtx = createContext({de: 0, ate: 0});

export const useAgora = () => {
  const frame = useCurrentFrame();
  const {de} = useContext(CenaCtx);
  return frame / FPS + de;
};

export const useEm = (em: number, dur = 0.5) => {
  const t = useAgora();
  return interpolate(t, [em, em + dur], [0, 1], {...clamp, easing: suave});
};

export const useMola = (em: number) => {
  const t = useAgora();
  return spring({frame: Math.max(0, (t - em) * FPS), fps: FPS, config: {damping: 16, stiffness: 120}});
};

// Borda rasgada que atravessa a tela da esquerda para a direita.
const rasgo = (p: number, inverso = false) => {
  const borda = interpolate(p, [0, 1], [-6, 108]);
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const y = (i / 30) * 100;
    const jag = (((i * 37) % 11) - 5) * 0.45 + (i % 2 ? 1.1 : -0.6);
    pts.push(`${borda + jag}% ${y}%`);
  }
  return inverso
    ? `polygon(${pts.join(',')}, 100% 100%, 100% 0%)`
    : `polygon(0% 0%, ${pts.join(',')}, 0% 100%)`;
};

export type Entrada = 'rasgo' | 'fade' | 'corte';

export const Cena: React.FC<{
  de: number;
  ate: number;
  entrada?: Entrada;
  saida?: 'fade' | 'corte' | 'rasgo';
  children: React.ReactNode;
}> = ({de, ate, entrada = 'corte', saida = 'corte', children}) => (
  <Sequence from={f(de)} durationInFrames={f(ate) - f(de)} premountFor={30}>
    <CenaCtx.Provider value={{de, ate}}>
      <Transicao entrada={entrada} saida={saida} de={de} ate={ate}>
        {children}
      </Transicao>
    </CenaCtx.Provider>
  </Sequence>
);

const Transicao: React.FC<{entrada: Entrada; saida: string; de: number; ate: number; children: React.ReactNode}> = ({
  entrada,
  saida,
  de,
  ate,
  children,
}) => {
  const t = useAgora();
  const pin = interpolate(t, [de, de + (entrada === 'rasgo' ? 0.6 : 0.4)], [0, 1], {...clamp, easing: suave});
  const pout = interpolate(t, [ate - (saida === 'rasgo' ? 0.6 : 0.35), ate], [0, 1], {...clamp, easing: suave});
  let opacity = 1;
  let clipPath: string | undefined;
  if (entrada === 'fade') opacity *= pin;
  if (entrada === 'rasgo' && pin < 1) clipPath = rasgo(pin);
  if (saida === 'fade') opacity *= 1 - pout;
  if (saida === 'rasgo' && pout > 0) clipPath = rasgo(pout, true);
  return <AbsoluteFill style={{opacity, clipPath}}>{children}</AbsoluteFill>;
};

// Fundo de papel creme com grão.
export const Papel: React.FC<{cor?: string; children?: React.ReactNode}> = ({cor = COR.papel, children}) => (
  <AbsoluteFill style={{background: cor}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0.22 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(60,50,30,.12))'}} />
    {children}
  </AbsoluteFill>
);

// B-roll da Higgsfield em tela cheia. Se o clipe for mais curto que a cena, desacelera até 0,7× e congela no fim.
export const Broll: React.FC<{src: string; duracaoClipe: number}> = ({src, duracaoClipe}) => {
  const frame = useCurrentFrame();
  const {de, ate} = useContext(CenaCtx);
  const cena = ate - de;
  const rate = Math.min(1.6, Math.max(0.7, duracaoClipe / cena));
  const fim = Math.floor(((duracaoClipe - 0.15) / rate) * FPS);
  const zoom = interpolate(frame, [0, cena * FPS], [1.0, 1.05]);
  return (
    <AbsoluteFill style={{background: COR.papel, overflow: 'hidden'}}>
      <Freeze frame={fim} active={frame >= fim}>
        <OffthreadVideo
          src={arq(`hf/${src}`)}
          muted
          playbackRate={rate}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
        />
      </Freeze>
    </AbsoluteFill>
  );
};

type Tom = 'papel' | 'terra' | 'salvia' | 'vermelho' | 'escuro';
const TOM: Record<Tom, {bg: string; fg: string; borda: string}> = {
  papel: {bg: COR.papelClaro, fg: COR.tinta, borda: COR.borda},
  terra: {bg: COR.terra, fg: '#fff', borda: COR.terraEscuro},
  salvia: {bg: COR.salvia, fg: '#fff', borda: '#5f7149'},
  vermelho: {bg: COR.vermelho, fg: '#fff', borda: '#9a3229'},
  escuro: {bg: COR.tinta, fg: COR.papelClaro, borda: '#000'},
};

export const Chip: React.FC<{
  em: number;
  texto: React.ReactNode;
  tom?: Tom;
  tamanho?: number;
  giro?: number;
  risca?: number;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({em, texto, tom = 'papel', tamanho = 38, giro = -1.5, risca, mono, style}) => {
  const m = useMola(em);
  const r = useEm(risca ?? 1e9, 0.35);
  const c = TOM[tom];
  return (
    <div
      style={{
        position: 'absolute',
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${tamanho * 0.36}px ${tamanho * 0.7}px`,
        background: c.bg,
        color: c.fg,
        border: `2px solid ${c.borda}`,
        borderRadius: tamanho * 0.36,
        fontFamily: mono ? FONTE.mono : FONTE.ui,
        fontWeight: 600,
        fontSize: tamanho,
        letterSpacing: -0.3,
        whiteSpace: 'nowrap',
        boxShadow: '0 10px 0 -4px rgba(0,0,0,.08), 0 14px 34px rgba(40,30,20,.28)',
        opacity: m,
        transform: `translateY(${(1 - m) * 26}px) rotate(${giro}deg) scale(${0.92 + 0.08 * m})`,
        transformOrigin: 'left center',
        ...style,
      }}
    >
      {texto}
      {risca !== undefined && (
        <div style={{position: 'absolute', left: '6%', top: '52%', height: 5, width: `${88 * r}%`, background: COR.vermelho, borderRadius: 3}} />
      )}
    </div>
  );
};

// Tipografia grande que entra palavra por palavra.
export const Titulo: React.FC<{
  em: number;
  linhas: string[];
  tamanho?: number;
  cor?: string;
  destaque?: string[];
  passo?: number;
  style?: React.CSSProperties;
}> = ({em, linhas, tamanho = 110, cor = COR.papelClaro, destaque = [], passo = 0.12, style}) => {
  const t = useAgora();
  let i = 0;
  return (
    <div style={{position: 'absolute', fontFamily: FONTE.titulo, fontWeight: 500, fontSize: tamanho, lineHeight: 1.02, letterSpacing: -2, color: cor, ...style}}>
      {linhas.map((l, li) => (
        <div key={li}>
          {l.split(' ').map((w, wi) => {
            const p = interpolate(t, [em + i * passo, em + i * passo + 0.35], [0, 1], {...clamp, easing: suave});
            i++;
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  marginRight: tamanho * 0.22,
                  opacity: p,
                  transform: `translateY(${(1 - p) * tamanho * 0.3}px)`,
                  color: destaque.includes(w) ? COR.terra : undefined,
                  fontStyle: destaque.includes(w) ? 'italic' : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Recorte quadrado de uma prancha de ícones (cx, cy e lado em fração da largura da imagem).
export const Recorte: React.FC<{src: string; cx: number; cy: number; lado: number; px: number; proporcao?: number}> = ({
  src,
  cx,
  cy,
  lado,
  px,
  proporcao = 1536 / 2752,
}) => {
  const w = px / lado;
  return (
    <div style={{position: 'relative', width: px, height: px, overflow: 'hidden'}}>
      <Img src={arq(`hf/${src}`)} style={{position: 'absolute', width: w, height: w * proporcao, left: px / 2 - cx * w, top: px / 2 - cy * w * proporcao}} />
    </div>
  );
};

// Print real em folha com fita, zoom lento e marca-texto sobre a frase citada.
export const Print: React.FC<{
  src: string;
  largura: number;
  recorte: {x: number; y: number; w: number; h: number};
  marcas?: {x: number; y: number; w: number; h: number; em: number}[];
  em: number;
  giro?: number;
  style?: React.CSSProperties;
}> = ({src, largura, recorte, marcas = [], em, giro = -1.2, style}) => {
  const m = useMola(em);
  const t = useAgora();
  const {ate} = useContext(CenaCtx);
  const k = largura / recorte.w;
  const zoom = interpolate(t, [em, ate], [1, 1.05], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        width: largura,
        height: recorte.h * k,
        opacity: m,
        transform: `translateY(${(1 - m) * 60}px) rotate(${giro}deg)`,
        ...style,
      }}
    >
      <div style={{position: 'absolute', inset: -14, background: COR.papelClaro, borderRadius: 6, boxShadow: '0 30px 70px rgba(30,20,10,.35)'}} />
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 4}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '30% 40%'}}>
          <Img src={arq(src)} style={{position: 'absolute', left: -recorte.x * k, top: -recorte.y * k, width: 'auto', height: 'auto', transform: `scale(${k})`, transformOrigin: '0 0'}} />
          {marcas.map((mk, i) => (
            <Marca key={i} {...mk} k={k} rx={recorte.x} ry={recorte.y} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: -10, left: -40, width: 130, height: 40, background: 'rgba(217,119,87,.75)', transform: 'rotate(-38deg)'}} />
      <div style={{position: 'absolute', top: -10, right: -40, width: 130, height: 40, background: 'rgba(217,119,87,.75)', transform: 'rotate(38deg)'}} />
    </div>
  );
};

const Marca: React.FC<{x: number; y: number; w: number; h: number; em: number; k: number; rx: number; ry: number}> = ({x, y, w, h, em, k, rx, ry}) => {
  const p = useEm(em, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left: (x - rx) * k - 6,
        top: (y - ry) * k,
        width: (w * k + 12) * p,
        height: h * k,
        background: 'rgba(217,119,87,.42)',
        borderBottom: `4px solid ${COR.terra}`,
        borderRadius: 4,
      }}
    />
  );
};

// Asterisco do Claude em papel (forma simples, sem o logotipo).
export const Asterisco: React.FC<{size: number; cor?: string; style?: React.CSSProperties}> = ({size, cor = COR.terra, style}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    {Array.from({length: 12}).map((_, i) => (
      <rect key={i} x={-4} y={-46} width={8} height={40} rx={4} fill={cor} transform={`rotate(${i * 30 + (i % 2 ? 4 : 0)})`} />
    ))}
  </svg>
);
