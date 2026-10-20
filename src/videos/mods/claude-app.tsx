import React from 'react';
import {interpolate} from 'remotion';
import {Asterisco, COR, FONTE, clamp, useAgora, useEm, useMola} from './base';

// Claude desktop (aba Code) recriado a partir do print do Macks. Tema escuro real do app.
export const APP = {
  fundo: '#141413',
  lateral: '#1B1A19',
  linha: '#2C2B28',
  caixa: '#232220',
  texto: '#E8E6DC',
  apagado: '#9C9A92',
  verde: '#7FB069',
};

type Props = {
  largura?: number;
  altura?: number;
  inicio?: boolean;
  conversa?: React.ReactNode;
  prompt?: {texto: string; de: number; ate: number};
  painel?: {em: number; largura: number; conteudo: React.ReactNode};
  modal?: {em: number; conteudo: React.ReactNode};
  abaCodeEm?: number;
  cursor?: {pontos: {t: number; x: number; y: number}[]; cliques?: number[]};
  style?: React.CSSProperties;
};

export const ClaudeApp: React.FC<Props> = ({largura = 1360, altura = 860, inicio, conversa, prompt, painel, modal, abaCodeEm, cursor, style}) => {
  const t = useAgora();
  const abaCode = abaCodeEm === undefined || t >= abaCodeEm;
  const pPainel = useMola(painel?.em ?? 1e9);
  const pModal = useMola(modal?.em ?? 1e9);
  const digitado = prompt ? Math.round(interpolate(t, [prompt.de, prompt.ate], [0, prompt.texto.length], clamp)) : 0;
  const larguraPainel = painel ? painel.largura * pPainel : 0;

  return (
    <div
      style={{
        position: 'absolute',
        width: largura,
        height: altura,
        background: APP.fundo,
        borderRadius: 18,
        overflow: 'hidden',
        border: `1.5px solid ${APP.linha}`,
        boxShadow: '0 40px 100px rgba(20,15,10,.45), 0 0 0 10px rgba(250,249,245,.06)',
        fontFamily: FONTE.ui,
        color: APP.texto,
        display: 'flex',
        ...style,
      }}
    >
      <div style={{width: 300, background: APP.lateral, borderRight: `1px solid ${APP.linha}`, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 9, height: 30}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          ))}
          <div style={{flex: 1}} />
          <div style={{display: 'flex', gap: 4, background: '#232220', borderRadius: 9, padding: 3}}>
            <div style={{padding: '4px 10px', borderRadius: 7, fontSize: 15, color: abaCode ? APP.apagado : APP.texto, background: abaCode ? 'transparent' : '#3a3936'}}>Chat</div>
            <div style={{padding: '4px 10px', borderRadius: 7, fontSize: 15, fontFamily: FONTE.mono, color: abaCode ? APP.texto : APP.apagado, background: abaCode ? '#3a3936' : 'transparent', boxShadow: abaCodeEm !== undefined && abaCode ? `0 0 0 2px ${COR.terra}` : 'none'}}>
              {'</>'} Code
            </div>
          </div>
        </div>
        <div style={{marginTop: 14, border: `1px solid ${APP.linha}`, borderRadius: 9, padding: '9px 12px', fontSize: 17, color: APP.apagado}}>⌕  Procurar</div>
        {['+  Novo', '◇  Artifacts', '▭  Personalização', '›  Mais'].map((x, i) => (
          <div key={x} style={{padding: '9px 12px', borderRadius: 9, fontSize: 18, background: i === 0 ? '#2A2927' : 'transparent'}}>{x}</div>
        ))}
        <div style={{height: 18}} />
        {['inteligencia-aplicada', 'recmove', 'design', 'Relacionamentos'].map((x) => (
          <div key={x} style={{padding: '9px 12px', fontSize: 17, color: APP.apagado}}>{x}  ›</div>
        ))}
        <div style={{flex: 1}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, padding: '8px 4px'}}>
          <div style={{width: 30, height: 30, borderRadius: 15, background: '#3a3936', fontSize: 12, display: 'grid', placeItems: 'center'}}>MW</div>
          Macks Wendhell <span style={{color: APP.apagado}}>· Pro</span>
        </div>
      </div>

      <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: 1, position: 'relative', overflow: 'hidden', padding: '34px 48px', paddingRight: 48 + larguraPainel}}>
          {inicio && (
            <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, marginTop: 30, marginLeft: 20}}>
              <Asterisco size={40} />
              O que vem a seguir, Macks Wendhell?
            </div>
          )}
          {conversa}
        </div>

        <div style={{padding: '0 48px 22px', paddingRight: 48 + larguraPainel}}>
          <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
            {['▭  Local', '▢  Nenhuma pasta'].map((x) => (
              <div key={x} style={{fontSize: 16, padding: '6px 12px', background: APP.caixa, borderRadius: 8}}>{x}</div>
            ))}
          </div>
          <div style={{border: `1.5px solid ${digitado > 0 ? '#55524b' : APP.linha}`, borderRadius: 14, padding: '16px 20px', fontSize: 21, minHeight: 58, background: '#191918', fontFamily: FONTE.ui}}>
            {prompt && digitado > 0 ? (
              <span>
                {prompt.texto.slice(0, digitado)}
                {t < prompt.ate + 0.6 && Math.floor(t * 2.2) % 2 === 0 && <span style={{color: COR.terra}}>▍</span>}
              </span>
            ) : (
              <span style={{color: APP.apagado}}>Descreva uma tarefa ou faça uma pergunta</span>
            )}
          </div>
          <div style={{display: 'flex', fontSize: 16, color: APP.apagado, marginTop: 10, gap: 18}}>
            <span>+   Automático</span>
            <span style={{flex: 1}} />
            <span style={{color: APP.texto}}>Opus 5.5</span>
            <span>Médio</span>
          </div>
        </div>

        {painel && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: painel.largura,
              transform: `translateX(${(1 - pPainel) * painel.largura}px)`,
              background: '#191918',
              borderLeft: `1.5px solid ${APP.linha}`,
              padding: '30px 28px',
            }}
          >
            {painel.conteudo}
          </div>
        )}
      </div>

      {modal && pModal > 0.01 && (
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.55 * pModal})`, display: 'grid', placeItems: 'center'}}>
          <div style={{transform: `scale(${0.85 + 0.15 * pModal})`, opacity: pModal}}>{modal.conteudo}</div>
        </div>
      )}

      {cursor && <Cursor {...cursor} />}
    </div>
  );
};

const Cursor: React.FC<{pontos: {t: number; x: number; y: number}[]; cliques?: number[]}> = ({pontos, cliques = []}) => {
  const t = useAgora();
  const ts = pontos.map((p) => p.t);
  const x = interpolate(t, ts, pontos.map((p) => p.x), clamp);
  const y = interpolate(t, ts, pontos.map((p) => p.y), clamp);
  const c = cliques.map((k) => interpolate(t, [k, k + 0.35], [0, 1], clamp)).find((v) => v > 0 && v < 1) ?? 0;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {c > 0 && <div style={{position: 'absolute', left: -30 * c, top: -30 * c, width: 60 * c, height: 60 * c, borderRadius: '50%', border: `3px solid ${COR.terra}`, opacity: 1 - c}} />}
      <svg width="30" height="38" viewBox="0 0 20 26">
        <path d="M1 1 L1 20 L6 15 L9.5 23 L13 21.5 L9.5 14 L16 14 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Peças da conversa.
export const Usuario: React.FC<{em: number; texto: string}> = ({em, texto}) => {
  const p = useMola(em);
  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 22, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
      <div style={{background: '#2B2A27', borderRadius: 14, padding: '14px 20px', fontSize: 21, maxWidth: 640}}>{texto}</div>
    </div>
  );
};

export const Linha: React.FC<{em: number; children: React.ReactNode; style?: React.CSSProperties}> = ({em, children, style}) => {
  const p = useEm(em, 0.3);
  return <div style={{fontSize: 20, lineHeight: 1.5, marginBottom: 12, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style}}>{children}</div>;
};

export const Ferramenta: React.FC<{em: number; nome: string; arg: string; cor?: string}> = ({em, nome, arg, cor = APP.verde}) => (
  <Linha em={em} style={{fontFamily: FONTE.mono, fontSize: 18}}>
    <span style={{color: cor}}>●</span> <b>{nome}</b> <span style={{color: APP.apagado}}>{arg}</span>
  </Linha>
);

export const Codigo: React.FC<{de: number; ate: number; linhas: string[]}> = ({de, ate, linhas}) => {
  const t = useAgora();
  const n = Math.round(interpolate(t, [de, ate], [0, linhas.length], clamp));
  if (n === 0) return null;
  return (
    <div style={{fontFamily: FONTE.mono, fontSize: 16, lineHeight: 1.55, background: '#1A1918', border: `1px solid ${APP.linha}`, borderRadius: 10, padding: '12px 16px', marginBottom: 14, color: '#CFCBBF'}}>
      {linhas.slice(0, n).map((l, i) => (
        <div key={i} style={{whiteSpace: 'pre'}}>
          <span style={{color: '#5d5b55', marginRight: 14}}>{String(i + 1).padStart(2, ' ')}</span>
          {l}
        </div>
      ))}
    </div>
  );
};

export const TituloPainel: React.FC<{texto: string; cor?: string}> = ({texto, cor = APP.apagado}) => (
  <div style={{fontSize: 15, letterSpacing: 2, textTransform: 'uppercase', color: cor, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10}}>
    <span style={{width: 8, height: 8, borderRadius: 4, background: COR.terra}} />
    {texto}
  </div>
);

export const ItemPainel: React.FC<{em: number; icone?: string; texto: string; cor?: string; apagado?: boolean; destaque?: boolean}> = ({
  em,
  icone = '✓',
  texto,
  cor = APP.verde,
  apagado,
  destaque,
}) => {
  const p = useMola(em);
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        fontSize: 19,
        padding: '11px 14px',
        marginBottom: 8,
        borderRadius: 10,
        background: destaque ? 'rgba(217,119,87,.16)' : '#201F1D',
        border: `1px solid ${destaque ? COR.terra : APP.linha}`,
        color: apagado ? APP.apagado : APP.texto,
        opacity: p,
        transform: `translateX(${(1 - p) * 30}px)`,
      }}
    >
      <span style={{color: cor, width: 20, fontFamily: FONTE.mono}}>{icone}</span>
      {texto}
    </div>
  );
};
