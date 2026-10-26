import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Broll, COR, Cena, Fontes, Mesa, arq} from './base';
import {Camera} from './comum';
import {C0_1, C0_2, C0_3, C0_4, C0_6, C1_1, C1_10, C1_11, C1_3, C1_5, C1_6, C1_8, C1_9} from './bloco1';
import {C1_12, C2_1, C2_2} from './bloco2';
import {C3_1, C3_11, C3_12, C3_13, C3_14, C3_15, C3_16, C3_17, C3_2, C3_3, C3_4, C3_6, C3_7, C3_8, C3_9} from './bloco3';
import {C4_1, C4_2, C4_4, C4_5, C4_7, C5_1, C5_2, C5_3, C5_4} from './bloco4';
import {C6_1, C6_2, C6_3, C6_4, C6_5, C6_6, C6_7, C6_8} from './bloco5';
import {C7_1, C7_10, C7_10b, C7_11, C7_2, C7_3, C7_5, C7_6, C7_8, C8_1, C8_2, C8_4, C8_5, C9_1, C9_2} from './bloco6';

type Item = [number, number, React.FC, ('fade' | 'corte')?, ('fade' | 'corte')?];

// Embaixo da câmera: app, diagramas, cartelas e B-rolls. "corte" entre telas do app mantém a continuidade da janela.
const SOB: Item[] = [
  [4.75, 7.1, C0_2, 'corte'],
  [63.8, 77.7, C1_1],
  [77.7, 96.4, C1_3, 'corte'],
  [96.4, 98.2, C1_5],
  [98.2, 117.3, C1_6],
  [117.3, 130.4, C1_8, 'corte'],
  [130.4, 143.7, C1_9, 'corte'],
  [143.7, 156.0, C1_10],
  [156.0, 164.4, C1_11],
  [164.4, 173.1, C1_12],
  [173.1, 195.4, C2_1, 'corte'],
  [195.4, 203.2, C2_2],
  [203.2, 208.7, C3_1],
  [208.7, 228.2, C3_2],
  [228.2, 240.7, C3_3],
  [240.7, 247.9, C3_4],
  [247.9, 250.6, () => <Broll src={arq("hf/H3_mesa_producao.mp4")} duracaoClipe={5.04} />, 'corte', 'corte'],
  [250.6, 259.0, C3_6, 'corte'],
  [259.0, 275.3, C3_7],
  [275.3, 280.6, C3_8],
  [280.6, 309.7, C3_9, 'corte'],
  [309.7, 319.1, C3_11, 'corte'],
  [319.1, 335.3, C3_12],
  [335.3, 347.6, C3_13],
  [347.6, 369.5, C3_14, 'corte'],
  [369.5, 384.8, C3_15, 'corte'],
  [384.8, 392.4, C3_16, 'corte'],
  [392.4, 395.6, C3_17],
  [395.6, 400.0, () => <Broll src={arq("hf/H4_notebook_fechando.mp4")} duracaoClipe={5.04} />, 'corte', 'corte'],
  [400.0, 404.4, C3_17, 'corte'],
  [404.4, 411.3, C4_1],
  [411.3, 438.4, C4_2],
  [438.4, 445.2, C4_4],
  [445.2, 471.4, C4_5],
  [471.4, 480.9, C4_7, 'corte'],
  [480.9, 483.7, C5_1],
  [483.7, 493.8, C5_2],
  [493.8, 501.3, C5_3, 'corte'],
  [501.3, 511.2, C5_4, 'corte'],
  [511.2, 522.5, C6_1],
  [522.5, 532.8, C6_2],
  [532.8, 546.7, C6_3],
  [546.7, 556.1, C6_4, 'corte'],
  [556.1, 563.2, C6_5, 'corte'],
  [563.2, 573.4, C6_6, 'corte'],
  [573.4, 588.7, C6_7, 'corte'],
  [588.7, 608.9, C6_8, 'corte'],
  [608.9, 613.8, C7_1],
  [613.8, 624.8, C7_2],
  [624.8, 651.8, C7_3, 'corte'],
  [651.8, 667.0, C7_5, 'corte'],
  [667.0, 699.2, C7_6, 'corte'],
  [699.2, 719.8, C7_8, 'corte'],
  [719.8, 724.8, C7_10, 'corte'],
  [724.8, 739.1, C7_10b],
  [739.1, 753.2, C7_11],
  [753.2, 755.8, C8_1],
  [755.8, 763.8, C8_2],
  [763.8, 767.1, () => <Broll src={arq("hf/H5_microfone.mp4")} duracaoClipe={5.04} />, 'corte', 'corte'],
  [767.1, 781.5, C8_4, 'corte'],
  [781.5, 803.5, C8_5, 'corte', 'fade'],
];

// Por cima da câmera: os elementos da abertura e do encerramento em tela cheia.
const SOBRE: Item[] = [
  [0, 4.75, C0_1, 'corte', 'fade'],
  [7.1, 20.4, C0_3, 'corte', 'fade'],
  [20.4, 48.4, C0_4, 'corte'],
  [48.4, 63.8, C0_6, 'corte', 'fade'],
  [803.5, 817.4, C9_1, 'corte', 'fade'],
  [817.4, 849.7, C9_2, 'corte'],
];

const cenas = (lista: Item[]) =>
  lista.map(([de, ate, C, entrada = 'fade', saida = 'corte']) => (
    <Cena key={de} de={de} ate={ate} entrada={entrada} saida={saida}>
      <C />
    </Cena>
  ));

export const ClaudeCode2: React.FC = () => (
  <AbsoluteFill style={{background: COR.mesa}}>
    <Fontes />
    <Mesa />
    {cenas(SOB)}
    <Camera />
    {cenas(SOBRE)}
  </AbsoluteFill>
);
