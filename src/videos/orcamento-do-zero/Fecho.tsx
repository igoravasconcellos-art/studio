import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ALTURA, arq, cena as arquivoDaCena, COR, DISSOLVE, FONTE, LARGURA} from './base';
import {DURACAO5, ERROS, LEGENDAS5, MARCOS5, PLANOS5} from './dados5';

/* ----------------------------------------------------------------------------
   012 — Bloco 5: os erros comuns e o fecho (6:50 → fim do roteiro S01B).

   Zero crédito. A lista de erros, o passo de hoje, a cartela do próximo vídeo e
   o aviso legal são desenhados; as cenas ilustradas são todas reaproveitadas —
   o caderno rabiscado para o "rascunho torto", o Igor falando para a câmera na
   frase pessoal e na assinatura, a folha com as colunas no passo de hoje, e a
   mesa de pizza no pedido de compartilhar.
---------------------------------------------------------------------------- */

const suave = Easing.inOut(Easing.cubic);
const saida = Easing.out(Easing.cubic);

const corre = (t: number, de: number, ate: number, easing = saida) =>
  interpolate(t, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const NARRACAO5 = arq('audio/bloco5.wav');

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

/** Os quatro erros, um por vez. O quarto é o que importa, e ele chega destacado. */
const ListaErros: React.FC<{tempo: number}> = ({tempo}) => (
  <div
    style={{
      position: 'absolute',
      left: 240,
      top: 210,
      width: LARGURA - 480,
      display: 'flex',
      flexDirection: 'column',
      gap: 34,
    }}
  >
    {/* O rótulo existe para a tela não abrir vazia: o primeiro erro só entra quando
        é dito, e sem isto o bloco começava com quase dois segundos de papel em branco. */}
    <Sobe
      tempo={tempo}
      gatilho={0.15}
      style={{
        fontFamily: FONTE,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: 5,
        color: COR.tinta,
        opacity: 0.55,
      }}
    >
      OS ERROS MAIS COMUNS
    </Sobe>
    {ERROS.map((e, i) => {
      const destaque = i === 3;
      const cor = destaque ? COR.terracota : COR.tinta;
      return (
        <div key={e.n} style={{display: 'flex', gap: 28, alignItems: 'flex-start'}}>
          <Sobe
            tempo={tempo}
            gatilho={e.s}
            style={{
              fontFamily: FONTE,
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.9,
              letterSpacing: 2,
              color: cor,
              opacity: 0.6,
            }}
          >
            {e.n}
          </Sobe>
          <div>
            <Sobe
              tempo={tempo}
              gatilho={e.s}
              style={{
                fontFamily: FONTE,
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 1.2,
                color: cor,
              }}
            >
              {e.t}
            </Sobe>
            <Sobe
              tempo={tempo}
              gatilho={e.s + 0.35}
              style={{
                fontFamily: FONTE,
                fontWeight: 600,
                fontSize: 28,
                lineHeight: 1.5,
                color: COR.tinta,
                opacity: 0.5,
              }}
            >
              {e.sub}
            </Sobe>
          </div>
        </div>
      );
    })}
  </div>
);

/** O passo de hoje: a folha em miniatura, com o futuro preenchido primeiro. */
const PassoDeHoje: React.FC<{tempo: number}> = ({tempo}) => {
  const entra = corre(tempo, MARCOS5.comece, MARCOS5.comece + 0.7, suave);
  const futuro = corre(tempo, MARCOS5.futuroPrimeiro, MARCOS5.futuroPrimeiro + 0.8, suave);
  const colunas = [
    {t: 'ESSENCIAL', cor: COR.tinta},
    {t: 'DESEJO', cor: COR.terracota},
    {t: 'FUTURO', cor: COR.oliva},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: entra,
      }}
    >
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 5,
          color: COR.tinta,
          opacity: 0.55,
          marginBottom: 30,
        }}
      >
        O SEU PASSO DE HOJE
      </div>
      <div style={{display: 'flex', gap: 0, background: '#FAF4EA', borderRadius: 8, padding: 36, boxShadow: '0 16px 50px rgba(62,46,38,0.15)'}}>
        {colunas.map((c, i) => (
          <div
            key={c.t}
            style={{
              width: 300,
              padding: '0 26px',
              borderLeft: i === 0 ? 'none' : '2px solid rgba(62,46,38,0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{fontFamily: FONTE, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: c.cor}}>
              {c.t}
            </div>
            <div
              style={{
                marginTop: 24,
                width: '100%',
                height: 210,
                borderRadius: 8,
                background: c.cor,
                // só o futuro se preenche: é o que a fala manda escrever primeiro
                opacity: i === 2 ? 0.08 + futuro * 0.22 : 0.07,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/** A cartela do próximo vídeo. */
const Cartela: React.FC<{tempo: number}> = ({tempo}) => {
  const entra = corre(tempo, MARCOS5.proximo, MARCOS5.proximo + 0.7, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: ALTURA * 0.3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: entra,
        transform: `translateY(${(1 - entra) * 22}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 5,
          color: COR.terracota,
          marginBottom: 26,
        }}
      >
        O PRÓXIMO VÍDEO
      </div>
      <div
        style={{
          maxWidth: 1180,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.22,
          color: COR.tinta,
        }}
      >
        Por que o dinheiro some antes do fim do mês
      </div>
      <div
        style={{
          marginTop: 34,
          width: 520 * corre(tempo, MARCOS5.proximo + 0.6, MARCOS5.proximo + 1.4, suave),
          height: 5,
          borderRadius: 3,
          background: COR.terracota,
        }}
      />
    </div>
  );
};

/** O aviso legal, em letra pequena e sem drama. */
const Aviso: React.FC<{tempo: number}> = ({tempo}) => {
  const entra = corre(tempo, MARCOS5.aviso, MARCOS5.aviso + 0.6, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: ALTURA * 0.36,
        display: 'flex',
        justifyContent: 'center',
        opacity: entra * 0.85,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.5,
          color: COR.tinta,
          opacity: 0.75,
        }}
      >
        Conteúdo educacional, não é recomendação de investimento. Os números são ilustrativos, cada
        família tem a sua situação, e nenhum investimento tem retorno garantido.
      </div>
    </div>
  );
};

const Legenda: React.FC<{tempo: number}> = ({tempo}) => {
  const atual = LEGENDAS5.find((l) => tempo >= l.s - 0.12 && tempo < l.e + 0.18);
  if (!atual) return null;
  const entra = corre(tempo, atual.s - 0.12, atual.s + 0.1, suave);
  const sai = 1 - corre(tempo, atual.e, atual.e + 0.16, suave);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 34,
        display: 'flex',
        justifyContent: 'center',
        opacity: entra * sai,
      }}
    >
      <div
        style={{
          maxWidth: LARGURA * 0.68,
          textAlign: 'center',
          fontFamily: FONTE,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.34,
          color: COR.tinta,
          background: 'rgba(246,239,230,0.92)',
          padding: '11px 26px',
          borderRadius: 10,
          boxShadow: '0 6px 26px rgba(62,46,38,0.14)',
        }}
      >
        {atual.t}
      </div>
    </div>
  );
};

const Desenhado: React.FC<{tipo: string; tempo: number}> = ({tipo, tempo}) => {
  if (tipo === 'erros') return <ListaErros tempo={tempo} />;
  if (tipo === 'passo') return <PassoDeHoje tempo={tempo} />;
  if (tipo === 'cartela') return <Cartela tempo={tempo} />;
  return <Aviso tempo={tempo} />;
};

/** `comAudio` existe para a composição completa: lá a trilha é uma só, contínua,
 *  e cada bloco entra sem o próprio áudio. */
export const Fecho: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  const quadro = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tempo = quadro / fps;

  const planos = PLANOS5.map((p, i) => ({
    ...p,
    fim: i + 1 < PLANOS5.length ? PLANOS5[i + 1].s : DURACAO5,
    i,
  }));
  const visiveis = planos.filter((p) => tempo >= p.s - DISSOLVE - 0.2 && tempo < p.fim + 0.4);

  return (
    <AbsoluteFill style={{background: COR.papel}}>
      {visiveis.map((p) => {
        const avanco = interpolate(tempo, [p.s, p.fim], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const ehImagem = p.tipo === 'img';
        const escala = ehImagem ? 1.06 + avanco * 0.07 : 1 + avanco * 0.015;
        const desloca = ehImagem ? (p.i % 2 === 0 ? 1 : -1) * avanco * 22 : 0;
        return (
          <AbsoluteFill
            key={`${p.tipo}-${p.n}-${p.s}`}
            style={{opacity: corre(tempo, p.s, p.s + DISSOLVE, suave), background: COR.papel}}
          >
            <AbsoluteFill
              style={{
                transform: `scale(${escala}) translateX(${desloca}px)`,
                transformOrigin: '50% 50%',
              }}
            >
              {ehImagem ? (
                <Img
                  src={arquivoDaCena(p.n)}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              ) : (
                <Desenhado tipo={p.tipo} tempo={tempo} />
              )}
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      <Legenda tempo={tempo} />
      {comAudio ? <Audio src={NARRACAO5} /> : null}
    </AbsoluteFill>
  );
};

export default Fecho;
