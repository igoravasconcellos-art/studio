import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {arq, cena as arquivoDaCena, COR, FONTE, FONTE_MAO} from './base';
import {Folha} from './Folha';
import {CENAS_R, DURACAO_REELS, FIM_DA_FALA, FOLHAS_R, LEGENDAS_R} from './dadosReels';

/* ----------------------------------------------------------------------------
   O Reels do 012 — 1080×1920, 56,9 s.

   É um recorte do vídeo longo, não uma peça nova: gancho, os nomes das três
   colunas e a regra de ouro. O exemplo com os números fica de fora de propósito
   — é a recompensa de ir para o YouTube, e o laço só é honesto porque o que o
   Reels promete, o Reels cumpre.

   O que muda do horizontal para o vertical:
   - A ilustração é 16:9 e não vira retrato. Ela entra num cartão de largura
     inteira, e o resto da tela é do texto. Esticar ou cortar o quadro ao meio
     arrancaria o rosto, que é justamente o que a regra 4 proíbe.
   - **Legenda sempre ligada.** Reels se assiste no mudo; sem legenda, 56 segundos
     de narração não existem.
   - A folha das três colunas é a mesma `Folha` do vídeo longo, recebendo o tempo
     do bloco 2 que lhe corresponde. Assim ela se desenha aqui exatamente como lá,
     sem nenhuma animação duplicada.
---------------------------------------------------------------------------- */

const saida = Easing.out(Easing.cubic);
const suave = Easing.inOut(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const REELS_LARGURA = 1080;
export const REELS_ALTURA = 1920;

/**
 * A faixa do meio da tela, onde a imagem cabe sem disputar com a interface do
 * app: o Instagram come o topo com o nome e o rodapé com legenda e botões.
 * A legenda do vídeo fica num Y fixo — se ela pulasse de altura a cada corte,
 * o olho teria de procurá-la de novo toda vez.
 */
const PALCO = {y: 260, h: 750};
const LEGENDA_Y = 1080;

const Cartao: React.FC<{altura: number; children: React.ReactNode}> = ({altura, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: PALCO.y + (PALCO.h - altura) / 2,
      width: REELS_LARGURA,
      height: altura,
      overflow: 'hidden',
      background: COR.papel,
    }}
  >
    {children}
  </div>
);

const ALTURA_IMG = Math.round((REELS_LARGURA * 9) / 16);

/**
 * A folha do vídeo longo, ocupando a **largura inteira** do Reels.
 *
 * Encolher o quadro de 1920 para 1080 deixava a folha com 765 px e os itens dela
 * com 18 px na tela: ilegíveis num celular, que é onde isto vai ser visto. O que
 * interessa aqui é a folha, não a moldura em volta dela — então a escala é a da
 * folha (1360 px de largura), e o resto do quadro fica de fora.
 */
const ESCALA_FOLHA = REELS_LARGURA / 1360;
const ALTURA_FOLHA = Math.round(870 * ESCALA_FOLHA);

const FolhaNoCartao: React.FC<{tempo: number}> = ({tempo}) => (
  <div
    style={{
      position: 'absolute',
      left: -280 * ESCALA_FOLHA,
      top: -110 * ESCALA_FOLHA,
      width: 1920,
      height: 1080,
      transform: `scale(${ESCALA_FOLHA})`,
      transformOrigin: 'top left',
    }}
  >
    <Folha tempo={tempo} />
  </div>
);

export const Reels: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const folha = FOLHAS_R.find((f) => t >= f.s && t < f.e);
  const cena = !folha ? [...CENAS_R].reverse().find((c) => t >= c.s) : undefined;
  const legenda = LEGENDAS_R.find((l) => t >= l.s && t < l.e);

  // A cartela final entra quando a fala termina.
  const cartela = corre(t, FIM_DA_FALA, FIM_DA_FALA + 0.5, suave);

  // A câmera nunca para, como no vídeo longo: um empurrão lento no cartão.
  const empurra = 1 + (t % 9) * 0.004;

  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Audio src={arq('audio/reels.wav')} />

      {cena ? (
        <Cartao altura={ALTURA_IMG}>
          <Img
            src={arquivoDaCena(cena.n)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${empurra})`,
            }}
          />
        </Cartao>
      ) : null}

      {folha ? (
        <Cartao altura={ALTURA_FOLHA}>
          <FolhaNoCartao tempo={folha.fonte + (t - folha.s)} />
        </Cartao>
      ) : null}

      {/* A palavra-chave da cena, no jeito manuscrito do vídeo longo. */}
      {cena?.kw ? (
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: PALCO.y - 150,
            fontFamily: FONTE_MAO,
            fontSize: 96,
            color: COR.tinta,
            opacity: corre(t, cena.s, cena.s + 0.5),
          }}
        >
          {cena.kw}
        </div>
      ) : null}

      {/* A legenda. Abaixo do cartão, longe do rosto, sempre no mesmo lugar. */}
      {legenda ? (
        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: LEGENDA_Y,
            fontFamily: FONTE,
            fontWeight: 700,
            fontSize: 62,
            lineHeight: 1.26,
            letterSpacing: -1,
            color: COR.tinta,
            textAlign: 'center',
          }}
        >
          {legenda.t}
        </div>
      ) : null}

      {/* A cartela: o que o Reels não mostrou, e onde está. */}
      {cartela > 0 ? (
        <AbsoluteFill
          style={{
            background: COR.papel,
            opacity: cartela,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 40,
            padding: '0 90px',
            textAlign: 'center',
          }}
        >
          <div style={{fontFamily: FONTE, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: COR.tinta, opacity: 0.6}}>
            FALTOU A CONTA FEITA
          </div>
          <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 96, lineHeight: 1.08, letterSpacing: -2, color: COR.tinta}}>
            o exemplo completo,
            <br />
            com os números
          </div>
          <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: '#C2301F'}}>
            está no YouTube
          </div>
          <div style={{marginTop: 30, fontFamily: FONTE, fontWeight: 600, fontSize: 48, color: COR.tinta, opacity: 0.75}}>
            @euigorvasconcellos · link na bio
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const QUADROS_REELS = (fps: number) => Math.round(DURACAO_REELS * fps);
