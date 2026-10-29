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
import {ALTURA, arq, cena as arquivoDaCena, COR, DISSOLVE, FONTE, LARGURA} from './base';
import {DURACAO2, LEGENDAS2, PLANOS2} from './dados2';
import {Folha, Meses} from './Folha';

/* ----------------------------------------------------------------------------
   012 — Bloco 2: o Passo 1 e as três colunas (1:50 → 5:00 do roteiro S01B).

   O que muda em relação ao bloco 1: aqui a maior parte do tempo não é imagem
   gerada, é a folha desenhada em código. Os planos alternam entre os dois, e a
   folha é cumulativa — quando a montagem corta para uma cena ilustrada e volta,
   ela continua de onde estava.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const NARRACAO2 = arq('audio/bloco2.wav');

type Plano = {tipo: string; n: number; s: number; fim: number; i: number};

const PlanoIlustrado: React.FC<{tempo: number; p: Plano}> = ({tempo, p}) => {
  const avanco = interpolate(tempo, [p.s, p.fim], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const escala = 1.06 + avanco * 0.07;
  const lado = p.i % 2 === 0 ? 1 : -1;
  const desloca = lado * avanco * Math.min(26, (p.fim - p.s) * 3);
  return (
    <AbsoluteFill
      style={{transform: `scale(${escala}) translateX(${desloca}px)`, transformOrigin: '50% 50%'}}
    >
      <Img src={arquivoDaCena(p.n)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

/** Os planos de folha e de gráfico vivem sobre a mesma superfície de papel. */
const PlanoDesenhado: React.FC<{tempo: number; p: Plano}> = ({tempo, p}) => {
  // Empurrão bem de leve: é texto, e texto escalando demais fica borrado.
  const avanco = interpolate(tempo, [p.s, p.fim], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const escala = 1 + avanco * 0.018;
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <AbsoluteFill style={{transform: `scale(${escala})`, transformOrigin: '50% 50%'}}>
        {p.tipo === 'meses' ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 240,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: FONTE,
                fontWeight: 600,
                fontSize: 30,
                letterSpacing: 5,
                color: COR.tinta,
                opacity: 0.6,
              }}
            >
              OS SEIS ÚLTIMOS MESES
            </div>
            <Meses tempo={tempo} inicio={p.s} />
          </>
        ) : (
          <Folha tempo={tempo} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Legenda: React.FC<{tempo: number}> = ({tempo}) => {
  const atual = LEGENDAS2.find((l) => tempo >= l.s - 0.12 && tempo < l.e + 0.18);
  if (!atual) return null;
  const entra = corre(tempo, atual.s - 0.12, atual.s + 0.1, suave);
  const sai = 1 - corre(tempo, atual.e, atual.e + 0.16, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 42,
        display: 'flex',
        justifyContent: 'center',
        opacity: entra * sai,
      }}
    >
      <div
        style={{
          maxWidth: LARGURA * 0.66,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.34,
          color: COR.tinta,
          background: 'rgba(246,239,230,0.92)',
          padding: '12px 28px',
          borderRadius: 10,
          boxShadow: '0 6px 26px rgba(62,46,38,0.14)',
        }}
      >
        {atual.t}
      </div>
    </div>
  );
};

/** `comAudio` existe para a composição completa: lá a trilha é uma só, contínua,
 *  e cada bloco entra sem o próprio áudio. */
export const Bloco2: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;

  const planos: Plano[] = PLANOS2.map((p, i) => ({
    tipo: p.tipo,
    n: p.n,
    s: p.s,
    fim: i + 1 < PLANOS2.length ? PLANOS2[i + 1].s : DURACAO2,
    i,
  }));

  const visiveis = planos.filter((p) => tempo >= p.s - DISSOLVE - 0.2 && tempo < p.fim + 0.4);

  return (
    <AbsoluteFill style={{background: COR.papel}}>
      {visiveis.map((p) => (
        <AbsoluteFill key={`${p.tipo}-${p.n}-${p.s}`} style={{opacity: corre(tempo, p.s, p.s + DISSOLVE, suave)}}>
          {p.tipo === 'img' ? (
            <PlanoIlustrado tempo={tempo} p={p} />
          ) : (
            <PlanoDesenhado tempo={tempo} p={p} />
          )}
        </AbsoluteFill>
      ))}
      <Legenda tempo={tempo} />
      {comAudio ? <Audio src={NARRACAO2} /> : null}
    </AbsoluteFill>
  );
};

export default Bloco2;
