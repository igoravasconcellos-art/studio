import React from 'react';
import {Easing, interpolate} from 'remotion';
import {COR, FONTE} from './base';
import {VALORES} from './dados3';

/* ----------------------------------------------------------------------------
   A folha do exemplo: a mesma folha do bloco 2, agora com valores.

   Cada número entra no instante exato em que é dito — nada aparece antes. É por
   isso que esta tela pode mostrar dinheiro sem risco: o espectador ouve e vê a
   mesma coisa ao mesmo tempo, e a soma fecha na frente dele.

   Os números são os do roteiro, com a correção do transporte (410, não 420):
   1.100 + 800 + 230 + 210 + 410 + 350 = 3.100, e 4.500 − 400 − 3.100 = 1.000.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

const FOLHA = {x: 260, y: 150, w: 1400, h: 760};
const PAD = 48;
const TOPO = 160;
const LARG_COL = (FOLHA.w - PAD * 2) / 3;

const Sobe: React.FC<{
  tempo: number;
  gatilho: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({tempo, gatilho, dur = 0.4, style, children}) => {
  const p = corre(tempo, gatilho, gatilho + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.14em'}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%)`, ...style}}>{children}</div>
    </div>
  );
};

/** Uma linha da coluna: o nome à esquerda, o valor à direita. */
const Linha: React.FC<{tempo: number; gatilho: number; nome: string; valor: string; forte?: boolean}> = ({
  tempo,
  gatilho,
  nome,
  valor,
  forte,
}) => (
  <Sobe
    tempo={tempo}
    gatilho={gatilho}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 18,
      fontFamily: FONTE,
      fontWeight: forte ? 700 : 600,
      fontSize: forte ? 34 : 30,
      lineHeight: 1.5,
      color: COR.tinta,
    }}
  >
    <span>{nome}</span>
    <span>{valor}</span>
  </Sobe>
);

const ESSENCIAL = [
  ['Aluguel', '1.100', 'aluguel'],
  ['Mercado', '800', 'mercado'],
  ['Luz e água', '230', 'luz'],
  ['Internet e celular', '210', 'internet'],
  ['Transporte', '410', 'transporte'],
  ['Escola', '350', 'escola'],
] as const;

export const FolhaValores: React.FC<{tempo: number}> = ({tempo}) => {
  const regua = (de: number) => corre(tempo, de, de + 0.6, suave);
  const col = (i: number) => PAD + LARG_COL * i;

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
      <div style={{position: 'absolute', left: PAD, top: 34, right: PAD}}>
        <Sobe
          tempo={tempo}
          gatilho={VALORES.total - 0.5}
          style={{fontFamily: FONTE, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: COR.tinta, opacity: 0.6}}
        >
          O QUE ENTRA POR MÊS
        </Sobe>
        <Sobe
          tempo={tempo}
          gatilho={VALORES.total}
          style={{fontFamily: FONTE, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: COR.tinta}}
        >
          R$ 4.500
        </Sobe>
      </div>

      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: TOPO,
          width: (FOLHA.w - PAD * 2) * regua(VALORES.total + 0.4),
          height: 3,
          background: COR.tinta,
          opacity: 0.25,
        }}
      />

      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: col(i),
            top: TOPO + 16,
            width: 3,
            height: FOLHA.h - TOPO - PAD - 16,
            background: COR.tinta,
            opacity: 0.22,
          }}
        />
      ))}

      {/* ESSENCIAL — seis linhas e a soma. */}
      <div style={{position: 'absolute', left: col(0) + 8, top: TOPO + 26, width: LARG_COL - 40}}>
        <Sobe
          tempo={tempo}
          gatilho={VALORES.aluguel - 1.2}
          style={{fontFamily: FONTE, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: COR.tinta}}
        >
          ESSENCIAL
        </Sobe>
        <div style={{marginTop: 18}}>
          {ESSENCIAL.map(([nome, valor, chave]) => (
            <Linha key={nome} tempo={tempo} gatilho={VALORES[chave]} nome={nome} valor={valor} />
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            width: (LARG_COL - 40) * regua(VALORES.soma - 0.3),
            height: 2,
            background: COR.tinta,
            opacity: 0.3,
          }}
        />
        <div style={{marginTop: 10}}>
          <Linha tempo={tempo} gatilho={VALORES.soma} nome="Soma" valor="3.100" forte />
        </div>
      </div>

      {/* DESEJO — o que sobrou, e o teto. */}
      <div style={{position: 'absolute', left: col(1) + 30, top: TOPO + 26, width: LARG_COL - 60}}>
        <Sobe
          tempo={tempo}
          gatilho={VALORES.desejo - 1.0}
          style={{fontFamily: FONTE, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: COR.terracota}}
        >
          DESEJO
        </Sobe>
        <div style={{marginTop: 18}}>
          <Linha tempo={tempo} gatilho={VALORES.desejo} nome="Sobrou" valor="1.000" forte />
        </div>
        <div style={{marginTop: 16}}>
          <Sobe
            tempo={tempo}
            gatilho={VALORES.teto}
            style={{fontFamily: FONTE, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: COR.terracota, opacity: 0.85}}
          >
            TETO DO MÊS
          </Sobe>
        </div>
        <div
          style={{
            marginTop: 10,
            width: (LARG_COL - 60) * regua(VALORES.teto + 0.2),
            height: 5,
            background: COR.terracota,
            borderRadius: 3,
          }}
        />
      </div>

      {/* FUTURO — entra primeiro, e é o único que já estava separado. */}
      <div style={{position: 'absolute', left: col(2) + 30, top: TOPO + 26, width: LARG_COL - 60}}>
        <Sobe
          tempo={tempo}
          gatilho={VALORES.futuro - 1.0}
          style={{fontFamily: FONTE, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: COR.oliva}}
        >
          FUTURO
        </Sobe>
        <div style={{marginTop: 18}}>
          <Linha tempo={tempo} gatilho={VALORES.futuro} nome="Separado" valor="400" forte />
        </div>
        <div style={{marginTop: 16, opacity: corre(tempo, VALORES.futuro + 0.9, VALORES.futuro + 1.5)}}>
          <div
            style={{
              fontFamily: FONTE,
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 3,
              color: COR.oliva,
              opacity: 0.85,
            }}
          >
            JÁ, ANTES DE TUDO
          </div>
        </div>
      </div>
    </div>
  );
};
