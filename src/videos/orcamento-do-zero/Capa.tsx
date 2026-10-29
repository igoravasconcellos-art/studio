import React from 'react';
import {Img} from 'remotion';
import {cena, COR, FONTE, FOLHA_CENA3} from './base';
import {REELS_ALTURA, REELS_LARGURA} from './Reels';

/* ----------------------------------------------------------------------------
   A capa do Reels, 1080×1920.

   O Instagram mostra esta imagem em dois lugares e corta diferente em cada um:
   na aba de Reels do perfil ela aparece inteira, em 9:16; na grade do perfil e
   no feed ela é cortada no **quadrado central**. Então a regra é a mesma do
   banner do YouTube, com outra geometria: a mensagem mora no quadrado do meio,
   e o que estiver fora dele pode sumir sem perda.

   O rodapé também não é seguro — é onde entram o ícone de play, o nome e a
   contagem de visualizações. Nada de texto ali.

   As palavras são as mesmas da miniatura do YouTube, de propósito: quem vê o
   Reels e depois chega no canal reconhece a mesma promessa, em vez de achar que
   são dois vídeos diferentes. E as duas são ditas dentro do próprio Reels.
---------------------------------------------------------------------------- */

// O quadrado central — o que sobrevive a todos os cortes — vai de y 420 a y 1500.
// A imagem termina em 1060 e o texto ocupa de 1120 a cerca de 1470: tudo dentro.
const CORAL_TEXTO = '#C2301F';
const ALTURA_IMG = 1060;

/** As três colunas desenhadas na folha em branco que ele segura. */
const Folhinha: React.FC<{escala: number; deslocaY: number}> = ({escala, deslocaY}) => {
  const L = 2752 * escala;
  const A = 1536 * escala;
  const x = FOLHA_CENA3.x0 * L;
  const y = FOLHA_CENA3.y0 * A + deslocaY;
  const w = (FOLHA_CENA3.x1 - FOLHA_CENA3.x0) * L;
  const h = (FOLHA_CENA3.y1 - FOLHA_CENA3.y0) * A;
  const pad = w * 0.07;
  const largCol = (w - pad * 2) / 3;
  const cores = [COR.tinta, COR.terracota, COR.oliva];
  const preenchida = [0.82, 0.5, 0.26];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${FOLHA_CENA3.giro}deg)`,
        transformOrigin: 'center',
      }}
    >
      {cores.map((cor, i) => {
        const cx = pad + largCol * i;
        const util = h - pad * 2 - h * 0.1;
        const linhas = Math.round(preenchida[i] * 7);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: cx + largCol * 0.08,
                top: pad,
                width: largCol * 0.84,
                height: h * 0.055,
                background: cor,
                borderRadius: 4,
              }}
            />
            {Array.from({length: linhas}).map((_, k) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: cx + largCol * 0.08,
                  top: pad + h * 0.1 + k * (util / 8),
                  width: largCol * (k % 3 === 2 ? 0.55 : 0.78),
                  height: Math.max(4, h * 0.012),
                  background: cor,
                  opacity: 0.42,
                  borderRadius: 2,
                }}
              />
            ))}
            {i > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: cx - largCol * 0.02,
                  top: pad,
                  width: 3,
                  height: h - pad * 2,
                  background: COR.tinta,
                  opacity: 0.28,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Capa: React.FC = () => {
  // A ilustração é 16:9 e a faixa da capa é quase quadrada. Entrar pela largura
  // deixaria uma tira de 603 px de imagem e meia tela de papel vazio, então ela
  // entra pela ALTURA e é cortada dos lados — centrada entre o rosto (x 1362 da
  // imagem original) e a borda direita da folha (x 2229), que é o que precisa
  // sobreviver ao corte.
  const escala = ALTURA_IMG / 1536;
  const CENTRO = 1700; // em pixels da ilustração original, entre o rosto e a folha
  const deslocaX = REELS_LARGURA / 2 - CENTRO * escala;

  return (
    <div
      style={{
        width: REELS_LARGURA,
        height: REELS_ALTURA,
        position: 'relative',
        overflow: 'hidden',
        background: COR.papel,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, width: REELS_LARGURA, height: ALTURA_IMG, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: deslocaX, top: 0, width: 2752 * escala, height: ALTURA_IMG}}>
          <Img src={cena(3)} style={{width: '100%', height: '100%'}} />
          <Folhinha escala={escala} deslocaY={0} />
        </div>
      </div>

      {/* O texto, inteiro dentro do quadrado central. */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: ALTURA_IMG + 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 128,
            lineHeight: 1.04,
            letterSpacing: -3,
            color: COR.tinta,
            whiteSpace: 'nowrap',
          }}
        >
          3 colunas.
        </div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 128,
            lineHeight: 1.04,
            letterSpacing: -3,
            color: CORAL_TEXTO,
            whiteSpace: 'nowrap',
          }}
        >
          15 minutos.
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONTE,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: 4,
            color: COR.tinta,
            opacity: 0.6,
            whiteSpace: 'nowrap',
          }}
        >
          O MÊS INTEIRO NUMA FOLHA
        </div>
      </div>

    </div>
  );
};
