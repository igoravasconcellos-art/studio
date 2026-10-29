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
import {ALTURA, BLOCOS, Bloco, CLIPES, COR, DURACAO, f, FAIXA, FONTE, LARGURA, MARGEM, NARRACAO, Tok} from './base';

/** Mola curta para entradas: sobe e assenta sem quicar. */
const entrada = (frame: number, atraso: number) =>
  interpolate(frame, [atraso, atraso + 9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/** Saída suave nos últimos 8 quadros do bloco. */
const saida = (frame: number, fim: number) =>
  interpolate(frame, [fim - 8, fim], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const Faixa: React.FC<{children: React.ReactNode; opacidade: number}> = ({children, opacidade}) => (
  <div
    style={{
      position: 'absolute',
      top: FAIXA.topo,
      left: MARGEM,
      width: LARGURA - 2 * MARGEM,
      minHeight: FAIXA.altura,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 14,
      opacity: opacidade,
    }}
  >
    {children}
  </div>
);

/** Legenda: a linha sendo dita fica branca sobre navy; as já ditas, apagadas. */
const Legenda: React.FC<{bloco: Extract<Bloco, {tipo: 'legenda'}>; tempo: number; frame: number}> = ({
  bloco,
  tempo,
  frame,
}) => {
  const op = saida(frame, f(bloco.e));
  return (
    <Faixa opacidade={op}>
      {bloco.toks.map((tok: Tok) => {
        if (tempo < tok.s) return null;
        const ativa = tempo >= tok.s && tempo < tok.e;
        const esc = interpolate(frame - f(tok.s), [0, 7], [0.92, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={tok.t}
            style={{
              transform: `scale(${esc})`,
              background: ativa ? COR.navy : 'rgba(7,37,58,0.55)',
              color: ativa ? COR.branco : 'rgba(255,255,255,0.65)',
              fontFamily: FONTE,
              fontSize: 62,
              lineHeight: 1.1,
              letterSpacing: -1,
              padding: '12px 24px',
              borderRadius: 14,
              textAlign: 'center',
              boxShadow: ativa ? '0 10px 30px rgba(4,23,35,0.35)' : 'none',
            }}
          >
            {tok.t}
          </div>
        );
      })}
    </Faixa>
  );
};

/** O número que o gancho prometeu. Sozinho na tela: nada compete com ele. */
const Numero: React.FC<{bloco: Extract<Bloco, {tipo: 'numero'}>; frame: number}> = ({bloco, frame}) => {
  const ini = f(bloco.s);
  const ap = entrada(frame, ini);
  const op = ap * saida(frame, f(bloco.e));
  const esc = interpolate(ap, [0, 1], [0.7, 1]);
  return (
    <Faixa opacidade={op}>
      <div
        style={{
          fontFamily: FONTE,
          fontSize: 34,
          letterSpacing: 4,
          color: COR.branco,
          background: COR.navy,
          padding: '10px 22px',
          borderRadius: 10,
        }}
      >
        {bloco.rotulo}
      </div>
      <div
        style={{
          transform: `scale(${esc})`,
          fontFamily: FONTE,
          fontSize: 210,
          lineHeight: 1,
          color: COR.turquesa,
          textShadow: '0 14px 40px rgba(4,23,35,0.55)',
          WebkitTextStroke: `6px ${COR.navyProfundo}`,
        }}
      >
        {bloco.valor}
      </div>
    </Faixa>
  );
};

/** Três chips, um por palavra dita. O último é o coral, porque "chato" é o ponto. */
const Chips: React.FC<{bloco: Extract<Bloco, {tipo: 'chips'}>; tempo: number; frame: number}> = ({
  bloco,
  tempo,
  frame,
}) => {
  const op = saida(frame, f(bloco.e));
  return (
    <Faixa opacidade={op}>
      {bloco.itens.map((item, i) => {
        if (tempo < item.s) return null;
        const ap = entrada(frame, f(item.s));
        const ultimo = i === bloco.itens.length - 1;
        return (
          <div
            key={item.t}
            style={{
              opacity: ap,
              transform: `translateY(${(1 - ap) * 26}px)`,
              fontFamily: FONTE,
              fontSize: 72,
              letterSpacing: -1,
              color: COR.branco,
              background: ultimo ? COR.coral : COR.navy,
              padding: '14px 30px',
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(4,23,35,0.35)',
            }}
          >
            {item.t}
          </div>
        );
      })}
    </Faixa>
  );
};

/** Fecho: a promessa cumprida, em tipografia grande. */
const Fecho: React.FC<{bloco: Extract<Bloco, {tipo: 'fecho'}>; tempo: number; frame: number}> = ({
  bloco,
  tempo,
  frame,
}) => {
  const ap = entrada(frame, f(bloco.s));
  return (
    <Faixa opacidade={ap}>
      {bloco.linhas.map((linha) => (
        <div
          key={linha}
          style={{
            fontFamily: FONTE,
            fontSize: 74,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: COR.branco,
            background: COR.navy,
            padding: '10px 26px',
            borderRadius: 14,
            textAlign: 'center',
          }}
        >
          {linha}
        </div>
      ))}
      {tempo >= bloco.s2 ? (
        <div
          style={{
            opacity: entrada(frame, f(bloco.s2)),
            transform: `scale(${interpolate(entrada(frame, f(bloco.s2)), [0, 1], [0.86, 1])})`,
            fontFamily: FONTE,
            fontSize: 86,
            letterSpacing: -2,
            color: COR.navyProfundo,
            background: COR.turquesa,
            padding: '12px 30px',
            borderRadius: 16,
            boxShadow: '0 12px 34px rgba(4,23,35,0.45)',
          }}
        >
          INVESTIMENTO
        </div>
      ) : null}
    </Faixa>
  );
};

export const Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = frame / fps;

  return (
    <AbsoluteFill style={{backgroundColor: COR.navyProfundo}}>
      {/* Os três clipes de fala em sequência, cortados nos mesmos segundos do áudio. */}
      {CLIPES.map((clipe) => {
        const de = f(clipe.inicio);
        const ate = f(clipe.fim);
        return (
          <Sequence key={clipe.arquivo} from={de} durationInFrames={ate - de}>
            <OffthreadVideo
              src={clipe.arquivo}
              muted
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </Sequence>
        );
      })}

      {/* A narração entra uma única vez e segue contínua por cima dos cortes. */}
      <Audio src={NARRACAO} />

      {/* Véu suave na metade de baixo: o texto fica legível sem cobrir o rosto. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(4,23,35,0) ${(FAIXA.topo - 220) / ALTURA * 100}%, rgba(4,23,35,0.55) 100%)`,
        }}
      />

      {BLOCOS.map((bloco) => {
        if (tempo < bloco.s || tempo > bloco.e) return null;
        if (bloco.tipo === 'legenda') return <Legenda key={bloco.s} bloco={bloco} tempo={tempo} frame={frame} />;
        if (bloco.tipo === 'numero') return <Numero key={bloco.s} bloco={bloco} frame={frame} />;
        if (bloco.tipo === 'chips') return <Chips key={bloco.s} bloco={bloco} tempo={tempo} frame={frame} />;
        return <Fecho key={bloco.s} bloco={bloco} tempo={tempo} frame={frame} />;
      })}
    </AbsoluteFill>
  );
};

export const DURACAO_SEGUNDOS = DURACAO;
