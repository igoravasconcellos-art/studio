import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ALTURA, COR, FONTE, LARGURA} from './base';
import {EXTRATO, MARCOS4} from './dados4';

/* ----------------------------------------------------------------------------
   As peças desenhadas do bloco 4.

   O extrato não tem valor nenhum escrito: neste trecho a narração não diz um
   número sequer, e nada aparece antes de ser dito. O lugar do valor é uma barra
   cinza. O que importa aqui é a letra, não a quantia.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

const COR_LETRA: Record<string, string> = {E: COR.tinta, D: COR.terracota, F: COR.oliva};

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

/** O extrato do mês passado, ganhando uma letra por linha. */
export const Extrato: React.FC<{tempo: number}> = ({tempo}) => {
  const L = 1180;
  const entra = corre(tempo, MARCOS4.abra, MARCOS4.abra + 0.7, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: (LARGURA - L) / 2,
        top: 120,
        width: L,
        padding: '40px 48px 44px',
        background: '#FAF4EA',
        borderRadius: 8,
        boxShadow: '0 18px 60px rgba(62,46,38,0.18)',
        transform: `translateY(${(1 - entra) * 26}px)`,
        opacity: entra,
      }}
    >
      <Sobe
        tempo={tempo}
        gatilho={MARCOS4.abra}
        style={{
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 4,
          color: COR.tinta,
          opacity: 0.55,
        }}
      >
        O MÊS PASSADO, LINHA POR LINHA
      </Sobe>
      <div style={{marginTop: 24}}>
        {EXTRATO.map((linha, i) => {
          const apareceu = corre(
            tempo,
            MARCOS4.abra + 0.5 + i * 0.12,
            MARCOS4.abra + 1.0 + i * 0.12,
            suave,
          );
          const marcou = corre(tempo, linha.s, linha.s + 0.35, suave);
          return (
            <div
              key={linha.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '12px 0',
                borderBottom: '1px solid rgba(62,46,38,0.1)',
                opacity: apareceu,
              }}
            >
              {/* A letra é o ponto de toda esta cena. */}
              <div style={{width: 58, display: 'flex', justifyContent: 'center'}}>
                <div
                  style={{
                    fontFamily: FONTE,
                    fontWeight: 700,
                    fontSize: 38,
                    color: COR_LETRA[linha.l],
                    opacity: marcou,
                    transform: `scale(${0.7 + marcou * 0.3})`,
                  }}
                >
                  {linha.l}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: FONTE,
                  fontWeight: 600,
                  fontSize: 32,
                  color: COR.tinta,
                  opacity: 0.35 + marcou * 0.65,
                }}
              >
                {linha.t}
              </div>
              {/* O lugar do valor: uma barra, porque número nenhum é dito aqui. */}
              <div style={{width: 150, height: 14, borderRadius: 7, background: COR.tinta, opacity: 0.12}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** A dica da fatura: a compra cai num mês, a conta vence no outro. */
export const Calendario: React.FC<{tempo: number}> = ({tempo}) => {
  const compra = corre(tempo, MARCOS4.dica + 1.4, MARCOS4.dica + 2.0, suave);
  const vence = corre(tempo, MARCOS4.senao, MARCOS4.senao + 0.7, suave);
  const seta = corre(tempo, MARCOS4.senao + 0.4, MARCOS4.senao + 1.3, suave);

  const mes = (rotulo: string, aceso: number, cor: string, diaMarcado: number) => (
    <div style={{width: 470, opacity: 0.45 + aceso * 0.55}}>
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 3,
          color: COR.tinta,
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        {rotulo}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center'}}>
        {/* 28 casas: quatro linhas de sete, para o mês fechar certinho em vez de sobrar duas. */}
        {Array.from({length: 28}).map((_, i) => {
          const marcado = i === diaMarcado;
          return (
            <div
              key={i}
              style={{
                width: 56,
                height: 42,
                borderRadius: 6,
                background: marcado ? cor : COR.tinta,
                opacity: marcado ? aceso : 0.1,
              }}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 330,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 80,
      }}
    >
      {mes('MÊS DA COMPRA', compra, COR.terracota, 11)}
      <div
        style={{
          marginTop: 130,
          width: 90 * seta,
          height: 5,
          borderRadius: 3,
          background: COR.tinta,
          opacity: 0.4,
        }}
      />
      {mes('MÊS DA FATURA', vence, COR.tinta, 7)}
    </div>
  );
};

/** As três fontes de onde o dinheiro sai. */
export const Fontes: React.FC<{tempo: number}> = ({tempo}) => {
  const nomes = ['DINHEIRO VIVO', 'PIX', 'CARTÃO'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: ALTURA * 0.36,
        display: 'flex',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      {nomes.map((n, i) => {
        const p = corre(tempo, MARCOS4.fontes + 0.8 + i * 0.5, MARCOS4.fontes + 1.4 + i * 0.5, suave);
        return (
          <div
            key={n}
            style={{
              width: 400,
              height: 230,
              borderRadius: 12,
              background: '#FAF4EA',
              boxShadow: '0 12px 40px rgba(62,46,38,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTE,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 3,
              color: COR.tinta,
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px)`,
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

/** A folha da Camila e do Rafael: o desejo maior que o essencial, e a virada. */
export const FolhaCamila: React.FC<{tempo: number}> = ({tempo}) => {
  const surge = corre(tempo, MARCOS4.coluna, MARCOS4.coluna + 0.9, suave);
  const miudos = corre(tempo, MARCOS4.miudos + 0.3, MARCOS4.miudos + 2.4, suave);
  const teto = corre(tempo, MARCOS4.teto + 0.4, MARCOS4.teto + 1.2, suave);
  const futuro = corre(tempo, MARCOS4.futuroAbre + 0.3, MARCOS4.futuroAbre + 1.2, suave);

  // Antes: o desejo maior que o essencial. Depois do teto: o desejo encolhe e o futuro abre.
  const H = 470;
  const hEssencial = 0.52 * surge;
  const hDesejo = (0.74 - 0.32 * teto) * surge;
  const hFuturo = 0.24 * futuro;
  const colunas = [
    {t: 'ESSENCIAL', cor: COR.tinta, h: hEssencial},
    {t: 'DESEJO', cor: COR.terracota, h: hDesejo},
    {t: 'FUTURO', cor: COR.oliva, h: hFuturo},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 70,
        height: H + 80,
      }}
    >
      {colunas.map((c, i) => (
        <div
          key={c.t}
          style={{
            width: 330,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* O teto que a Camila e o Rafael escolheram, pousado no alto do desejo. */}
          {i === 1 && teto > 0 ? (
            <div
              style={{
                position: 'absolute',
                bottom: 62 + H * hDesejo,
                width: 330 * teto,
                height: 5,
                background: COR.terracota,
                borderRadius: 3,
              }}
            />
          ) : null}
          <div
            style={{
              width: '100%',
              height: H * c.h,
              background: c.cor,
              opacity: 0.22,
              borderRadius: 10,
              // os muitos pedidos pequenos que incharam a coluna do desejo
              boxShadow: i === 1 ? `inset 0 ${-20 * miudos}px 0 rgba(184,106,75,0.3)` : undefined,
            }}
          />
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTE,
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: 2,
              color: c.cor,
              opacity: 0.4 + surge * 0.6,
            }}
          >
            {c.t}
          </div>
        </div>
      ))}
    </div>
  );
};
