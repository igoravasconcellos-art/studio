import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  ALTURA,
  arq,
  Cena,
  CENAS,
  COR,
  f,
  FICHARIO,
  LARGURA,
  LEGENDAS,
  Linha,
  MARGEM,
  MONTSERRAT,
  NARRACAO,
  PRECO,
  SORA,
} from './base';

/** Entrada suave de 0 a 1 em `duracao` segundos a partir do início da cena. */
const useEntrada = (duracao = 0.4) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(frame, [0, duracao * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

/** Recorte de um print: mostra só `recorte` e escala para `larguraNaTela`. */
const Recorte: React.FC<{
  src: string;
  larguraPrint: number;
  recorte: {x: number; y: number; largura: number; altura: number};
  larguraNaTela: number;
}> = ({src, larguraPrint, recorte, larguraNaTela}) => {
  const k = larguraNaTela / recorte.largura;
  return (
    <div
      style={{
        width: larguraNaTela,
        height: recorte.altura * k,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 12,
      }}
    >
      <Img
        src={arq(src)}
        style={{
          position: 'absolute',
          width: larguraPrint * k,
          left: -recorte.x * k,
          top: -recorte.y * k,
          maxWidth: 'none',
        }}
      />
    </div>
  );
};

const CenaPrint: React.FC<{cena: Extract<Cena, {tipo: 'print'}>}> = ({cena}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const entrada = useEntrada();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 400}}>
      <div
        style={{
          width: 720,
          borderRadius: 28,
          overflow: 'hidden',
          background: COR.branco,
          boxShadow: '0 40px 120px rgba(0,0,0,.45)',
          opacity: entrada,
          scale: interpolate(frame, [0, durationInFrames], [cena.de, cena.ate], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          filter: cena.cinza
            ? 'saturate(' +
              interpolate(frame, [0, 1.2 * fps], [1, 0.12], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }) +
              ')'
            : undefined,
        }}
      >
        <Img src={arq(cena.img)} style={{width: '100%', display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

const CenaFichario: React.FC<{cena: Extract<Cena, {tipo: 'print'}>}> = ({cena}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const entrada = useEntrada();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 420}}>
      <div
        style={{
          opacity: entrada,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,.45)',
          scale: interpolate(frame, [0, durationInFrames], [cena.de, cena.ate], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Recorte
          src={FICHARIO.print}
          larguraPrint={FICHARIO.larguraPrint}
          recorte={FICHARIO.recorte}
          larguraNaTela={FICHARIO.larguraNaTela}
        />
      </div>
    </AbsoluteFill>
  );
};

const CenaFrase: React.FC<{cena: Extract<Cena, {tipo: 'frase'}>}> = ({cena}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{padding: MARGEM, justifyContent: 'center', gap: 44}}>
      {cena.linhas.map((linha) => {
        const inicio = (linha.s - cena.s) * fps;
        return (
          <div
            key={linha.t}
            style={{
              fontFamily: SORA,
              fontWeight: 700,
              fontSize: 92,
              lineHeight: 1.08,
              color: linha.cor ?? COR.branco,
              opacity: interpolate(frame, [inicio, inicio + 0.3 * fps], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              translate: '0px ' + interpolate(frame, [inicio, inicio + 0.45 * fps], [28, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }) + 'px',
            }}
          >
            {linha.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CenaPrecos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrada = useEntrada(0.5);
  const k = PRECO.larguraNaTela / PRECO.recorte.largura;
  // Marca-texto exatamente sobre a célula do preço, nas coordenadas medidas no print.
  const risco = interpolate(frame, [1.4 * fps, 2.1 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill style={{padding: MARGEM, paddingTop: 560, justifyContent: 'flex-start', gap: 28}}>
      <div style={{fontFamily: SORA, fontWeight: 600, fontSize: 46, letterSpacing: 2, color: COR.teal, opacity: entrada}}>
        PREÇO MÉDIO NO MARKETPLACE
      </div>
      <div
        style={{
          fontFamily: SORA,
          fontWeight: 700,
          fontSize: 168,
          lineHeight: 1,
          color: COR.branco,
          marginBottom: 28,
          opacity: interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {PRECO.valor}
      </div>
      <div style={{position: 'relative', opacity: entrada}}>
        <Recorte
          src={PRECO.print}
          larguraPrint={PRECO.larguraPrint}
          recorte={PRECO.recorte}
          larguraNaTela={PRECO.larguraNaTela}
        />
        <div
          style={{
            position: 'absolute',
            left: (PRECO.celula.x - PRECO.recorte.x) * k,
            top: (PRECO.celula.y - PRECO.recorte.y) * k,
            width: PRECO.celula.largura * k * risco,
            height: PRECO.celula.altura * k,
            background: COR.amarelo,
            mixBlendMode: 'multiply',
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{fontFamily: MONTSERRAT, fontWeight: 500, fontSize: 30, color: COR.offWhite, opacity: entrada * 0.85}}>
        {PRECO.carta}
      </div>
    </AbsoluteFill>
  );
};

const CenaEscada: React.FC<{cena: Extract<Cena, {tipo: 'escada'}>}> = ({cena}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{padding: MARGEM, justifyContent: 'center', gap: 36}}>
      <div
        style={{
          fontFamily: MONTSERRAT,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 4,
          color: COR.teal,
          marginBottom: 24,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {cena.rotulo.t}
      </div>
      {cena.degraus.map((degrau, i) => {
        const inicio = (degrau.s - cena.s) * fps;
        return (
          <div
            key={degrau.t}
            style={{
              fontFamily: SORA,
              fontWeight: 700,
              fontSize: 88,
              color: i === cena.degraus.length - 1 ? COR.amarelo : COR.branco,
              paddingLeft: i * 40,
              opacity: interpolate(frame, [inicio, inicio + 0.25 * fps], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              translate: interpolate(frame, [inicio, inicio + 0.4 * fps], [-24, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }) + 'px 0px',
            }}
          >
            {degrau.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CenaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrada = useEntrada(0.5);
  return (
    <AbsoluteFill style={{padding: MARGEM, alignItems: 'center', justifyContent: 'center', gap: 72}}>
      <div
        style={{
          fontFamily: SORA,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.14,
          color: COR.branco,
          textAlign: 'center',
          maxWidth: 820,
          opacity: entrada,
        }}
      >
        EDUCAÇÃO FINANCEIRA
        <br />
        COMEÇA NO CHÃO DO QUARTO.
      </div>
      {/* A marca só tem a versão colorida aqui, e ela é feita para fundo claro.
          Em vez de recolorir o logo (proibido), ele entra sobre uma placa off-white. */}
      <div
        style={{
          background: COR.offWhite,
          borderRadius: 24,
          padding: '36px 56px',
          opacity: interpolate(frame, [2.4 * fps, 3 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Img src={arq('prints/logo_full_icf.png')} style={{width: 560, display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

/** Legendas queimadas. Só entram nas cenas de print: nas de tipografia o texto já está na tela. */
const Legendas: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const linha = LEGENDAS.find((l: Linha) => t >= l.s && t < l.e);
  if (!linha) {
    return null;
  }
  const ativa = [...linha.toks].reverse().find((tok) => t >= tok.s);
  return (
    <div
      style={{
        position: 'absolute',
        left: MARGEM,
        right: MARGEM,
        top: 1380,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px 18px',
        fontFamily: SORA,
        fontWeight: 700,
        fontSize: 72,
        lineHeight: 1.15,
      }}
    >
      {linha.toks
        .filter((tok) => t >= tok.s)
        .map((tok) => (
          <span
            key={tok.t + tok.s}
            style={{
              color: tok === ativa ? COR.navy : COR.branco,
              background: tok === ativa ? COR.amarelo : 'transparent',
              padding: '2px 14px',
              borderRadius: 12,
              textShadow: tok === ativa ? 'none' : '0 6px 24px rgba(0,0,0,.7)',
            }}
          >
            {tok.t}
          </span>
        ))}
    </div>
  );
};

const corpo = (cena: Cena) => {
  switch (cena.tipo) {
    case 'print':
      return cena.img === FICHARIO.print ? <CenaFichario cena={cena} /> : <CenaPrint cena={cena} />;
    case 'frase':
      return <CenaFrase cena={cena} />;
    case 'precos':
      return <CenaPrecos />;
    case 'escada':
      return <CenaEscada cena={cena} />;
    case 'logo':
      return <CenaLogo />;
  }
};

export const CartaQueVale: React.FC = () => (
  <AbsoluteFill style={{background: COR.navy, width: LARGURA, height: ALTURA}}>
    <Audio src={NARRACAO} />
    {CENAS.map((cena) => (
      <Sequence
        key={cena.tipo + '-' + cena.s}
        from={f(cena.s)}
        durationInFrames={f(cena.e) - f(cena.s)}
        name={cena.tipo + ' ' + cena.s + 's'}
      >
        {corpo(cena)}
      </Sequence>
    ))}
    <Legendas />
  </AbsoluteFill>
);
