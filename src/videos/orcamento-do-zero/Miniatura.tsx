import React from 'react';
import {Img} from 'remotion';
import {cena, COR, FONTE, FOLHA_CENA3} from './base';

/* ----------------------------------------------------------------------------
   A miniatura do YouTube, 1280×720.

   Nasce da própria cena 3 do vídeo — ele de pé com a folha em branco virada para
   a câmera — e desenha nela as três colunas, do mesmo jeito que o vídeo desenha.
   Quem clica encontra exatamente o que viu: a folha da miniatura é a folha do
   vídeo, não uma arte à parte.

   Duas regras da marca mandam aqui, e as duas doem se ignoradas:
   - **Nada de texto sobre o rosto.** Daí o texto morar na faixa vazia à esquerda,
     que a ilustração já deixou livre.
   - **Coral não é cor de texto sobre areia** (2,7:1). Quem assina em texto é o
     Coral Profundo `#C2301F`, o par aprovado.

   Na folha não entra palavra nenhuma: com 219 px de largura, "ESSENCIAL" sairia
   com 8 px e ninguém leria no celular. A folha mostra que são três partes; quem
   diz o nome delas é o vídeo.
---------------------------------------------------------------------------- */

export const MINI_LARGURA = 1280;
export const MINI_ALTURA = 720;

const CORAL_TEXTO = '#C2301F';

/** Enquadramento: aproxima e empurra o conjunto para a direita, para abrir a faixa de texto. */
const ZOOM = 1.18;
const DESLOCA_X = 9; // % da largura, para a direita
const DESLOCA_Y = 1; // % da altura; positivo desce, para o cabelo não encostar no topo

/**
 * As duas variantes dizem só o que é **falado nos primeiros 15 segundos**, medido no
 * `palavras.json`: "uma folha" aos 9,89 s, "três colunas" aos 11,15 s, "15 minutos" aos
 * 14,49 s. A cena desta miniatura (a 3) está no ar de 6,39 s a 15,47 s, e a palavra-chave
 * que o próprio vídeo escreve na tela nesse trecho é TRÊS COLUNAS. Ou seja: imagem, voz,
 * texto na tela e legenda dizem a mesma coisa no mesmo instante.
 *
 * Foi por isso que caiu o "o mês inteiro" da primeira versão: ele só é dito em 1:05.
 */
type Variante = 'duas-batidas' | 'tres-batidas';

const Folhinha: React.FC = () => {
  const x = FOLHA_CENA3.x0 * MINI_LARGURA;
  const y = FOLHA_CENA3.y0 * MINI_ALTURA;
  const w = (FOLHA_CENA3.x1 - FOLHA_CENA3.x0) * MINI_LARGURA;
  const h = (FOLHA_CENA3.y1 - FOLHA_CENA3.y0) * MINI_ALTURA;

  const pad = w * 0.07;
  const colunas = [COR.tinta, COR.terracota, COR.oliva];
  const largCol = (w - pad * 2) / 3;
  // Quanto de cada coluna está escrito. É a proporção do exemplo do vídeo —
  // essencial cheio, desejo com teto, futuro pequeno mas presente.
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
      {colunas.map((cor, i) => {
        const cx = pad + largCol * i;
        const alturaUtil = h - pad * 2 - h * 0.1;
        const linhas = Math.round(preenchida[i] * 7);
        return (
          <React.Fragment key={i}>
            {/* A faixa que nomeia a coluna pela cor, já que o nome não cabe. */}
            <div
              style={{
                position: 'absolute',
                left: cx + largCol * 0.08,
                top: pad,
                width: largCol * 0.84,
                height: h * 0.055,
                background: cor,
                borderRadius: 3,
              }}
            />
            {/* As linhas escritas, como traços: o desenho de uma folha preenchida. */}
            {Array.from({length: linhas}).map((_, k) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: cx + largCol * 0.08,
                  top: pad + h * 0.055 + h * 0.045 + k * (alturaUtil / 8),
                  width: largCol * (k % 3 === 2 ? 0.55 : 0.78),
                  height: Math.max(3, h * 0.012),
                  background: cor,
                  opacity: 0.42,
                  borderRadius: 2,
                }}
              />
            ))}
            {/* As divisórias entre as colunas. */}
            {i > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: cx - largCol * 0.02,
                  top: pad,
                  width: 2,
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

const Titulo: React.FC<{linhas: {t: string; cor?: string}[]; tamanho: number}> = ({
  linhas,
  tamanho,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 48,
      top: 0,
      height: MINI_ALTURA,
      width: 580,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: tamanho * 0.1,
    }}
  >
    {linhas.map((l) => (
      <div
        key={l.t}
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: tamanho,
          lineHeight: 1.02,
          letterSpacing: -1,
          // Cada batida é uma linha: deixar o navegador quebrar "15 minutos." no meio
          // destrói o ritmo de três tempos, que é o que faz a frase ser lida de relance.
          whiteSpace: 'nowrap',
          color: l.cor ?? COR.tinta,
        }}
      >
        {l.t}
      </div>
    ))}
  </div>
);

export const Miniatura: React.FC<{variante?: Variante}> = ({variante = 'duas-batidas'}) => {
  const linhas =
    variante === 'duas-batidas'
      ? [{t: '3 colunas.'}, {t: '15 minutos.', cor: CORAL_TEXTO}]
      : // Na ordem exata em que ele fala: 9,89 s · 11,15 s · 14,49 s.
        [{t: 'uma folha.'}, {t: '3 colunas.'}, {t: '15 minutos.', cor: CORAL_TEXTO}];

  return (
    <div
      style={{
        width: MINI_LARGURA,
        height: MINI_ALTURA,
        overflow: 'hidden',
        position: 'relative',
        background: COR.papel,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${ZOOM}) translate(${DESLOCA_X}%, ${DESLOCA_Y}%)`,
        }}
      >
        <Img src={cena(3)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <Folhinha />
      </div>

      <Titulo linhas={linhas} tamanho={variante === 'duas-batidas' ? 90 : 68} />
    </div>
  );
};
