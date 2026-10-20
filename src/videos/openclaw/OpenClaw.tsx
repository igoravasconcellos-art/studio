import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame} from 'remotion';
import {Broll, COR, Card3D, Cena, Chip, FONTE, FPS, Fontes, Frase, Fundo, Traco, arq, clamp, suave, useAgora, useEm, useMola} from './base';

// ---------- Câmera: uma única instância do master; só o contêiner se move ----------

// Zona do rosto medida nos quadros reais (1/s): x 680–1210, y 70–760. Centro (945, 415).
const ROSTO = {cx: 945, cy: 415};
type Ret = {l: number; t: number; w: number; h: number; r: number; vs: number; vx: number; vy: number; g: number};

// Card: o vídeo é reduzido (vs) e centrado no rosto, sem deixar borda preta.
const card = (l: number, t: number, w: number, h: number, vs: number, r = 36): Ret => {
  const vx = Math.min(0, Math.max(w - 1920 * vs, w / 2 - ROSTO.cx * vs));
  const vy = Math.min(0, Math.max(h - 1080 * vs, h / 2 - ROSTO.cy * vs));
  return {l, t, w, h, r, vs, vx, vy, g: 0};
};
const push = (s: number, g = 0): Ret => ({l: 0, t: 0, w: 1920, h: 1080, r: 0, vs: s, vx: -ROSTO.cx * (s - 1), vy: -ROSTO.cy * (s - 1), g});
const CHEIA = push(1);
const VERT = card(1300, 105, 560, 870, 0.82);
const VERT_E = card(70, 105, 560, 870, 0.82);
const HORIZ = card(980, 298, 860, 484, 0.5);
const HORIZ_ALTO = card(1000, 80, 840, 472, 0.5);
const MINI = card(1500, 560, 360, 450, 0.56, 30);
// Câmera deslocada para a direita, abrindo espaço para texto à esquerda (|vx| ≤ largura·(s−1)).
const ESPACO: Ret = {l: 0, t: 0, w: 1920, h: 1080, r: 0, vs: 1.12, vx: 0, vy: -20, g: 0};

// [início, layout, duração da transição]
const CAMERA: [number, Ret, number][] = [
  [0, push(1.05), 0.9],
  [0.3, VERT, 0.8],
  [4.62, HORIZ, 0.9],
  [9.14, push(1, 0.8), 0.01],
  [9.2, push(1.06, 0.8), 4.3],
  [13.6, MINI, 0.9],
  [17.55, ESPACO, 0.8],
  [20.2, VERT, 0.9],
  [27.58, CHEIA, 0.7],
  [28.2, push(1.08), 0.8],
  [29.0, HORIZ_ALTO, 0.8],
  [37.8, VERT_E, 0.9],
  [47.1, CHEIA, 0.9],
  [49.8, push(1.05), 3],
  [52.4, VERT, 0.8],
  [56.1, CHEIA, 0.9],
  [57.0, push(1.07), 2.9],
];

const lerp = (a: Ret, b: Ret, p: number): Ret => {
  const o = {} as Ret;
  (Object.keys(a) as (keyof Ret)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * p));
  return o;
};

export const retEm = (t: number) => {
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
        boxShadow: emCard ? `0 0 0 3px rgba(140,133,255,${Math.min(0.6, c.r / 50)}), 0 30px 80px rgba(10,5,40,.65), 0 0 70px rgba(103,61,230,.35)` : 'none',
      }}
    >
      <div style={{position: 'absolute', left: c.vx, top: c.vy, width: 1920 * c.vs, height: 1080 * c.vs, filter: c.g > 0.01 ? `grayscale(${c.g}) contrast(1.05)` : undefined}}>
        <OffthreadVideo src={arq('video/abertura.mp4')} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// ---------- Peças das cenas ----------

const Icone: React.FC<{tipo: 'ok' | 'gira' | 'x'; t: number; size?: number}> = ({tipo, t, size = 40}) => {
  if (tipo === 'gira')
    return <div style={{width: size, height: size, borderRadius: '50%', border: `5px solid rgba(140,133,255,.3)`, borderTopColor: COR.lilas, transform: `rotate(${t * 360}deg)`}} />;
  const cor = tipo === 'ok' ? COR.verde : COR.rosa;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill={cor} />
      {tipo === 'ok' ? <path d="M11 21 l6 6 l12 -13" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M13 13 L27 27 M27 13 L13 27" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />}
    </svg>
  );
};

const LinhaTarefa: React.FC<{em: number; nome: string; status: string; tipo: 'ok' | 'gira'; viraOk?: number}> = ({em, nome, status, tipo, viraOk}) => {
  const t = useAgora();
  const m = useMola(em);
  const ok = viraOk !== undefined && t >= viraOk;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '22px 28px',
        background: 'rgba(235,228,255,.06)',
        border: '1px solid rgba(140,133,255,.25)',
        borderRadius: 20,
        opacity: m,
        transform: `translateX(${(1 - m) * -60}px)`,
      }}
    >
      <Icone tipo={ok ? 'ok' : tipo} t={t} />
      <div style={{flex: 1, fontFamily: FONTE.ui, fontWeight: 700, fontSize: 38, color: COR.branco}}>{nome}</div>
      <div style={{fontFamily: FONTE.mono, fontSize: 26, color: ok || tipo === 'ok' ? COR.verde : COR.lilas}}>{ok ? 'concluída' : status}</div>
    </div>
  );
};

const Terminal: React.FC<{em: number; linhas: {txt: string; em: number; erro?: boolean}[]; style?: React.CSSProperties}> = ({linhas, style}) => {
  const t = useAgora();
  return (
    <div style={{position: 'absolute', inset: 0, background: '#0B0B12', padding: '70px 36px 30px', fontFamily: FONTE.mono, fontSize: 28, lineHeight: 1.6, ...style}}>
      <div style={{position: 'absolute', top: 22, left: 26, display: 'flex', gap: 12}}>
        {['#FC5185', '#FFB648', '#00B090'].map((c) => (
          <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
        ))}
      </div>
      {linhas.map((l, i) => {
        const n = Math.floor(interpolate(t, [l.em, l.em + 0.35], [0, l.txt.length], clamp));
        if (t < l.em) return null;
        return (
          <div key={i} style={{color: l.erro ? COR.rosa : COR.lavanda, whiteSpace: 'pre'}}>
            {l.txt.slice(0, n)}
            {n < l.txt.length && <span style={{background: COR.lavanda}}> </span>}
          </div>
        );
      })}
    </div>
  );
};

const ETAPAS = ['Terminal', 'SSH', 'VPS', 'Docker', 'Chaves .env'];

const Escada: React.FC<{em: number; riscaEm?: number}> = ({em, riscaEm}) => {
  const t = useAgora();
  return (
    <>
      {ETAPAS.map((nome, i) => {
        const r = riscaEm !== undefined ? interpolate(t, [riscaEm + i * 0.12, riscaEm + i * 0.12 + 0.25], [0, 1], {...clamp, easing: suave}) : 0;
        const cai = riscaEm !== undefined ? interpolate(t, [riscaEm + 0.9 + i * 0.06, riscaEm + 1.4 + i * 0.06], [0, 1], clamp) : 0;
        return (
          <div key={nome} style={{position: 'absolute', left: 80 + i * 262, top: 0, transform: `translateY(${-i * 22 + cai * 500}px) rotate(${cai * (i % 2 ? 14 : -14)}deg)`, opacity: 1 - cai}}>
            <Chip em={em + i * 0.16} texto={nome} tom="vidro" tamanho={34} giro={0} mono style={{position: 'relative'}} />
            <div style={{position: 'absolute', left: -6, right: -6, top: '50%', height: 6, borderRadius: 3, background: COR.rosa, transform: `scaleX(${r})`, transformOrigin: 'left'}} />
            {i < ETAPAS.length - 1 && <Seta em={em + i * 0.16 + 0.1} />}
          </div>
        );
      })}
    </>
  );
};

const Seta: React.FC<{em: number}> = ({em}) => {
  const p = useEm(em, 0.25);
  return <div style={{position: 'absolute', left: '100%', top: 18, marginLeft: 10, width: 30 * p, height: 4, background: COR.lilas, borderRadius: 2}} />;
};

const Comentario: React.FC<{em: number; texto: React.ReactNode; x: number; y: number; giro?: number; cor: string}> = ({em, texto, x, y, giro = 0, cor}) => {
  const m = useMola(em);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        padding: '22px 30px 24px 22px',
        background: 'rgba(29,30,32,.85)',
        border: '1px solid rgba(140,133,255,.3)',
        borderRadius: 26,
        boxShadow: '0 24px 50px rgba(5,2,20,.6)',
        opacity: m,
        transform: `translateY(${(1 - m) * 40}px) scale(${0.9 + 0.1 * m}) rotate(${giro}deg)`,
        transformOrigin: 'left bottom',
      }}
    >
      <div style={{width: 56, height: 56, borderRadius: 28, background: cor, flexShrink: 0}} />
      <div style={{fontFamily: FONTE.ui, fontWeight: 500, fontSize: 36, lineHeight: 1.3, color: COR.branco, maxWidth: 760}}>{texto}</div>
    </div>
  );
};

const Marca: React.FC<{em: number; children: React.ReactNode}> = ({em, children}) => {
  const p = useEm(em, 0.4);
  return (
    <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
      <span style={{position: 'absolute', left: -6, right: -6, top: '8%', bottom: '4%', background: 'rgba(103,61,230,.65)', borderRadius: 8, transform: `scaleX(${p})`, transformOrigin: 'left'}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

// Thumb real do vídeo do Hermes; o scale apara a borda clara da captura.
const ThumbHermes: React.FC = () => (
  <Img src={arq('prints/thumb-video-hermes.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.015)'}} />
);

const Rotulo: React.FC<{em: number; texto: string; style?: React.CSSProperties}> = ({em, texto, style}) => {
  const p = useEm(em, 0.4);
  return (
    <div style={{position: 'absolute', display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONTE.ui, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COR.lilas, opacity: p, ...style}}>
      <div style={{width: 60 * p, height: 3, background: COR.lilas}} />
      {texto}
    </div>
  );
};

// ---------- Cenas (tempos do palavras.json) ----------

const C02: React.FC = () => (
  <>
    <Cena de={0.92} ate={2.54} saida="corte">
      <Card3D em={0.92} x={90} y={150} w={1100} h={619} ry={10}>
        <Broll id="B1" rotulo="notebook fechando" rate={2.2} inicio={1.4} />
      </Card3D>
      <Frase em={1.0} texto="desliga o *computador." tamanho={76} style={{left: 100, top: 830}} />
    </Cena>
    <Cena de={2.54} ate={4.7}>
      <Card3D em={2.54} x={90} y={150} w={1100} h={619} ry={-8}>
        <Broll id="B2" rotulo="servidores roxos trabalhando" />
      </Card3D>
      <Frase em={2.6} texto="…e o agente *continua." tamanho={76} style={{left: 100, top: 830}} />
    </Cena>
  </>
);

const C03: React.FC = () => {
  const t = useAgora();
  const pulso = 0.5 + 0.5 * Math.sin(t * 6);
  const relogio = useMola(7.78);
  const min = Math.round(interpolate(t, [7.78, 8.6], [57, 60], clamp));
  return (
    <>
      <Card3D em={4.7} x={70} y={130} w={860} h={560} ry={8} raio={32}>
        <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(47,28,106,.9), rgba(14,10,36,.95))', padding: 40, display: 'flex', flexDirection: 'column', gap: 22}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONTE.mono, fontSize: 26, color: COR.lavanda, marginBottom: 10}}>
            <div style={{width: 16, height: 16, borderRadius: 8, background: COR.verde, boxShadow: `0 0 ${10 + pulso * 14}px ${COR.verde}`}} />
            agente · online
          </div>
          <LinhaTarefa em={5.14} nome="Pesquisa" status="rodando" tipo="gira" viraOk={6.0} />
          <LinhaTarefa em={6.18} nome="Tarefas complexas" status="executando" tipo="gira" />
        </AbsoluteFill>
      </Card3D>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 740,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          opacity: relogio,
          transform: `translateY(${(1 - relogio) * 40}px)`,
        }}
      >
        <div style={{fontFamily: FONTE.mono, fontWeight: 600, fontSize: 130, color: COR.branco, letterSpacing: -4}}>{min === 60 ? '03:00' : `02:${min}`}</div>
        <div style={{fontFamily: FONTE.serif, fontStyle: 'italic', fontSize: 58, color: COR.lilas, lineHeight: 1}}>
          no horário
          <br />
          que você definiu
        </div>
      </div>
    </>
  );
};

const C04: React.FC = () => {
  const m = useMola(9.14, 11);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 90,
          padding: '10px 30px',
          border: `5px solid ${COR.rosa}`,
          borderRadius: 14,
          fontFamily: FONTE.ui,
          fontWeight: 800,
          fontSize: 62,
          letterSpacing: 14,
          color: COR.rosa,
          opacity: m,
          transform: `rotate(-5deg) scale(${2 - m})`,
        }}
      >
        ANTES
      </div>
      <Chip em={11.54} texto="Hermes" tom="vidro" tamanho={46} style={{left: 90, top: 690}} />
      <Chip em={11.92} texto="OpenClaw" tom="roxo" tamanho={46} giro={2} style={{left: 110, top: 800}} />
    </>
  );
};

const LINHAS_DOR = [
  {txt: '$ ssh root@203.0.113.7', em: 15.76},
  {txt: '$ apt update && apt upgrade -y', em: 16.05},
  {txt: '$ docker compose up -d', em: 16.34},
  {txt: 'ERROR: permission denied', em: 16.6, erro: true},
  {txt: '$ nano .env', em: 16.8},
  {txt: '✗ falha ao configurar o servidor', em: 17.06, erro: true},
];

const C05: React.FC = () => {
  const t = useAgora();
  const treme = t > 16.6 && t < 17.2 ? Math.sin(t * 90) * 4 : 0;
  return (
    <>
      <Frase em={14.18} texto="várias etapas *técnicas" tamanho={80} style={{left: 90, top: 60}} />
      <Card3D em={15.6} x={80} y={220} w={800} h={460} ry={8} raio={22} style={{transform: `translateX(${treme}px)`}}>
        <Terminal em={15.76} linhas={LINHAS_DOR} />
      </Card3D>
      <Card3D em={16.34} x={930} y={170} w={540} h={340} ry={-12} raio={22}>
        <Broll id="B3" rotulo="cabos emaranhados" />
      </Card3D>
      <div style={{position: 'absolute', left: 0, top: 880}}>
        <Escada em={14.52} />
      </div>
    </>
  );
};

const C06: React.FC = () => (
  <>
    <Frase em={17.62} texto="*Hoje," tamanho={170} style={{left: 80, top: 250}} />
    <Frase em={18.8} texto="sem saber" serif={false} tamanho={92} style={{left: 86, top: 470}} />
    <div style={{position: 'absolute', left: 86, top: 590, display: 'inline-block'}}>
      <Frase em={19.3} texto="programar" serif={false} tamanho={92} cor={COR.lavanda} style={{position: 'relative'}} />
      <Traco em={19.6} style={{left: -8, right: 12, top: 52}} />
    </div>
  </>
);

const C07: React.FC = () => (
  <>
    <Rotulo em={20.8} texto="O VÍDEO SOBRE O HERMES" style={{left: 100, top: 70}} />
    <Card3D em={20.8} x={90} y={130} w={640} h={360} ry={12}>
      <ThumbHermes />
    </Card3D>
    <Comentario em={22.88} x={330} y={470} giro={-1} cor={COR.lilas} texto={<>Tem alguma forma <Marca em={25.04}>mais simples</Marca>?</>} />
    <Comentario em={23.4} x={250} y={630} giro={1} cor={COR.rosa} texto="Dá pra fazer sem mexer no terminal?" />
    <Comentario em={23.9} x={360} y={790} giro={-0.5} cor={COR.verde} texto={<>Queria configurar o <Marca em={26.14}>meu próprio agente</Marca>.</>} />
  </>
);

const C08: React.FC = () => <Rotulo em={28.26} texto="HOJE NO VÍDEO" style={{left: 90, top: 90}} />;

const C09: React.FC = () => {
  const escreve = useEm(30.1, 0.8);
  return (
    <>
      <Card3D em={29.7} x={80} y={80} w={860} h={484} ry={10}>
        <Broll id="B4" rotulo="garra robótica roxa" />
      </Card3D>
      <div style={{position: 'absolute', left: 90, top: 600, fontFamily: FONTE.serif, fontStyle: 'italic', fontSize: 150, color: COR.branco, clipPath: `inset(0 ${(1 - escreve) * 100}% 0 0)`, textShadow: '0 0 40px rgba(103,61,230,.8)'}}>
        OpenClaw
      </div>
      <div style={{position: 'absolute', left: 96, top: 800, display: 'flex', alignItems: 'baseline'}}>
        <Frase em={31.94} texto="a instalação mais" serif={false} tamanho={62} style={{position: 'relative'}} />
        <div style={{position: 'relative'}}>
          <Frase em={32.3} texto="*simples" tamanho={80} style={{position: 'relative'}} />
          <Traco em={33.4} dur={0.4} cor={COR.lilas} espessura={6} style={{left: 0, right: 18, bottom: -4}} />
        </div>
      </div>
    </>
  );
};

const C10: React.FC = () => {
  const t = useAgora();
  const x = useEm(35.06, 0.35);
  return (
    <>
      <Card3D em={33.98} x={80} y={80} w={820} h={420} ry={10} raio={22}>
        <Terminal em={34.0} linhas={[{txt: '$ ssh root@…', em: 34.1}, {txt: '$ sudo …', em: 34.4}]} style={{filter: `grayscale(${x}) brightness(${1 - x * 0.5})`}} />
        <svg width="820" height="420" style={{position: 'absolute', inset: 0}}>
          <path d="M260 90 L560 330" stroke={COR.rosa} strokeWidth="22" strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - x)} />
          <path d="M560 90 L260 330" stroke={COR.rosa} strokeWidth="22" strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - interpolate(t, [35.2, 35.5], [0, 1], clamp))} />
        </svg>
      </Card3D>
      <Frase em={35.1} texto="sem *terminal." tamanho={96} style={{left: 960, top: 570}} />
      <div style={{position: 'absolute', left: 0, top: 860}}>
        <Escada em={36.0} riscaEm={36.76} />
      </div>
    </>
  );
};

const C11: React.FC = () => {
  const t = useAgora();
  const n = Math.round(interpolate(t, [39.8, 40.5], [0, 50], {...clamp, easing: suave}));
  const enche = useEm(39.8, 0.7);
  const seg = useEm(43.04, 0.5);
  const contador = useMola(39.8);
  return (
    <>
      <Card3D em={38.5} x={720} y={60} w={1120} h={630} ry={-10}>
        <ThumbHermes />
        <AbsoluteFill style={{background: 'linear-gradient(transparent 75%, rgba(5,2,20,.75))'}} />
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 36, height: 14, borderRadius: 7, background: 'rgba(235,228,255,.25)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${enche * 100}%`, borderRadius: 7, background: COR.lavanda}} />
          <div style={{position: 'absolute', left: 0, top: -4, bottom: -4, width: `${30 * seg}%`, borderRadius: 9, background: COR.rosa, boxShadow: `0 0 24px ${COR.rosa}`}} />
        </div>
      </Card3D>
      <div style={{position: 'absolute', left: 740, top: 750, opacity: contador, transform: `translateY(${(1 - contador) * 40}px)`}}>
        <div style={{fontFamily: FONTE.serif, fontSize: 170, lineHeight: 1, color: COR.branco}}>
          +{n} <span style={{fontStyle: 'italic', color: COR.lilas, fontSize: 110}}>min</span>
        </div>
      </div>
      <Chip em={43.04} texto="15 min só de configuração" tom="rosa" tamanho={36} giro={-2} style={{left: 1200, top: 770}} />
      <Chip em={45.9} texto="VPS" tom="vidro" tamanho={40} mono giro={2} style={{left: 1230, top: 890}} />
      <Chip em={46.6} texto="terminal" tom="vidro" tamanho={40} mono giro={-1} style={{left: 1430, top: 910}} />
    </>
  );
};

const C12: React.FC = () => {
  const t = useAgora();
  const d = useEm(47.4, 0.4);
  const alisa = interpolate(t, [48.1, 48.8], [1, 0], {...clamp, easing: suave});
  const pts = Array.from({length: 61}, (_, i) => {
    const x = i * 9;
    const y = 40 + alisa * (Math.sin(i * 0.9) * 26 + Math.sin(i * 2.3) * 12);
    return `${i ? 'L' : 'M'}${x} ${y}`;
  }).join(' ');
  return (
    <>
      <Frase em={48.1} texto="*simplificar." tamanho={128} style={{left: 70, top: 330}} />
      <svg width="560" height="80" style={{position: 'absolute', left: 84, top: 520, overflow: 'visible'}}>
        <path d={pts} fill="none" stroke={alisa > 0.5 ? COR.rosa : COR.lilas} strokeWidth="8" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - d)} />
      </svg>
    </>
  );
};

const C13: React.FC = () => (
  <>
    <Chip em={50.44} texto="▶ 00:00" tom="roxo" mono tamanho={44} style={{left: 90, top: 800}} />
    <Frase em={51.04} texto="do *zero" tamanho={110} style={{left: 90, top: 640}} />
  </>
);

const C14: React.FC = () => {
  const n = useMola(54.52, 13);
  return (
    <>
      <Card3D em={52.96} x={90} y={130} w={1100} h={619} ry={10}>
        <Broll id="B5" rotulo="escritório à noite, celular acende" />
      </Card3D>
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 640,
          width: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '22px 26px',
          background: 'rgba(247,245,255,.94)',
          borderRadius: 28,
          boxShadow: '0 30px 60px rgba(5,2,20,.6)',
          opacity: n,
          transform: `translateY(${(1 - n) * -60}px) scale(${0.9 + 0.1 * n})`,
        }}
      >
        <div style={{width: 72, height: 72, borderRadius: 18, background: COR.roxo, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M10 21 l7 7 l13 -15" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{fontFamily: FONTE.ui}}>
          <div style={{fontWeight: 800, fontSize: 32, color: COR.fundo}}>Seu agente</div>
          <div style={{fontWeight: 500, fontSize: 28, color: '#4B4766'}}>Tarefa concluída · relatório pronto</div>
        </div>
      </div>
      <Frase em={54.52} texto="trabalhando *para você." tamanho={76} style={{left: 100, top: 850}} />
    </>
  );
};

const C15: React.FC = () => {
  const a = useMola(58.74);
  return (
    <>
      <Frase em={56.36} texto="simples." tamanho={150} style={{left: 80, top: 300}} />
      <Frase em={57.0} texto="*útil." tamanho={150} style={{left: 80, top: 460}} />
      <div style={{position: 'absolute', left: 90, top: 830, opacity: a, transform: `translateX(${(1 - a) * -40}px)`, display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{width: 8, height: 92, borderRadius: 4, background: COR.roxo}} />
        <div>
          <div style={{fontFamily: FONTE.ui, fontWeight: 800, fontSize: 52, color: COR.branco}}>OpenClaw</div>
          <div style={{fontFamily: FONTE.serif, fontStyle: 'italic', fontSize: 38, color: COR.lavanda}}>do zero, sem terminal</div>
        </div>
      </div>
    </>
  );
};

const C01: React.FC = () => <Frase em={0} texto="*Imagina…" tamanho={130} style={{left: 80, top: 420}} />;

export const OpenClaw: React.FC = () => (
  <AbsoluteFill style={{background: COR.fundo}}>
    <Fontes />
    <Fundo />
    <Camera />
    <Cena de={0} ate={0.92}><C01 /></Cena>
    <C02 />
    <Cena de={4.7} ate={9.1}><C03 /></Cena>
    <Cena de={9.14} ate={13.6}><C04 /></Cena>
    <Cena de={13.68} ate={17.62} saida="cai"><C05 /></Cena>
    <Cena de={17.62} ate={20.2}><C06 /></Cena>
    <Cena de={20.26} ate={27.6}><C07 /></Cena>
    <Cena de={27.62} ate={29.5}><C08 /></Cena>
    <Cena de={29.6} ate={33.95}><C09 /></Cena>
    <Cena de={33.98} ate={37.85}><C10 /></Cena>
    <Cena de={37.88} ate={47.3}><C11 /></Cena>
    <Cena de={47.3} ate={49.7}><C12 /></Cena>
    <Cena de={49.76} ate={52.9}><C13 /></Cena>
    <Cena de={52.96} ate={56.3}><C14 /></Cena>
    <Cena de={56.36} ate={59.89} saida="corte"><C15 /></Cena>
  </AbsoluteFill>
);
