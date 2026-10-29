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
import {DURACAO3, LEGENDAS3, PLANOS3} from './dados3';
import {FolhaValores} from './FolhaValores';

/* ----------------------------------------------------------------------------
   012 — Bloco 3: o exemplo completo da família (5:00 → 6:00 do roteiro S01B).

   Este bloco não gastou um crédito: a folha é código e as duas cenas ilustradas
   são reaproveitadas do bloco 2 — o casal à mesa e a mesa de pizza.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const NARRACAO3 = arq('audio/bloco3.wav');

const Legenda: React.FC<{tempo: number}> = ({tempo}) => {
  const atual = LEGENDAS3.find((l) => tempo >= l.s - 0.12 && tempo < l.e + 0.18);
  if (!atual) return null;
  const entra = corre(tempo, atual.s - 0.12, atual.s + 0.1, suave);
  const sai = 1 - corre(tempo, atual.e, atual.e + 0.16, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
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

/** `comAudio` existe para a composição completa: lá a trilha é uma só, contínua,
 *  e cada bloco entra sem o próprio áudio. */
export const Bloco3: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;

  const planos = PLANOS3.map((p, i) => ({
    ...p,
    fim: i + 1 < PLANOS3.length ? PLANOS3[i + 1].s : DURACAO3,
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
        // A folha tem texto: empurrão quase nulo, senão borra.
        const escala = ehImagem ? 1.06 + avanco * 0.07 : 1 + avanco * 0.015;
        const desloca = ehImagem ? (p.i % 2 === 0 ? 1 : -1) * avanco * 22 : 0;
        return (
          <AbsoluteFill
            key={`${p.tipo}-${p.n}-${p.s}`}
            style={{opacity: corre(tempo, p.s, p.s + DISSOLVE, suave), background: COR.papel}}
          >
            <AbsoluteFill
              style={{transform: `scale(${escala}) translateX(${desloca}px)`, transformOrigin: '50% 50%'}}
            >
              {ehImagem ? (
                <Img
                  src={arquivoDaCena(p.n)}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              ) : (
                <FolhaValores tempo={tempo} />
              )}
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      <Legenda tempo={tempo} />
      {comAudio ? <Audio src={NARRACAO3} /> : null}
    </AbsoluteFill>
  );
};

export default Bloco3;
