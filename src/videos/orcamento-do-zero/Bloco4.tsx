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
import {arq, cena as arquivoDaCena, COR, DISSOLVE, FONTE, LARGURA} from './base';
import {DURACAO4, LEGENDAS4, PLANOS4} from './dados4';
import {Calendario, Extrato, FolhaCamila, Fontes} from './Extrato';

/* ----------------------------------------------------------------------------
   012 — Bloco 4: onde achar os números sem sofrer (6:00 → 7:30 do roteiro S01B).

   Zero crédito outra vez. As duas cenas ilustradas são reaproveitadas: a da
   cozinha à noite, do bloco 1, para o "eu não sei quanto gasto em nada" — é a
   mesma pessoa que desistiu, e a rima com a abertura é de graça —, e a do casal
   à mesa, do bloco 2, para a Camila e o Rafael.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const NARRACAO4 = arq('audio/bloco4.wav');

const Legenda: React.FC<{tempo: number}> = ({tempo}) => {
  const atual = LEGENDAS4.find((l) => tempo >= l.s - 0.12 && tempo < l.e + 0.18);
  if (!atual) return null;
  const entra = corre(tempo, atual.s - 0.12, atual.s + 0.1, suave);
  const sai = 1 - corre(tempo, atual.e, atual.e + 0.16, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 34,
        display: 'flex',
        justifyContent: 'center',
        opacity: entra * sai,
      }}
    >
      <div
        style={{
          maxWidth: LARGURA * 0.68,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.34,
          color: COR.tinta,
          background: 'rgba(246,239,230,0.92)',
          padding: '11px 26px',
          borderRadius: 10,
          boxShadow: '0 6px 26px rgba(62,46,38,0.14)',
        }}
      >
        {atual.t}
      </div>
    </div>
  );
};

const Desenhado: React.FC<{tipo: string; tempo: number}> = ({tipo, tempo}) => {
  if (tipo === 'extrato') return <Extrato tempo={tempo} />;
  if (tipo === 'calendario') return <Calendario tempo={tempo} />;
  if (tipo === 'fontes') return <Fontes tempo={tempo} />;
  return <FolhaCamila tempo={tempo} />;
};

/** `comAudio` existe para a composição completa: lá a trilha é uma só, contínua,
 *  e cada bloco entra sem o próprio áudio. */
export const Bloco4: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;

  const planos = PLANOS4.map((p, i) => ({
    ...p,
    fim: i + 1 < PLANOS4.length ? PLANOS4[i + 1].s : DURACAO4,
    i,
  }));
  const visiveis = planos.filter((p) => tempo >= p.s - DISSOLVE - 0.2 && tempo < p.fim + 0.4);

  return (
    <AbsoluteFill style={{background: COR.papel}}>
      {visiveis.map((p) => {
        const avanco = interpolate(tempo, [p.s, p.fim], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const ehImagem = p.tipo === 'img';
        const escala = ehImagem ? 1.06 + avanco * 0.07 : 1 + avanco * 0.015;
        const desloca = ehImagem ? (p.i % 2 === 0 ? 1 : -1) * avanco * 22 : 0;
        return (
          <AbsoluteFill
            key={`${p.tipo}-${p.n}-${p.s}`}
            style={{opacity: corre(tempo, p.s, p.s + DISSOLVE, suave), background: COR.papel}}
          >
            <AbsoluteFill
              style={{
                transform: `scale(${escala}) translateX(${desloca}px)`,
                transformOrigin: '50% 50%',
              }}
            >
              {ehImagem ? (
                <Img
                  src={arquivoDaCena(p.n)}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              ) : (
                <Desenhado tipo={p.tipo} tempo={tempo} />
              )}
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      <Legenda tempo={tempo} />
      {comAudio ? <Audio src={NARRACAO4} /> : null}
    </AbsoluteFill>
  );
};

export default Bloco4;
