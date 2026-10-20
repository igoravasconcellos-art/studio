import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const FPS = 30000 / 1001;
export const DURACAO = 59.893167;
export const f = (s: number) => Math.round(s * FPS);
export const arq = (p: string) => staticFile(`002. abertura-openclaw/${p}`);

// Paleta puxada para a Hostinger, sem citar a marca.
export const COR = {
  fundo: '#0E0A24',
  fundo2: '#1D1E20',
  roxo: '#673DE6',
  roxoEsc: '#2F1C6A',
  lilas: '#8C85FF',
  lavanda: '#EBE4FF',
  rosa: '#FC5185',
  verde: '#00B090',
  branco: '#F7F5FF',
};
export const FONTE = {
  ui: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', Menlo, monospace",
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const suave = Easing.bezier(0.65, 0, 0.35, 1);

const FONTES_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=block';

export const Fontes: React.FC = () => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTES_URL;
    link.onload = () =>
      Promise.all(['400 40px "DM Sans"', '700 40px "DM Sans"', '800 40px "DM Sans"', '400 40px "Instrument Serif"', 'italic 400 40px "Instrument Serif"', '400 40px "JetBrains Mono"'].map((x) => document.fonts.load(x)))
        .then(() => continueRender(h))
        .catch(() => continueRender(h));
    link.onerror = () => continueRender(h);
    document.head.appendChild(link);
  }, [h]);
  return null;
};

// Cada cena conhece o próprio intervalo; gatilhos são sempre segundos absolutos do master.
const CenaCtx = createContext({de: 0, ate: 0});

export const useAgora = () => {
  const frame = useCurrentFrame();
  const {de} = useContext(CenaCtx);
  return frame / FPS + de;
};
export const useCena = () => useContext(CenaCtx);

export const useEm = (em: number, dur = 0.5) => {
  const t = useAgora();
  return interpolate(t, [em, em + dur], [0, 1], {...clamp, easing: suave});
};

export const useMola = (em: number, damping = 15) => {
  const t = useAgora();
  return spring({frame: Math.max(0, (t - em) * FPS), fps: FPS, config: {damping, stiffness: 120}});
};

// Saída padrão: tudo desliza e some nos últimos 0,3 s da cena (ou cai, na cena 5).
export const Cena: React.FC<{de: number; ate: number; saida?: 'fade' | 'cai' | 'corte'; children: React.ReactNode}> = ({de, ate, saida = 'fade', children}) => (
  <Sequence from={f(de)} durationInFrames={f(ate) - f(de)} premountFor={30}>
    <CenaCtx.Provider value={{de, ate}}>
      <Saida tipo={saida}>{children}</Saida>
    </CenaCtx.Provider>
  </Sequence>
);

const Saida: React.FC<{tipo: string; children: React.ReactNode}> = ({tipo, children}) => {
  const t = useAgora();
  const {ate} = useCena();
  const p = interpolate(t, [ate - (tipo === 'cai' ? 0.5 : 0.3), ate], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  if (tipo === 'corte') return <AbsoluteFill>{children}</AbsoluteFill>;
  if (tipo === 'cai')
    return <AbsoluteFill style={{opacity: 1 - p * 0.9, transform: `translateY(${p * 700}px) rotate(${p * 6}deg)`}}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{opacity: 1 - p, transform: `translateY(${p * -30}px)`}}>{children}</AbsoluteFill>;
};

// Fundo noturno roxo com grade fina e brilho lento.
export const Fundo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const gx = 30 + Math.sin(t * 0.35) * 12;
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${COR.fundo} 0%, ${COR.fundo2} 100%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${gx}% 35%, rgba(103,61,230,.42), transparent 55%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 85% 90%, rgba(140,133,255,.18), transparent 45%)'}} />
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(rgba(235,228,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(235,228,255,.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          backgroundPosition: `0 ${-t * 8}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// Card com leve 3D: entra girando de longe, balança devagar, borda lilás e brilho roxo.
export const Card3D: React.FC<{
  em: number;
  x: number;
  y: number;
  w: number;
  h: number;
  ry?: number;
  rx?: number;
  raio?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({em, x, y, w, h, ry = 12, rx = 3, raio = 28, children, style}) => {
  const t = useAgora();
  const m = useMola(em, 17);
  const balanco = Math.sin((t - em) * 0.9) * 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1800, ...style}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: raio,
          overflow: 'hidden',
          opacity: Math.min(1, m * 1.4),
          transform: `translateZ(${(1 - m) * -500}px) rotateY(${ry + (1 - m) * 35 + balanco}deg) rotateX(${rx + (1 - m) * 8}deg)`,
          boxShadow: `0 0 0 2px rgba(140,133,255,.55), 0 40px 90px rgba(10,5,40,.7), 0 0 80px rgba(103,61,230,${0.35 * m})`,
          background: COR.fundo,
        }}
      >
        {children}
        <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,.14) 0%, transparent 35%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};

// Ids dos B-rolls já gerados e baixados em hf/. Os que faltam aparecem como marcador.
const GERADOS = new Set<string>(['B1', 'B2', 'B3', 'B4', 'B5']);

export const Broll: React.FC<{id: string; rotulo: string; rate?: number; inicio?: number}> = ({id, rotulo, rate = 1, inicio = 0}) => {
  const t = useAgora();
  const {de} = useCena();
  const zoom = 1.04 + (t - de) * 0.012;
  if (GERADOS.has(id))
    return (
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={arq(`hf/${id}.mp4`)} muted playbackRate={rate} trimBefore={Math.round(inicio * FPS)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
    );
  const a = (t * 40) % 360;
  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${a}deg at 60% 40%, ${COR.roxoEsc}, ${COR.roxo}, #120a30, ${COR.roxoEsc})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.mono,
        fontSize: 30,
        color: 'rgba(235,228,255,.75)',
        textAlign: 'center',
        padding: 40,
      }}
    >
      {id} · {rotulo}
    </AbsoluteFill>
  );
};

// Escrita criativa: palavras sobem uma a uma; as marcadas com * ficam em serif itálico lilás.
export const Frase: React.FC<{
  em: number;
  texto: string;
  tamanho?: number;
  cor?: string;
  serif?: boolean;
  passo?: number;
  style?: React.CSSProperties;
}> = ({em, texto, tamanho = 72, cor = COR.branco, serif = true, passo = 0.1, style}) => {
  const t = useAgora();
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: serif ? FONTE.serif : FONTE.ui,
        fontWeight: serif ? 400 : 700,
        fontSize: tamanho,
        lineHeight: 1.05,
        letterSpacing: serif ? -1 : -1.5,
        color: cor,
        textShadow: '0 6px 30px rgba(10,5,40,.6)',
        ...style,
      }}
    >
      {texto.split(' ').map((w, i) => {
        const p = interpolate(t, [em + i * passo, em + i * passo + 0.4], [0, 1], {...clamp, easing: suave});
        const destaque = w.startsWith('*');
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: tamanho * 0.22,
              opacity: p,
              transform: `translateY(${(1 - p) * tamanho * 0.35}px)`,
              filter: `blur(${(1 - p) * 8}px)`,
              fontFamily: destaque ? FONTE.serif : undefined,
              fontStyle: destaque ? 'italic' : undefined,
              fontWeight: destaque ? 400 : undefined,
              color: destaque ? COR.lilas : undefined,
            }}
          >
            {destaque ? w.slice(1) : w}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{em: number; texto: React.ReactNode; tom?: 'vidro' | 'roxo' | 'rosa' | 'verde'; tamanho?: number; giro?: number; mono?: boolean; style?: React.CSSProperties}> = ({
  em,
  texto,
  tom = 'vidro',
  tamanho = 40,
  giro = -2,
  mono,
  style,
}) => {
  const m = useMola(em);
  const bg = {vidro: 'rgba(29,30,32,.72)', roxo: COR.roxo, rosa: COR.rosa, verde: COR.verde}[tom];
  return (
    <div
      style={{
        position: 'absolute',
        display: 'inline-flex',
        alignItems: 'center',
        gap: tamanho * 0.35,
        padding: `${tamanho * 0.32}px ${tamanho * 0.6}px`,
        background: bg,
        color: COR.branco,
        border: '2px solid rgba(140,133,255,.55)',
        borderRadius: tamanho * 0.5,
        fontFamily: mono ? FONTE.mono : FONTE.ui,
        fontWeight: 700,
        fontSize: tamanho,
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 18px 40px rgba(10,5,40,.5)',
        opacity: m,
        transform: `translateY(${(1 - m) * 30}px) rotate(${giro}deg) scale(${0.85 + 0.15 * m})`,
        transformOrigin: 'left center',
        ...style,
      }}
    >
      {texto}
    </div>
  );
};

// Traço que se desenha (risco, sublinhado).
export const Traco: React.FC<{em: number; dur?: number; cor?: string; espessura?: number; style: React.CSSProperties}> = ({em, dur = 0.3, cor = COR.rosa, espessura = 8, style}) => {
  const p = useEm(em, dur);
  return <div style={{position: 'absolute', height: espessura, borderRadius: espessura, background: cor, transformOrigin: 'left center', transform: `scaleX(${p})`, ...style}} />;
};
