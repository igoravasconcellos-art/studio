import React from 'react';
import {Easing, interpolate} from 'remotion';
import {COR, FONTE, LARGURA} from './base';
import {ITENS, MARCOS} from './dados2';

/* ----------------------------------------------------------------------------
   A folha das três colunas, desenhada inteira em código.

   É o coração do vídeo e não custa um crédito: as divisórias se desenham, os
   títulos sobem, cada item se escreve no instante em que é dito, e no fim os
   valores entram na ordem certa — e depois na ordem errada, para mostrar o
   desejo comendo tudo.

   Ela é cumulativa e só depende do tempo: quando a montagem corta para uma cena
   ilustrada e volta, a folha continua de onde estava, sem remontar nada.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

// Geometria da folha na tela, em pixels de 1920×1080.
const FOLHA = {x: 280, y: 110, w: 1360, h: 870};
const PAD = 46;
const TOPO = 150; // altura da faixa do total, dentro da folha
const LARG_COL = (FOLHA.w - PAD * 2) / 3;

const COLUNAS = [
  {id: 'essencial', titulo: 'ESSENCIAL', cor: COR.tinta, acende: 'acendeEssencial'},
  {id: 'desejo', titulo: 'DESEJO', cor: COR.terracota, acende: 'acendeDesejo'},
  {id: 'futuro', titulo: 'FUTURO', cor: COR.oliva, acende: 'acendeFuturo'},
] as const;

/** Uma linha que sobe atravessando a máscara, como no resto do vídeo. */
const Sobe: React.FC<{
  tempo: number;
  gatilho: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({tempo, gatilho, dur = 0.45, style, children}) => {
  const p = corre(tempo, gatilho, gatilho + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.14em'}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%)`, ...style}}>{children}</div>
    </div>
  );
};

/**
 * A coluna que está acesa é a última que foi anunciada. As outras recuam, em vez
 * de sumir: a folha inteira tem de continuar visível, senão perde-se a ideia de
 * que são três partes do mesmo dinheiro.
 */
const acesa = (tempo: number) => {
  // A partir da regra de ouro nenhuma coluna manda sozinha: a regra é sobre as três,
  // e deixar o FUTURO aceso enquanto a fala diz que ele nunca aparece seria contradizer
  // o próprio argumento na tela.
  if (tempo >= MARCOS.ouro) return -1;
  let qual = -1;
  COLUNAS.forEach((c, i) => {
    if (tempo >= MARCOS[c.acende]) qual = i;
  });
  return qual;
};

export const Folha: React.FC<{tempo: number}> = ({tempo}) => {
  const riscos = (i: number) =>
    corre(tempo, MARCOS.riscos + i * 0.3, MARCOS.riscos + 0.85 + i * 0.3, suave);
  const qualAcesa = acesa(tempo);

  // A regra de ouro: as barras entram na ordem certa — futuro, essencial, desejo.
  const encheFuturo = corre(tempo, MARCOS.quantia, MARCOS.quantia + 0.8, suave);
  const encheEssencial = corre(tempo, MARCOS.depoisEssencial, MARCOS.depoisEssencial + 1.0, suave);
  const encheDesejo = corre(tempo, MARCOS.sobra, MARCOS.sobra + 0.8, suave);
  // E depois ao contrário: o desejo engole tudo e o futuro fica vazio.
  const inverte = corre(tempo, MARCOS.inverte + 0.6, MARCOS.inverte + 2.0, suave);

  const barra = (i: number) => {
    const alvo = [0.62, 0.2, 0.09][i]; // essencial, desejo, futuro — proporção, sem número
    const normal = [encheEssencial, encheDesejo, encheFuturo][i] * alvo;
    const invertido = [0.08, 0.92, 0.0][i];
    return normal + (invertido - normal) * inverte;
  };

  // Os dois tetos da coluna desejo: o que ele escolhe e o que o cartão impõe.
  const tetoDele = corre(tempo, MARCOS.tetoDele, MARCOS.tetoDele + 0.6, suave);
  const tetoCartao = corre(tempo, MARCOS.tetoDoCartao, MARCOS.tetoDoCartao + 0.6, suave);

  const alturaUtil = FOLHA.h - TOPO - PAD;

  return (
    <div
      style={{
        position: 'absolute',
        left: FOLHA.x,
        top: FOLHA.y,
        width: FOLHA.w,
        height: FOLHA.h,
        background: '#FAF4EA',
        borderRadius: 8,
        boxShadow: '0 18px 60px rgba(62,46,38,0.18)',
      }}
    >
      {/* O total do que entra, escrito no topo da folha. */}
      <div style={{position: 'absolute', left: PAD, top: 30, right: PAD}}>
        <Sobe
          tempo={tempo}
          gatilho={MARCOS.topo}
          style={{fontFamily: FONTE, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: COR.tinta, opacity: 0.6}}
        >
          O QUE ENTRA POR MÊS
        </Sobe>
        <Sobe
          tempo={tempo}
          gatilho={MARCOS.topo + 0.3}
          style={{fontFamily: FONTE, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: COR.tinta}}
        >
          R$ 4.500
        </Sobe>
      </div>

      {/* A linha que separa o topo das colunas. */}
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: TOPO,
          width: (FOLHA.w - PAD * 2) * corre(tempo, MARCOS.topo + 0.5, MARCOS.topo + 1.2, suave),
          height: 3,
          background: COR.tinta,
          opacity: 0.25,
        }}
      />

      {/* As duas divisórias, desenhando-se de cima para baixo. */}
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: PAD + LARG_COL * i,
            top: TOPO + 16,
            width: 3,
            height: (FOLHA.h - TOPO - PAD - 16) * riscos(i - 1),
            background: COR.tinta,
            opacity: 0.3,
          }}
        />
      ))}

      {/* A regra de ouro: barras subindo do pé da folha, sem número nenhum —
          a narração aqui não diz valor, e nada aparece antes de ser dito. */}
      {[0, 1, 2].map((i) => {
        const col = [0, 1, 2][i];
        const cor = [COR.tinta, COR.terracota, COR.oliva][i];
        const h = alturaUtil * barra(i);
        if (h < 1) return null;
        return (
          <div
            key={`barra${i}`}
            style={{
              position: 'absolute',
              left: PAD + LARG_COL * col + 18,
              bottom: PAD,
              width: LARG_COL - 36,
              height: h,
              background: cor,
              opacity: 0.16,
              borderRadius: 6,
            }}
          />
        );
      })}

      {COLUNAS.map((c, i) => {
        const estaAcesa = qualAcesa === i;
        const jaApareceu = tempo >= MARCOS.titulos;
        const opacidade = !jaApareceu ? 0 : qualAcesa < 0 ? 1 : estaAcesa ? 1 : 0.32;
        const x = PAD + LARG_COL * i;
        return (
          <div key={c.id} style={{position: 'absolute', left: x, top: TOPO + 28, width: LARG_COL}}>
            <div style={{display: 'flex', justifyContent: 'center', opacity: opacidade}}>
              <Sobe
                tempo={tempo}
                gatilho={MARCOS.titulos + i * 0.3}
                style={{fontFamily: FONTE, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: c.cor}}
              >
                {c.titulo}
              </Sobe>
            </div>

            {/* Os itens, cada um no instante em que é dito. */}
            <div
              style={{
                marginTop: 26,
                paddingLeft: 34,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                opacity: opacidade,
              }}
            >
              {(ITENS[c.id] ?? []).map((it) => (
                <Sobe
                  key={it.t}
                  tempo={tempo}
                  gatilho={it.s}
                  dur={0.38}
                  style={{fontFamily: FONTE, fontWeight: 600, fontSize: 32, lineHeight: 1.38, color: COR.tinta}}
                >
                  {it.t}
                </Sobe>
              ))}
            </div>
          </div>
        );
      })}

      {/* Os dois tetos da coluna desejo. O dele é firme; o do cartão desce de fora. */}
      {tetoDele > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD + LARG_COL + 10,
            bottom: PAD + alturaUtil * 0.3,
            width: (LARG_COL - 20) * tetoDele,
            height: 5,
            background: COR.terracota,
            borderRadius: 3,
          }}
        />
      ) : null}
      {tetoCartao > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: PAD + LARG_COL + 10,
            bottom: PAD + alturaUtil * 0.62,
            width: (LARG_COL - 20) * tetoCartao,
            height: 5,
            background: COR.tinta,
            opacity: 0.35,
            borderRadius: 3,
          }}
        />
      ) : null}
    </div>
  );
};

/** Os meses de renda irregular: seis barras, e a mais baixa é a que manda. */
export const Meses: React.FC<{tempo: number; inicio: number}> = ({tempo, inicio}) => {
  const alturas = [0.68, 0.92, 0.46, 0.8, 1.0, 0.6];
  const maisBaixa = alturas.indexOf(Math.min(...alturas));
  const marca = corre(tempo, inicio + 3.2, inicio + 4.0, suave);
  const L = 1100;
  const H = 360;
  return (
    <div
      style={{
        position: 'absolute',
        left: (LARGURA - L) / 2,
        top: 360,
        width: L,
        height: H,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 40,
      }}
    >
      {alturas.map((a, i) => {
        const sobe = corre(tempo, inicio + 0.3 + i * 0.18, inicio + 1.0 + i * 0.18, suave);
        const ehBaixa = i === maisBaixa;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: H * a * sobe,
              background: ehBaixa ? COR.oliva : COR.tinta,
              opacity: ehBaixa ? 0.25 + marca * 0.75 : 0.22 - marca * 0.1,
              borderRadius: 8,
            }}
          />
        );
      })}
    </div>
  );
};
