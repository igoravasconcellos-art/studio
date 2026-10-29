import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {enquadrarRosto} from '../../_shared/enquadramento';
import {CLIPES, COR, DURACAO, f, FONTE, NARRACAO} from './base';
import {
  ALTURA,
  ANCORA,
  CENAS,
  Cena,
  CLIPE_ALTURA,
  CLIPE_LARGURA,
  colunaDe,
  GATILHO,
  Geometria,
  MARGEM,
  TIPO,
  TRANSICAO,
  TROCA_DE_COR,
  ZONA_ROSTO,
} from './cenas';

/* ----------------------------------------------------------------------------
   Padrão Nalu — explainer 16:9 com o avatar como narrador.
   Molde: referencias/awesome-opus5-5-videos, prompt `twoclipping-000267`.

   As regras que este arquivo obedece, e que são o padrão:
   1. Uma ideia por plano. Duas coisas disputando atenção perdem as duas.
   2. Muito espaço vazio. Sem painel flutuante, sem moldura, sem card de enfeite:
      a superfície de tela cheia é o fundo, e o texto senta na grade.
   3. Uma cor de destaque só (turquesa), e ela nunca carrega texto sobre fundo claro.
   4. Nada entra de estalo: cada linha sobe atravessando uma linha de máscara.
   5. A câmera nunca para — empurrão lento em cada plano, só na camada de texto.
   6. O avatar é o elemento que atravessa o vídeo sem ser cortado: ele desliza
      entre três âncoras e é o que casa um plano com o seguinte.
   7. Todo gatilho vem do palavras.json. Nada aparece antes de ser dito.
   8. Sem ponto final em texto de tela.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

/** Progresso de 0 a 1, sem overshoot. Easing saltitante é proibido pelo molde. */
const corre = (tempo: number, de: number, ate: number, easing = saida) =>
  interpolate(tempo, [de, ate], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Uma linha que sobe atravessando a máscara. É a única forma de texto entrar aqui. */
const Sobe: React.FC<{
  tempo: number;
  gatilho: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({tempo, gatilho, dur = 0.55, style, children}) => {
  const p = corre(tempo, gatilho, gatilho + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
      <div style={{transform: `translateY(${(1 - p) * 112}%)`, ...style}}>{children}</div>
    </div>
  );
};

/** Rótulo: caixa alta, entreletra aberta, pequeno. Diz o que a tela mostra, não repete o áudio. */
const Rotulo: React.FC<{tempo: number; gatilho: number; cor: string; children: React.ReactNode}> = ({
  tempo,
  gatilho,
  cor,
  children,
}) => (
  <Sobe
    tempo={tempo}
    gatilho={gatilho}
    dur={0.4}
    style={{
      fontFamily: FONTE,
      fontSize: TIPO.rotulo,
      letterSpacing: 6,
      lineHeight: 1.3,
      color: cor,
      opacity: 0.75,
    }}
  >
    {children}
  </Sobe>
);

/**
 * As duas superfícies. Uma cor de destaque só — e ela nunca carrega texto sobre fundo claro,
 * onde o turquesa não tem contraste: ali o destaque é a tinta cheia com uma régua turquesa embaixo.
 */
const PALETA = {
  navy: {fundo: COR.navyProfundo, tinta: COR.branco, destaque: COR.turquesa, regua: COR.turquesa},
  claro: {fundo: '#F2F6F8', tinta: COR.navyProfundo, destaque: COR.navyProfundo, regua: COR.turquesa},
} as const;

/** A palavra que carrega o plano. Sobre claro ela ganha a régua; sobre navy, a cor. */
const Destaque: React.FC<{
  tempo: number;
  gatilho: number;
  cena: Cena;
  tamanho: number;
  children: React.ReactNode;
}> = ({tempo, gatilho, cena, tamanho, children}) => {
  const c = PALETA[cena.fundo];
  return (
    <Sobe
      tempo={tempo}
      gatilho={gatilho}
      style={{
        fontFamily: FONTE,
        fontSize: tamanho,
        lineHeight: 1.1,
        letterSpacing: -2,
        color: c.destaque,
      }}
    >
      <span
        style={
          cena.fundo === 'claro'
            ? {borderBottom: `10px solid ${c.regua}`, paddingBottom: 4, display: 'inline-block'}
            : undefined
        }
      >
        {children}
      </span>
    </Sobe>
  );
};

const entre = (a: Geometria, b: Geometria, p: number): Geometria => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});

/** A cena ativa, a anterior e o fim dela. */
const estado = (tempo: number) => {
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (tempo >= CENAS[k].s) i = k;
  const atual = CENAS[i];
  const anterior = CENAS[Math.max(0, i - 1)];
  const fim = i + 1 < CENAS.length ? CENAS[i + 1].s : DURACAO;
  return {atual, anterior, i, fim};
};

const misturar = (a: string, b: string, p: number) => {
  const n = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = n(a);
  const [r2, g2, b2] = n(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * p);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
};

/* ----------------------------------------------------------------------------
   As oito batidas. Uma ideia cada, e nada mais na tela.
---------------------------------------------------------------------------- */

type Plano = {tempo: number; coluna: number; cena: Cena};

/** 1. O gancho: a frase mais forte, três linhas, a última na cor de destaque. */
const Gancho: React.FC<Plano> = ({tempo, cena}) => {
  const c = PALETA[cena.fundo];
  return (
    <>
      <Rotulo tempo={tempo} gatilho={0} cor={c.tinta}>
        RESERVA DE EMERGÊNCIA
      </Rotulo>
      <div style={{height: 36}} />
      {GATILHO.gancho.map((linha, i) => (
        <Sobe
          key={linha.t}
          tempo={tempo}
          gatilho={linha.s}
          style={{
            fontFamily: FONTE,
            fontSize: i === 2 ? TIPO.titulo : TIPO.sub,
            lineHeight: 1.1,
            letterSpacing: -2,
            color: i === 2 ? c.destaque : c.tinta,
          }}
        >
          {linha.t}
        </Sobe>
      ))}
    </>
  );
};

/** 2. A consequência, como processo: a pista que se rompe e o corredor que para nela. */
const Corrida: React.FC<Plano> = ({tempo, coluna, cena}) => {
  const c = PALETA[cena.fundo];
  const L = coluna;
  const H = 380;
  const yPista = 170;
  const xBuraco = L * 0.58;
  // A fenda abre na palavra "buraco"; o corredor avança até ela e cai dentro.
  const fenda = corre(tempo, GATILHO.corridaBuraco, GATILHO.corridaBuraco + 0.45) * 150;
  const avanco = corre(tempo, GATILHO.corridaLargada + 0.4, GATILHO.corridaQueda, suave);
  const queda = corre(tempo, GATILHO.corridaQueda, GATILHO.corridaQueda + 0.6);
  const px = 54 + avanco * (xBuraco - fenda / 2 - 54);
  const traco = corre(tempo, GATILHO.corridaLargada, GATILHO.corridaLargada + 0.7, suave);
  const fimA = Math.max(0, (xBuraco - fenda / 2) * traco);
  return (
    <>
      <Rotulo tempo={tempo} gatilho={GATILHO.corridaLargada} cor={c.tinta}>
        VOCÊ SAI NA FRENTE
      </Rotulo>
      {/* A pista é a única coisa no plano: uma barra grossa que se rompe e engole o corredor. */}
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} style={{marginTop: 40}}>
        <rect x={0} y={yPista} width={fimA} height={30} rx={15} fill={c.tinta} />
        {fenda > 0 ? (
          <rect
            x={xBuraco + fenda / 2}
            y={yPista}
            width={Math.max(0, L * traco - xBuraco - fenda / 2)}
            height={30}
            rx={15}
            fill={c.tinta}
            opacity={0.18}
          />
        ) : null}
        <circle
          cx={px}
          cy={yPista - 52 + queda * 150}
          r={52}
          fill={c.regua}
          opacity={1 - queda * 0.5}
        />
      </svg>
    </>
  );
};

/** 3. A tese: duas palavras separadas por uma régua. */
const Contraste: React.FC<Plano> = ({tempo, coluna, cena}) => {
  const c = PALETA[cena.fundo];
  const regua = corre(
    tempo,
    GATILHO.contrasteInvestimento - 0.3,
    GATILHO.contrasteInvestimento + 0.3,
    suave,
  );
  return (
    <>
      <Sobe
        tempo={tempo}
        gatilho={GATILHO.contrasteReserva}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.titulo,
          lineHeight: 1.06,
          letterSpacing: -2,
          color: c.destaque,
        }}
      >
        RESERVA
      </Sobe>
      <div style={{height: 28}} />
      <div style={{width: coluna * regua, height: 4, background: c.regua, opacity: 0.6}} />
      <div style={{height: 28}} />
      <Sobe
        tempo={tempo}
        gatilho={GATILHO.contrasteInvestimento}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.titulo,
          lineHeight: 1.06,
          letterSpacing: -2,
          color: c.tinta,
          opacity: 0.35,
        }}
      >
        INVESTIMENTO
      </Sobe>
      <div style={{height: 40}} />
      <Rotulo tempo={tempo} gatilho={GATILHO.contrasteTrava} cor={c.tinta}>
        UMA SEGURA A OUTRA
      </Rotulo>
    </>
  );
};

/** 4. O respiro: uma frase, duas linhas, e o avatar na frente. */
const Respiro: React.FC<Plano> = ({tempo, cena}) => {
  const c = PALETA[cena.fundo];
  return (
    <>
      <Sobe
        tempo={tempo}
        gatilho={GATILHO.respiro}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.titulo,
          lineHeight: 1.1,
          letterSpacing: -2,
          color: c.tinta,
        }}
      >
        A CONTA
      </Sobe>
      <Destaque tempo={tempo} gatilho={GATILHO.respiro + 0.18} cena={cena} tamanho={TIPO.titulo}>
        É SIMPLES
      </Destaque>
    </>
  );
};

/** 5. A conta prometida no gancho: tipografia herói e seis réguas se enchendo. */
const Conta: React.FC<Plano> = ({tempo, coluna, cena}) => {
  const c = PALETA[cena.fundo];
  const larg = (coluna - 5 * 18) / 6;
  return (
    <>
      <Rotulo tempo={tempo} gatilho={GATILHO.contaRotulo} cor={c.tinta}>
        O GASTO DA SUA CASA POR MÊS
      </Rotulo>
      <div style={{height: 20}} />
      <Sobe
        tempo={tempo}
        gatilho={GATILHO.contaMultiplica}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.heroi,
          lineHeight: 1,
          letterSpacing: -8,
          color: c.destaque,
        }}
      >
        × 6
      </Sobe>
      <div style={{height: 44, display: 'flex', gap: 18, marginTop: 44}}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const inicio = GATILHO.contaTotal + i * 0.2;
          const p = corre(tempo, inicio, inicio + 0.3, suave);
          return (
            <div key={i} style={{width: larg, height: 44, background: `${c.tinta}1A`}}>
              <div style={{width: `${p * 100}%`, height: '100%', background: c.regua}} />
            </div>
          );
        })}
      </div>
      <div style={{height: 28}} />
      <Rotulo tempo={tempo} gatilho={GATILHO.contaTotal + 1.2} cor={c.tinta}>
        SEIS MESES DE CASA, LÍQUIDOS
      </Rotulo>
    </>
  );
};

/** 6. As três qualidades, uma por palavra dita. A terceira vira o argumento. */
const Selos: React.FC<Plano> = ({tempo, cena}) => {
  const c = PALETA[cena.fundo];
  return (
    <>
      {GATILHO.selos.map((selo, i) => {
        const virou = i === 2 ? corre(tempo, GATILHO.seloPonto, GATILHO.seloPonto + 0.4, suave) : 0;
        return (
          <div key={selo.t} style={{display: 'flex', alignItems: 'baseline', gap: 28}}>
            {i === 2 ? (
              <Destaque tempo={tempo} gatilho={selo.s} cena={cena} tamanho={TIPO.titulo}>
                {selo.t}
              </Destaque>
            ) : (
              <Sobe
                tempo={tempo}
                gatilho={selo.s}
                style={{
                  fontFamily: FONTE,
                  fontSize: TIPO.titulo,
                  lineHeight: 1.1,
                  letterSpacing: -2,
                  color: c.tinta,
                  opacity: 0.4,
                }}
              >
                {selo.t}
              </Sobe>
            )}
            {i === 2 ? (
              <div style={{overflow: 'hidden', height: Math.round(TIPO.rotulo * 1.8)}}>
                <div
                  style={{
                    transform: `translateY(${(1 - virou) * 112}%)`,
                    fontFamily: FONTE,
                    fontSize: TIPO.rotulo,
                    letterSpacing: 6,
                    lineHeight: 1.8,
                    color: c.destaque,
                  }}
                >
                  É O PONTO
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

/** 7. A ordem: dois passos numerados, com a régua se desenhando entre eles. */
const Ordem: React.FC<Plano> = ({tempo, coluna, cena}) => {
  const c = PALETA[cena.fundo];
  const seta = corre(tempo, GATILHO.ordemSeta, GATILHO.ordemSeta + 0.45, suave);
  const passo = (n: string, t: string, gatilho: number) => (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
      <Sobe
        tempo={tempo}
        gatilho={gatilho}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.rotulo,
          letterSpacing: 4,
          // 34 × 3.75 ≈ 128: a mesma altura de caixa do passo ao lado, para as duas assentarem juntas.
          lineHeight: 3.75,
          color: c.regua,
        }}
      >
        {n}
      </Sobe>
      <Sobe
        tempo={tempo}
        gatilho={gatilho}
        style={{
          fontFamily: FONTE,
          fontSize: TIPO.titulo,
          lineHeight: 1.14,
          letterSpacing: -2,
          color: c.tinta,
        }}
      >
        {t}
      </Sobe>
    </div>
  );
  return (
    <>
      {passo('01', 'O COLCHÃO', GATILHO.ordemColchao)}
      <div style={{width: 4, height: 56 * seta, background: c.regua, marginLeft: 22, opacity: 0.6}} />
      {passo('02', 'O RENDIMENTO', GATILHO.ordemRendimento)}
      <div style={{height: 36}} />
      <div style={{width: coluna * 0.55 * seta, height: 2, background: c.tinta, opacity: 0.2}} />
    </>
  );
};

/** 8. O fecho: a última palavra entra por último, na cor de destaque. */
const Fecho: React.FC<Plano> = ({tempo, cena}) => {
  const c = PALETA[cena.fundo];
  return (
    <>
      {['SUA RESERVA', 'É O SEU PRÓXIMO'].map((linha, i) => (
        <Sobe
          key={linha}
          tempo={tempo}
          gatilho={GATILHO.fechoLinha1 + i * 0.22}
          style={{
            fontFamily: FONTE,
            fontSize: TIPO.sub,
            lineHeight: 1.14,
            letterSpacing: -1,
            color: c.tinta,
          }}
        >
          {linha}
        </Sobe>
      ))}
      <div style={{height: 12}} />
      <Destaque tempo={tempo} gatilho={GATILHO.fechoCarimbo} cena={cena} tamanho={TIPO.titulo}>
        INVESTIMENTO
      </Destaque>
    </>
  );
};

const CONTEUDO: Record<Cena['id'], React.FC<Plano>> = {
  gancho: Gancho,
  corrida: Corrida,
  contraste: Contraste,
  respiro: Respiro,
  conta: Conta,
  selos: Selos,
  ordem: Ordem,
  fecho: Fecho,
};

/* ----------------------------------------------------------------------------
   O avatar: um card que desliza entre três âncoras e nunca é cortado.
---------------------------------------------------------------------------- */

const Avatar: React.FC<{card: Geometria}> = ({card}) => {
  const enq = enquadrarRosto({w: Math.round(card.w), h: Math.round(card.h)}, ZONA_ROSTO, {
    margem: 30,
    canvasWidth: CLIPE_LARGURA,
    canvasHeight: CLIPE_ALTURA,
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
        overflow: 'hidden',
        borderRadius: 24,
      }}
    >
      {CLIPES.map((clipe) => (
        <Sequence
          key={clipe.arquivo}
          from={f(clipe.inicio)}
          durationInFrames={Math.max(1, f(clipe.fim) - f(clipe.inicio))}
          layout="none"
        >
          <div
            style={{
              position: 'absolute',
              left: enq.x,
              top: enq.y,
              width: CLIPE_LARGURA * enq.scale,
              height: CLIPE_ALTURA * enq.scale,
            }}
          >
            {/* O áudio dos clipes é mudo: a narração entra uma única vez, contínua. */}
            <OffthreadVideo src={clipe.arquivo} muted style={{width: '100%', height: '100%'}} />
          </div>
        </Sequence>
      ))}
    </div>
  );
};

/* ----------------------------------------------------------------------------
   A composição.
---------------------------------------------------------------------------- */

export const Explainer: React.FC = () => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;
  const {atual, anterior, fim} = estado(tempo);

  // A superfície troca de cor em 0,35 s. Nada de corte seco nem de piscada.
  const pCor = corre(tempo, atual.s, atual.s + TROCA_DE_COR, suave);
  const fundo = misturar(PALETA[anterior.fundo].fundo, PALETA[atual.fundo].fundo, pCor);

  // O avatar desliza entre âncoras. Ele é o corte casado: o resto troca, ele continua.
  const pCard = corre(tempo, atual.s, atual.s + TRANSICAO, suave);
  const card = entre(ANCORA[anterior.ancora], ANCORA[atual.ancora], pCard);

  // A câmera nunca para: empurrão lento na camada de texto, reiniciado em cada plano.
  const empurrao = interpolate(tempo, [atual.s, fim], [1, 1.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // O conteúdo entra depois que o plano começa e sai antes do próximo: texto nunca se sobrepõe.
  const opTexto =
    corre(tempo, atual.s + 0.08, atual.s + 0.3, suave) *
    (1 - corre(tempo, fim - 0.26, fim - 0.04, suave));

  const Conteudo = CONTEUDO[atual.id];
  const coluna = colunaDe(atual.ancora);

  return (
    <AbsoluteFill style={{background: fundo}}>
      <AbsoluteFill
        style={{
          transform: `scale(${empurrao})`,
          transformOrigin: '50% 50%',
          opacity: opTexto,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: MARGEM,
            top: 0,
            width: coluna,
            height: ALTURA,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Conteudo tempo={tempo} coluna={coluna} cena={atual} />
        </div>
      </AbsoluteFill>

      <Avatar card={card} />

      <Audio src={NARRACAO} />
    </AbsoluteFill>
  );
};

export default Explainer;
