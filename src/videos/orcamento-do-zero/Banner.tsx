import React from 'react';
import {COR, FONTE} from './base';

/* ----------------------------------------------------------------------------
   O banner do canal, 2048×1152.

   O YouTube corta esta imagem de jeitos diferentes em cada aparelho, e só um
   retângulo de **1235×338 no centro** aparece em todos eles. É a única área onde
   pode haver texto: fora dela, some na TV, no celular ou nos dois.

   Daí a construção: todo o texto dentro da área segura, e o que está fora é
   decoração que pode ser cortada sem perda — as três faixas de cor, que são o
   mesmo motivo das três colunas do vídeo 012.

   Nada de marca na capa, por decisão de 29/10/2026: o canal é pessoal e as duas
   frentes (Nalu Invest e Criança de Futuro) vivem na descrição e nas playlists.
---------------------------------------------------------------------------- */

export const BANNER_LARGURA = 2048;
export const BANNER_ALTURA = 1152;

/** O retângulo que aparece em todo aparelho, centrado. */
const SEGURA = {w: 1235, h: 338};

const CORAL_TEXTO = '#C2301F';

export const Banner: React.FC = () => {
  const sx = (BANNER_LARGURA - SEGURA.w) / 2;
  const sy = (BANNER_ALTURA - SEGURA.h) / 2;

  return (
    <div
      style={{
        width: BANNER_LARGURA,
        height: BANNER_ALTURA,
        position: 'relative',
        overflow: 'hidden',
        background: COR.papel,
      }}
    >
      {/* O motivo das três colunas, atravessando o quadro inteiro. Fica atrás do
          texto e bem claro: ele existe para a TV, onde sobra imagem, e pode ser
          cortado no celular sem que falte nada. */}
      {[COR.tinta, COR.terracota, COR.oliva].map((cor, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: BANNER_LARGURA * (0.62 + i * 0.13),
            width: BANNER_LARGURA * 0.105,
            background: cor,
            opacity: 0.1,
          }}
        />
      ))}

      {/* A área segura. Tudo que precisa ser lido mora aqui dentro. */}
      <div
        style={{
          position: 'absolute',
          left: sx,
          top: sy,
          width: SEGURA.w,
          height: SEGURA.h,
          // No celular o recorte é exatamente esta caixa, então texto encostado na
          // borda esquerda fica espremido. A folga mora aqui dentro, não fora.
          paddingLeft: 48,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: COR.tinta,
            whiteSpace: 'nowrap',
          }}
        >
          Dinheiro e investimentos
        </div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 80,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: CORAL_TEXTO,
            whiteSpace: 'nowrap',
          }}
        >
          para quem nunca investiu
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: FONTE,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 7,
            color: COR.tinta,
            opacity: 0.62,
            whiteSpace: 'nowrap',
          }}
        >
          ORÇAMENTO · RESERVA · PRIMEIRO APORTE
        </div>
      </div>
    </div>
  );
};
