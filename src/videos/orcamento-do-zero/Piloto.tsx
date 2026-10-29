import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  ALTURA,
  cena as arquivoDaCena,
  COLUNAS,
  COR,
  CORTE_SECO,
  DISSOLVE,
  FOLHA_CENA14,
  FOLHA_CENA3,
  FONTE,
  FONTE_MAO,
  LARGURA,
  NARRACAO,
  POSICAO_KW,
} from './base';
import {CENAS, DURACAO, LEGENDAS} from './dados';

/* ----------------------------------------------------------------------------
   Piloto do 012 — 0:00 a 1:31 do roteiro S01B.

   As regras do formato, herdadas da referência e do projeto 011:
   1. A câmera nunca para: cada plano tem um empurrão lento que não reinicia.
   2. Nada entra de estalo. Legenda e palavra-chave sobem atravessando a máscara.
   3. Os cortes casados (11→12 e 15→16) são secos: o cenário é o mesmo e só uma
      coisa muda, então dissolver apagaria o que o corte tem a dizer.
   4. Todo texto é desenhado aqui, nunca dentro da imagem gerada.
   5. Todo gatilho vem do palavras.json, via dados.ts.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Sobe atravessando a máscara. É a única forma de texto entrar aqui. */
const Sobe: React.FC<{
  tempo: number;
  gatilho: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({tempo, gatilho, dur = 0.5, style, children}) => {
  const p = corre(tempo, gatilho, gatilho + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em'}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%)`, ...style}}>{children}</div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   A folha das três colunas, desenhada sobre o papel em branco da cena 14.
   É o motivo de a construção ser híbrida: número e texto nítidos, e de graça.
---------------------------------------------------------------------------- */

const FolhaTresColunas: React.FC<{tempo: number; inicio: number}> = ({tempo, inicio}) => {
  const {x0, y0, x1, y1} = FOLHA_CENA14;
  const x = x0 * LARGURA;
  const y = y0 * ALTURA;
  const w = (x1 - x0) * LARGURA;
  const h = (y1 - y0) * ALTURA;
  // As duas divisórias se desenham de cima para baixo, uma depois da outra.
  const risco = (i: number) => corre(tempo, inicio + 0.5 + i * 0.25, inicio + 1.1 + i * 0.25, suave);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: (w / 3) * i,
            top: 0,
            width: 4,
            height: h * risco(i - 1),
            background: COR.tinta,
            opacity: 0.55,
          }}
        />
      ))}
      {COLUNAS.map((c, i) => (
        <div
          key={c.titulo}
          style={{
            position: 'absolute',
            left: (w / 3) * i,
            top: h * 0.07,
            width: w / 3,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Sobe
            tempo={tempo}
            gatilho={inicio + 0.75 + i * 0.28}
            style={{
              fontFamily: FONTE,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 2,
              color: c.cor,
            }}
          >
            {c.titulo}
          </Sobe>
        </div>
      ))}
    </div>
  );
};

/** As divisórias se desenhando na folha que ele segura na cena 3. Sem título: não cabe. */
const FolhaRiscada: React.FC<{tempo: number; inicio: number}> = ({tempo, inicio}) => {
  const {x0, y0, x1, y1, giro} = FOLHA_CENA3;
  const x = x0 * LARGURA;
  const y = y0 * ALTURA;
  const w = (x1 - x0) * LARGURA;
  const h = (y1 - y0) * ALTURA;
  const risco = (i: number) => corre(tempo, inicio + 1.4 + i * 0.3, inicio + 2.1 + i * 0.3, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${giro}deg)`,
        transformOrigin: '50% 50%',
      }}
    >
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: (w / 3) * i,
            top: h * 0.06,
            width: 3,
            height: h * 0.88 * risco(i - 1),
            background: COR.tinta,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
};

/* ----------------------------------------------------------------------------
   Um plano: a imagem com o empurrão da câmera, mais o que for desenhado nela.
---------------------------------------------------------------------------- */

type Plano = {n: number; s: number; fim: number; kw: string | null; i: number};

const Cena: React.FC<{tempo: number; plano: Plano}> = ({tempo, plano}) => {
  const {n, s, fim, kw, i} = plano;

  // Entrada: corte seco nos cortes casados, dissolve no resto.
  const entrada = CORTE_SECO.has(n) ? 1 : corre(tempo, s, s + DISSOLVE, suave);

  // A câmera nunca para. Lados alternados para o movimento não virar um tique.
  const dur = Math.max(0.1, fim - s);
  const avanco = interpolate(tempo, [s, fim], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const escala = 1.06 + avanco * 0.07;
  const lado = i % 2 === 0 ? 1 : -1;
  const desloca = lado * avanco * Math.min(26, dur * 3);

  const pos = POSICAO_KW[n] ?? 'esq';
  const kwGatilho = s + 0.55;
  const kwSai = 1 - corre(tempo, fim - 0.5, fim - 0.1, suave);

  return (
    <AbsoluteFill style={{opacity: entrada}}>
      <AbsoluteFill
        style={{
          transform: `scale(${escala}) translateX(${desloca}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        <Img src={arquivoDaCena(n)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {n === 14 ? <FolhaTresColunas tempo={tempo} inicio={s} /> : null}
        {n === 3 ? <FolhaRiscada tempo={tempo} inicio={s} /> : null}
      </AbsoluteFill>

      {kw ? (
        <div
          style={{
            position: 'absolute',
            top: ALTURA * 0.1,
            left: pos === 'esq' ? 110 : pos === 'centro' ? 0 : undefined,
            right: pos === 'dir' ? 110 : undefined,
            width: pos === 'centro' ? LARGURA : undefined,
            display: 'flex',
            justifyContent: pos === 'centro' ? 'center' : 'flex-start',
            opacity: kwSai,
          }}
        >
          <Sobe
            tempo={tempo}
            gatilho={kwGatilho}
            dur={0.6}
            style={{
              fontFamily: FONTE_MAO,
              fontWeight: 700,
              fontSize: 104,
              lineHeight: 1.1,
              color: COR.tinta,
              textShadow: '0 2px 18px rgba(246,239,230,0.85)',
            }}
          >
            {kw}
          </Sobe>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------------------
   A legenda. Queimada, como na referência: duas linhas no máximo, embaixo.
---------------------------------------------------------------------------- */

const Legenda: React.FC<{tempo: number}> = ({tempo}) => {
  const atual = LEGENDAS.find((l) => tempo >= l.s - 0.12 && tempo < l.e + 0.18);
  if (!atual) return null;
  const entra = corre(tempo, atual.s - 0.12, atual.s + 0.1, suave);
  const sai = 1 - corre(tempo, atual.e, atual.e + 0.16, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 78,
        display: 'flex',
        justifyContent: 'center',
        opacity: entra * sai,
      }}
    >
      {/* Legenda escura sobre papel: a ilustração é clara, e texto branco com sombra
          não lê em cima dela. A tarja cor de papel resolve e combina com o traço. */}
      <div
        style={{
          maxWidth: LARGURA * 0.66,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.34,
          color: COR.tinta,
          background: 'rgba(246,239,230,0.9)',
          padding: '14px 30px',
          borderRadius: 10,
          boxShadow: '0 6px 26px rgba(62,46,38,0.14)',
        }}
      >
        {atual.t}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
   A composição.
---------------------------------------------------------------------------- */

/** `comAudio` existe para a composição completa: lá a trilha é uma só, contínua,
 *  e cada bloco entra sem o próprio áudio. */
export const Piloto: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;

  const planos: Plano[] = CENAS.map((c, i) => ({
    n: c.n,
    s: c.s,
    fim: i + 1 < CENAS.length ? CENAS[i + 1].s : DURACAO,
    kw: c.kw,
    i,
  }));

  // Só o plano atual e os vizinhos ficam montados: o resto sai da memória.
  const visiveis = planos.filter((p) => tempo >= p.s - DISSOLVE - 0.2 && tempo < p.fim + 0.4);

  return (
    <AbsoluteFill style={{background: COR.papel}}>
      {visiveis.map((p) => (
        <Cena key={p.n} tempo={tempo} plano={p} />
      ))}
      <Legenda tempo={tempo} />
      {comAudio ? <Audio src={NARRACAO} /> : null}
    </AbsoluteFill>
  );
};

export default Piloto;
