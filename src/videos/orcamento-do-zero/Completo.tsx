import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {arq, COR, FPS} from './base';
import {Bloco2} from './Bloco2';
import {Bloco3} from './Bloco3';
import {Bloco4} from './Bloco4';
import {Fecho} from './Fecho';
import {Piloto} from './Piloto';

/* ----------------------------------------------------------------------------
   012 — O vídeo inteiro: os cinco blocos do roteiro S01B numa linha do tempo só.

   A trilha é uma única narração contínua (`narracao-completa.wav`), que é a
   concatenação das cinco com 0,6 s de pausa entre elas. Como o áudio de cada
   bloco é exatamente o mesmo que já estava lá, a sincronia é exata por
   construção: não há tempo recalculado, só deslocado.

   Cada bloco entra numa Sequence, então o `useCurrentFrame` de dentro continua
   contando do zero e os gatilhos de cada um valem sem mudar nada.
---------------------------------------------------------------------------- */

const seg = (s: number) => Math.round(s * FPS);

/** Duração de cada narração, medida com ffprobe, e a pausa entre elas. */
const DURACOES = [80.980000, 128.060000, 42.560000, 94.520000, 100.352000];
const PAUSA = 0.6;

const INICIOS = DURACOES.reduce<number[]>((acc, d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + DURACOES[i - 1] + PAUSA);
  return acc;
}, []);

export const DURACAO_COMPLETA = INICIOS[4] + DURACOES[4];

const BLOCOS = [Piloto, Bloco2, Bloco3, Bloco4, Fecho];

export const Completo: React.FC = () => (
  <AbsoluteFill style={{background: COR.papel}}>
    {BLOCOS.map((Bloco, i) => (
      <Sequence
        key={i}
        from={seg(INICIOS[i])}
        durationInFrames={seg(DURACOES[i] + (i < 4 ? PAUSA : 0))}
      >
        <Bloco comAudio={false} />
      </Sequence>
    ))}
    <Audio src={arq('audio/narracao-completa.wav')} />
  </AbsoluteFill>
);

export default Completo;
