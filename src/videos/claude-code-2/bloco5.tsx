import React from 'react';
import {interpolate} from 'remotion';
import {Caixa, Conversa, Cursor, Icone, JanelaApp, Lateral, Menu, MsgClaude, MsgUsuario} from '../../estilos/demo-tutorial/app';
import {APP, COR, FONTE, clamp, suave, useAgora, useDigitado, useEm, useMola} from './base';
import {App, ORGANIZADA} from './comum';
import {Folha, IconeGrande, TituloDiagrama} from '../../estilos/demo-tutorial/diagrama';

const BARRA = ORGANIZADA([], 0);
const PAPEL = '#FAF9F5';

// ---------- moldura de artefato: conversa estreita à esquerda, artefato à direita ----------
const Artefato: React.FC<{titulo: string; pedido: string; resposta: string; compartilharAtivo?: boolean; ferramentas?: React.ReactNode; fundo?: string; children: React.ReactNode}> = ({
  titulo,
  pedido,
  resposta,
  compartilharAtivo,
  ferramentas,
  fundo = PAPEL,
  children,
}) => (
  <>
    <div style={{width: 360, display: 'flex', flexShrink: 0, borderRight: `1px solid ${APP.linha}`}}>
      <Conversa titulo={titulo} caixa={<Caixa rodape={false} />}>
        <MsgUsuario>{pedido}</MsgUsuario>
        <MsgClaude style={{fontSize: 14}}>{resposta}</MsgClaude>
      </Conversa>
    </div>
    <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: APP.fundo, fontFamily: FONTE.ui}}>
      <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: `1px solid ${APP.linha}`, color: APP.texto, fontSize: 14.5}}>
        {titulo}
        <svg width={12} height={12} viewBox="0 0 12 12">
          <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke={APP.apagado} strokeWidth={1.5} />
        </svg>
        <div style={{flex: 1}} />
        {ferramentas}
        <Icone n="chat" t={17} cor={APP.apagado} />
        <span style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: compartilharAtivo ? '#d9d9d6' : '#ECECEA', color: '#1e1e1e', fontWeight: 500, fontSize: 13.5}}>Compartilhar</span>
        <span style={{color: APP.apagado, fontSize: 16}}>⤢ ×</span>
      </div>
      <div style={{flex: 1, position: 'relative', overflow: 'hidden', background: fundo}}>{children}</div>
    </div>
  </>
);

// ---------- 6.1 · Cartela 05/07 com os cinco nomes (511,2–522,5), câmera G ----------
const CINCO: [string, number][] = [
  ['Docs', 517.8],
  ['Slides', 518.6],
  ['Design', 519.4],
  ['Dashboards', 520.2],
  ['Motion', 521.9],
];
export const C6_1: React.FC = () => {
  const m = useMola(511.3);
  const t = useAgora();
  return (
    <div style={{position: 'absolute', left: 110, top: 300, opacity: m, transform: `translateY(${(1 - m) * 30}px)`}}>
      <div style={{fontFamily: FONTE.mono, fontSize: 30, color: COR.terra, letterSpacing: 2}}>05 / 07</div>
      <div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 80, color: COR.tinta, letterSpacing: -2.5, marginTop: 14}}>Artefatos</div>
      <div style={{fontFamily: FONTE.ui, fontSize: 32, color: COR.cinza, marginTop: 10}}>já não é tão novo, mas vale testar</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 40, width: 1080}}>
        {CINCO.map(([n, em]) => {
          const on = t >= em;
          return (
            <span key={n} style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 40, padding: '10px 22px', borderRadius: 14, border: `1.5px solid ${on ? COR.terraEscuro : COR.borda}`, background: on ? COR.terra : COR.mesaClara, color: on ? '#fff' : '#bbb4a6'}}>
              {n}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- 6.2 · Analogias (522,5–532,8), câmera G ----------
const ANALOGIAS: ['doc' | 'slides' | 'design' | 'grafico' | 'video', string, number][] = [
  ['doc', 'um Google Docs', 526.4],
  ['slides', 'um Google Slides', 527.5],
  ['design', 'uma ferramenta de design', 529.0],
  ['grafico', 'um Looker Studio', 530.4],
  ['video', 'um editor de vídeo', 531.6],
];
export const C6_2: React.FC = () => (
  <>
    <TituloDiagrama em={523.4}>
      A Anthropic montando <span style={{color: COR.terra}}>dentro do Claude</span>
    </TituloDiagrama>
    {ANALOGIAS.map(([ic, txt, em], i) => (
      <Folha key={txt} em={em} x={90 + (i % 3) * 380} y={220 + Math.floor(i / 3) * 300} w={350} h={260} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22}}>
        <IconeGrande n={ic} t={96} cor={COR.terra} />
        <span style={{fontSize: 30, fontWeight: 600, textAlign: 'center', padding: '0 16px'}}>{txt}</span>
      </Folha>
    ))}
  </>
);

// ---------- 6.3 · Documento: comentar e compartilhar (532,8–546,7), câmera D ----------
const ORIGINAL =
  'Antes de mostrar cada novidade, deixa eu explicar por que vale olhar para a aba Code: a interface ficou mais organizada, as novidades chegam primeiro ali e dá para usar sem programar, porque por trás é a mesma ferramenta do Cowork com mais recursos.';
const ENXUTO = 'A aba Code ficou mais organizada, recebe as novidades primeiro e dá para usar sem programar.';
const COMENTARIO = '@Claude Enxugue este trecho para duas linhas';

const Documento: React.FC<{selecao?: number; trocado?: boolean; abas?: boolean; abaAtiva?: number; cursores?: boolean}> = ({selecao = 0, trocado, abas, abaAtiva = 0, cursores}) => (
  <div style={{display: 'flex', height: '100%'}}>
    {abas && (
      <div style={{width: 200, borderRight: '1px solid #E3DED2', padding: '28px 14px', fontFamily: FONTE.ui, fontSize: 14, color: '#3D3929'}}>
        {['Roteiro final', 'Lista de tomadas'].map((a, i) => (
          <div key={a} style={{padding: '8px 10px', borderRadius: 8, background: i === abaAtiva ? '#EDE9DF' : 'transparent', fontWeight: i === abaAtiva ? 600 : 400}}>
            {a}
          </div>
        ))}
      </div>
    )}
    <div style={{flex: 1, padding: '40px 60px', fontFamily: FONTE.serifa, color: '#1F1E1D', position: 'relative'}}>
      <div style={{fontSize: 34, fontWeight: 500, letterSpacing: -0.5}}>Claude Code 2.0: {abaAtiva === 1 ? 'lista de tomadas' : 'roteiro final'}</div>
      <div style={{fontFamily: FONTE.ui, fontSize: 13, color: '#8a8478', marginTop: 8}}>26 out. 2026 · Macks Wendhell</div>
      {abaAtiva === 1 ? (
        <ol style={{fontSize: 18, lineHeight: 1.7, marginTop: 22, paddingLeft: 22}}>
          <li>Abertura: câmera no rosto, depois o app inteiro.</li>
          <li>Layout: aproximar o painel lateral.</li>
          <li>Seções: menu, nova seção, arrastar.</li>
          <li>Projetos: o coordenador abre as threads.</li>
          <li>Tela dividida: duas conversas ao mesmo tempo.</li>
        </ol>
      ) : (
        <>
          <p style={{fontSize: 18, lineHeight: 1.7, marginTop: 22}}>
            A Anthropic refez o aplicativo do Claude Code no desktop. Agora ele tem projetos, threads, mods, conversa lateral e tela dividida para tocar várias tarefas ao mesmo tempo.
          </p>
          <p style={{fontSize: 18, lineHeight: 1.7}}>
            <span style={{background: selecao > 0 ? `rgba(76,141,219,${0.22 * selecao})` : 'transparent', borderRadius: 3}}>{trocado ? ENXUTO : ORIGINAL}</span>
          </p>
          <p style={{fontSize: 18, lineHeight: 1.7, color: '#3D3929'}}>Começando pelo layout. Quem usa o Cowork gosta muito do painel lateral, que mostra o plano, os conectores e os arquivos de cada conversa.</p>
        </>
      )}
      {cursores && (
        <>
          <Bandeira x={420} y={176} nome="Claude" cor={COR.terra} />
          <Bandeira x={180} y={300} nome="Equipe" cor={COR.azul} />
        </>
      )}
    </div>
  </div>
);
const Bandeira: React.FC<{x: number; y: number; nome: string; cor: string}> = ({x, y, nome, cor}) => {
  const t = useAgora();
  const dx = Math.sin(t * 1.3 + x) * 12;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y}}>
      <div style={{width: 2, height: 26, background: cor}} />
      <div style={{position: 'absolute', left: 0, top: -20, background: cor, color: '#fff', fontFamily: FONTE.ui, fontSize: 12, fontWeight: 600, padding: '2px 7px', borderRadius: 5, whiteSpace: 'nowrap'}}>{nome}</div>
    </div>
  );
};

const GaleriaArtefatos: React.FC<{hover?: number}> = ({hover = -1}) => (
  <div style={{flex: 1, background: APP.fundo, fontFamily: FONTE.ui, color: APP.texto, padding: '56px 120px'}}>
    <div style={{fontFamily: FONTE.serifa, fontSize: 34}}>Artefatos</div>
    <div style={{display: 'flex', gap: 18, marginTop: 24, fontSize: 15}}>
      <span style={{background: APP.sel, padding: '6px 12px', borderRadius: 8}}>Todos</span>
      <span style={{padding: '6px 0'}}>Meus</span>
      <span style={{padding: '6px 0'}}>Compartilhados com você</span>
    </div>
    <div style={{fontSize: 14, color: APP.apagado, marginTop: 30}}>Crie algo novo</div>
    <div style={{display: 'flex', gap: 14, marginTop: 12}}>
      {(
        [
          ['#24508F', 'doc', 'Documentos', 'Novo'],
          ['#7A3418', 'slides', 'Apresentações', 'Novo'],
          ['#4A3393', 'design', 'Design', 'Novo'],
          ['#8B2A2A', 'grafico', 'Painel', 'Beta'],
        ] as const
      ).map(([c, ic, n, selo], i) => (
        <div key={n}>
          <div style={{width: 150, height: 104, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: hover === i ? `0 0 0 3px ${COR.terra}` : undefined}}>
            <IconeGrande n={ic} t={50} cor="rgba(255,255,255,.85)" />
          </div>
          <div style={{fontSize: 14, marginTop: 8, display: 'flex', gap: 6, alignItems: 'center'}}>
            {n}
            <span style={{fontSize: 11, color: APP.link, border: `1px solid ${APP.link}`, borderRadius: 7, padding: '0 5px'}}>{selo}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const C6_3: React.FC = () => {
  const t = useAgora();
  const aberto = t >= 534.5;
  const sel = useEm(538.0, 0.6);
  const com = useDigitado(COMENTARIO, 539.6, 541.2);
  const popCom = useMola(539.3);
  const share = useMola(544.0);
  return (
    <App
      focos={[
        [532.8, 1, 735, 432],
        [535.2, 1.45, 980, 380, 0.8],
        [543.4, 1.5, 1170, 260, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} nav={aberto ? undefined : 'Artefatos'} />}>
        {!aberto ? (
          <GaleriaArtefatos hover={t > 533.6 ? 0 : -1} />
        ) : (
          <Artefato titulo="Claude Code 2.0: roteiro final" pedido="Transforme o roteiro em um documento para a equipe revisar." resposta="Criei o documento com o roteiro final. Pode comentar direto nos trechos." compartilharAtivo={t > 543.9}>
            <Documento selecao={t < 542.3 ? sel : 0} trocado={t >= 542.3} />
            {t >= 539.3 && t < 542.3 && (
              <div style={{position: 'absolute', left: 330, top: 300, width: 400, background: '#fff', border: '1px solid #E3DED2', borderRadius: 12, padding: 14, boxShadow: '0 18px 40px rgba(0,0,0,.18)', fontFamily: FONTE.ui, fontSize: 14.5, color: '#1F1E1D', opacity: popCom, transform: `translateY(${(1 - popCom) * 10}px)`}}>
                <span style={{color: COR.terra, fontWeight: 600}}>{com.texto.slice(0, 7)}</span>
                {com.texto.slice(7)}
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: '#6B675C'}}>
                  <input type="checkbox" checked readOnly style={{accentColor: COR.azul}} /> Enviar ao Claude
                  <div style={{flex: 1}} />
                  <span style={{background: '#1F1E1D', color: '#fff', borderRadius: 7, padding: '4px 10px'}}>↑</span>
                </div>
              </div>
            )}
            {t >= 544.0 && (
              <div style={{position: 'absolute', right: 16, top: 8, width: 340, background: '#fff', border: '1px solid #E3DED2', borderRadius: 12, padding: 16, boxShadow: '0 18px 40px rgba(0,0,0,.2)', fontFamily: FONTE.ui, fontSize: 14, color: '#1F1E1D', opacity: share, transform: `scale(${0.96 + 0.04 * share})`, transformOrigin: 'top right'}}>
                <div style={{display: 'flex', gap: 6, background: '#F0EEE6', borderRadius: 8, padding: 3}}>
                  <span style={{flex: 1, textAlign: 'center', background: '#fff', borderRadius: 6, padding: 5, fontWeight: 600}}>Compartilhar</span>
                  <span style={{flex: 1, textAlign: 'center', padding: 5, color: '#6B675C'}}>Exportar</span>
                </div>
                <div style={{border: '1px solid #E3DED2', borderRadius: 8, padding: '8px 10px', marginTop: 12, color: '#8a8478'}}>Adicionar pessoas ou projetos</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12}}>
                  <div style={{width: 24, height: 24, borderRadius: 12, background: '#1F1E1D', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>M</div>
                  Macks Wendhell (você)
                  <div style={{flex: 1}} />
                  <span style={{color: '#8a8478'}}>Proprietário</span>
                </div>
                <div style={{fontSize: 12.5, color: '#8a8478', marginTop: 14}}>Acesso geral</div>
                <div style={{marginTop: 6, padding: '8px 10px', borderRadius: 8, background: t > 545.3 ? 'rgba(217,119,87,.12)' : '#F5F3EC', border: `1px solid ${t > 545.3 ? COR.terra : '#E3DED2'}`}}>
                  {t > 545.3 ? 'Qualquer pessoa com o link' : 'Somente convidados'}
                </div>
                <div style={{marginTop: 12, textAlign: 'right'}}>
                  <span style={{background: '#1F1E1D', color: '#fff', borderRadius: 8, padding: '6px 12px'}}>{t > 546.0 ? 'Link copiado' : 'Copiar link'}</span>
                </div>
              </div>
            )}
          </Artefato>
        )}
        <Cursor pts={[[533.0, 700, 500], [533.6, 400, 300], [536.6, 900, 400], [537.9, 700, 318], [539.0, 1180, 360], [543.6, 1300, 28], [545.0, 1200, 300]]} cliques={[534.2, 544.0, 545.3, 546.0]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 6.4 · Painel ao vivo (546,7–556,1), câmera D ----------
const METRICAS: [string, number, number, string, string][] = [
  ['Novos leads', 214, 231, '', '+38 nesta semana'],
  ['Reuniões agendadas', 27, 29, '', '+6 sobre a semana passada'],
  ['Novos membros', 63, 66, '', '+11 neste mês'],
  ['Visualizações no YouTube', 412, 418, ' mil', '+9% em 28 dias'],
];
export const C6_4: React.FC = () => {
  const t = useAgora();
  const at = interpolate(t, [554.6, 555.4], [0, 1], {...clamp, easing: suave});
  const desenho = t < 554.6 ? 1 : at;
  const pts = [8, 12, 10, 16, 15, 21, 19, 24, 22, 27, 26, 31, 30, 34];
  const novos = [8, 12, 10, 16, 15, 21, 19, 24, 22, 27, 26, 31, 33, 37];
  const linha = (vs: number[]) => vs.map((v, i) => `${i ? 'L' : 'M'}${20 + i * 42},${150 - v * 3.6}`).join(' ');
  return (
    <App
      focos={[
        [546.7, 1, 735, 432],
        [547.4, 1.4, 980, 330, 0.8],
        [553.2, 1.55, 1050, 260, 0.6],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} />}>
        <Artefato
          titulo="Painel da manhã"
          pedido="Monte um painel com os números da manhã, puxando dos conectores."
          resposta="Pronto. O painel busca os dados toda vez que você abre."
          fundo={PAPEL}
          ferramentas={
            <span style={{display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, border: `1px solid ${APP.linha}`, color: t > 553.4 && t < 554.4 ? COR.terra : APP.texto, fontSize: 13}}>
              <span style={{display: 'inline-block', transform: `rotate(${t > 553.7 ? (t - 553.7) * 540 : 0}deg)`}}>↻</span> Atualizar
            </span>
          }
        >
          <div style={{padding: '26px 32px', fontFamily: FONTE.ui, color: '#1F1E1D'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{fontSize: 26, fontWeight: 600}}>Painel da manhã</span>
              <span style={{fontSize: 13, color: '#8a8478'}}>Atualizado às {t > 554.8 ? '08h41' : '08h02'}</span>
              <span style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#4B8A3E'}}>
                <span style={{width: 8, height: 8, borderRadius: 4, background: '#4B8A3E', opacity: 0.5 + 0.5 * Math.sin(t * 5)}} /> Ao vivo
              </span>
            </div>
            <div style={{display: 'flex', gap: 14, fontSize: 12.5, color: '#8a8478', marginTop: 8}}>
              {['Google Sheets', 'Google Calendar', 'Stripe', 'YouTube'].map((c) => (
                <span key={c} style={{border: '1px solid #E3DED2', borderRadius: 6, padding: '2px 8px'}}>
                  {c}
                </span>
              ))}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 18}}>
              {METRICAS.map(([n, a, b, suf, sub]) => {
                const v = Math.round(a + (b - a) * at);
                return (
                  <div key={n} style={{background: '#fff', border: '1px solid #E3DED2', borderRadius: 12, padding: '12px 14px'}}>
                    <div style={{fontSize: 12.5, color: '#8a8478'}}>{n}</div>
                    <div style={{fontSize: 30, fontWeight: 600, marginTop: 4, color: at > 0 && at < 1 ? COR.terra : '#1F1E1D'}}>
                      {v}
                      {suf}
                    </div>
                    <div style={{fontSize: 12, color: '#4B8A3E'}}>{sub}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display: 'flex', gap: 12, marginTop: 14}}>
              <div style={{flex: 1.4, background: '#fff', border: '1px solid #E3DED2', borderRadius: 12, padding: '12px 14px'}}>
                <div style={{fontSize: 13, fontWeight: 600}}>Visualizações no YouTube</div>
                <div style={{fontSize: 12, color: '#8a8478'}}>Últimos 14 dias, em milhares por dia</div>
                <svg width={600} height={160}>
                  <path d={linha(t < 554.6 ? pts : novos)} fill="none" stroke={COR.azul} strokeWidth={3} strokeDasharray={1200} strokeDashoffset={1200 * (1 - desenho)} />
                </svg>
              </div>
              <div style={{flex: 1, background: '#fff', border: '1px solid #E3DED2', borderRadius: 12, padding: '12px 14px', fontSize: 13.5}}>
                <div style={{fontWeight: 600}}>De onde vêm os leads</div>
                {[
                  ['YouTube', 46],
                  ['Newsletter', 22],
                  ['LinkedIn', 18],
                  ['Indicações', 14],
                ].map(([n, v]) => (
                  <div key={n} style={{display: 'flex', marginTop: 9}}>
                    {n}
                    <div style={{flex: 1}} />
                    {v}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Artefato>
        <Cursor pts={[[549.0, 900, 500], [552.6, 1240, 28]]} cliques={[553.7]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 6.5 · Apresentações (556,1–563,2), câmera D ----------
export const C6_5: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [556.1, 1.2, 950, 432, 0.01],
        [561.4, 1.55, 1150, 180, 0.6],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={BARRA} />}
        overlay={<Menu em={561.9} x={1130} y={50} w={220} hover={t > 562.4 ? 0 : -1} itens={[{t: 'PowerPoint (.pptx)'}, {t: 'PDF'}, {t: 'Imagem (.png)'}]} />}
      >
        <Artefato
          titulo="Marketing em quatro canais"
          pedido="Transforme os números do mês numa apresentação."
          resposta="Fiz uma apresentação animada com seis slides. Dá para apresentar daqui ou exportar."
          fundo="#3a3a3a"
          ferramentas={
            <span style={{display: 'flex', gap: 10, color: APP.apagado, fontSize: 13}}>
              <span style={{padding: '4px 9px', borderRadius: 7, background: t > 560.0 && t < 561.6 ? APP.sel : 'transparent', color: APP.texto}}>▶ Apresentar</span>
              <span style={{padding: '4px 9px', borderRadius: 7, background: t > 561.6 ? APP.sel : 'transparent', color: APP.texto}}>⤓ Baixar</span>
            </span>
          }
        >
          <div style={{position: 'absolute', left: 50, top: 60, right: 50, bottom: 60, background: '#141413', borderRadius: 10, padding: '60px 64px', fontFamily: FONTE.ui, boxShadow: '0 20px 50px rgba(0,0,0,.4)'}}>
            <div style={{fontSize: 14, letterSpacing: 2, color: '#8a8478'}}>RELATÓRIO MENSAL</div>
            <div style={{fontSize: 52, fontWeight: 600, color: '#FAF9F5', letterSpacing: -1.5, lineHeight: 1.1, marginTop: 18, opacity: useEm(556.5, 0.6)}}>
              Como nosso marketing foi em <span style={{color: '#E8C468'}}>quatro canais</span>
            </div>
            <div style={{fontSize: 18, color: '#a5a5a5', marginTop: 16}}>Resultados do período comparados com o anterior.</div>
            <div style={{display: 'flex', gap: 10, marginTop: 28}}>
              {['YouTube', 'Newsletter', 'LinkedIn', 'Indicações'].map((c, i) => {
                const m = useMola(557.5 + i * 0.25);
                return (
                  <span key={c} style={{fontSize: 15, padding: '6px 14px', borderRadius: 20, border: '1px solid #444', color: '#ddd', opacity: m}}>
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
        </Artefato>
        <Cursor pts={[[558.6, 900, 500], [559.8, 1120, 28], [561.4, 1215, 28], [562.3, 1200, 68]]} cliques={[560.3, 561.8]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 6.6 · Documento com abas (563,2–573,4), câmera D ----------
export const C6_6: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [563.2, 1.25, 950, 432, 0.01],
        [568.6, 1.55, 640, 300, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} />}>
        <Artefato titulo="Claude Code 2.0: roteiro final" pedido="Separe o roteiro e a lista de tomadas em abas." resposta="Separei em duas abas. A equipe e os agentes editam o mesmo documento.">
          <Documento abas abaAtiva={t >= 572.0 ? 1 : 0} cursores={t > 566.3} trocado />
        </Artefato>
        <Cursor pts={[[569.0, 700, 400], [571.4, 480, 138]]} cliques={[571.9]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 6.7 · Design em um canvas (573,4–588,7), câmera D ----------
const Prancheta: React.FC<{x: number; titulo: string; children: React.ReactNode; destaque?: boolean}> = ({x, titulo, children, destaque}) => (
  <div style={{position: 'absolute', left: x, top: 92}}>
    <div style={{fontFamily: FONTE.ui, fontSize: 11.5, color: '#8a8478', marginBottom: 6}}>{titulo}</div>
    <div style={{width: 230, height: 330, background: '#161616', borderRadius: 8, padding: 18, fontFamily: FONTE.ui, color: '#FAF9F5', boxShadow: destaque ? `0 0 0 3px ${COR.terra}` : '0 8px 20px rgba(0,0,0,.18)'}}>{children}</div>
  </div>
);
export const C6_7: React.FC = () => {
  const t = useAgora();
  const novaOpcao = useMola(587.0);
  const pin = useMola(585.7);
  const txt = useDigitado('Todas as suas skills em um só lugar.', 583.7, 584.8);
  return (
    <App
      focos={[
        [573.4, 1, 735, 432],
        [574.4, 1.35, 1000, 400, 0.8],
        [583.4, 1.55, 1000, 330, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} />}>
        <Artefato
          titulo="Fluxo do material gratuito"
          pedido="Crie três versões da tela inicial do material gratuito."
          resposta="Fiz três versões lado a lado no canvas. Comente em qualquer uma que eu ajusto."
          fundo="#EDEBE5"
          ferramentas={<span style={{color: APP.apagado, fontSize: 13}}>Página 1 · 23%</span>}
        >
          <div style={{position: 'absolute', left: 20, top: 16, fontFamily: FONTE.ui, fontSize: 15, fontWeight: 600, color: '#1F1E1D'}}>Tela inicial: três versões</div>
          <Prancheta x={20} titulo="Versão A">
            <div style={{fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 40}}>{t < 583.7 ? 'Todas as suas skills do Claude em um só lugar.' : txt.texto}</div>
            {txt.digitando && <span style={{display: 'inline-block', width: 2, height: 20, background: '#fff'}} />}
          </Prancheta>
          <Prancheta x={270} titulo="Versão B" destaque={t > 585.7 && t < 588.2}>
            <div style={{fontSize: 19, fontWeight: 700, lineHeight: 1.2}}>Qual opção combina com você?</div>
            <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5}}>
              <span style={{background: '#2a2a2a', borderRadius: 7, padding: '8px 10px'}}>Quero começar um negócio com IA</span>
              <span style={{background: '#2a2a2a', borderRadius: 7, padding: '8px 10px', opacity: novaOpcao, transform: `translateY(${(1 - novaOpcao) * 8}px)`}}>Quero automatizar meu trabalho</span>
            </div>
          </Prancheta>
          <Prancheta x={520} titulo="Versão C">
            <div style={{fontSize: 22, fontWeight: 700, lineHeight: 1.15, marginTop: 40}}>
              Todos os nossos melhores recursos. <span style={{color: '#E8C468'}}>Grátis.</span>
            </div>
          </Prancheta>
          {t >= 585.7 && t < 587.6 && (
            <div style={{position: 'absolute', left: 330, top: 300, width: 300, background: '#fff', borderRadius: 12, padding: 12, fontFamily: FONTE.ui, fontSize: 14, color: '#1F1E1D', boxShadow: '0 16px 40px rgba(0,0,0,.25)', opacity: pin}}>
              <span style={{color: COR.terra, fontWeight: 600}}>@Claude</span> Adicione a segunda opção
              <div style={{fontSize: 12.5, color: '#6B675C', marginTop: 8}}>☑ Enviar ao Claude</div>
            </div>
          )}
        </Artefato>
        <Cursor pts={[[576.0, 900, 500], [583.3, 560, 210], [585.2, 760, 330]]} cliques={[583.6, 585.6]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 6.8 · Motion: vídeo feito com código (588,7–608,9), câmera D ----------
export const C6_8: React.FC = () => {
  const t = useAgora();
  const loop = ((t - 588.7) % 6) / 6;
  const linha = useEm(605.4, 0.9);
  const codigo = useMola(596.0);
  const com = useMola(602.6);
  const barras = [0.35, 0.55, 0.48, 0.8, 0.92];
  const cresce = interpolate(loop, [0.1, 0.5], [0, 1], {...clamp, easing: suave});
  return (
    <App
      focos={[
        [588.7, 1, 735, 432],
        [589.6, 1.35, 1000, 430, 0.8],
        [602.2, 1.5, 1000, 470, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} />}>
        <Artefato titulo="Regra dos 6: vídeo curto" pedido="Faça um vídeo vertical de 30 segundos sobre a regra dos 6." resposta="Montei a animação em código. Comente na tela para ajustar." fundo="#EDEBE5">
          <div style={{position: 'absolute', left: 60, top: 30, width: 300, height: 533, background: '#0f0f0f', borderRadius: 14, overflow: 'hidden', fontFamily: FONTE.ui, color: '#fff', padding: 26}}>
            <div style={{fontSize: 22, fontWeight: 700, lineHeight: 1.15}}>
              Pedir para o modelo <span style={{color: '#E8C468'}}>conferir a própria resposta</span>
            </div>
            <svg width={248} height={240} style={{marginTop: 40}}>
              {linha < 1 &&
                barras.map((b, i) => (
                  <rect key={i} x={10 + i * 48} y={220 - 200 * b * cresce} width={34} height={200 * b * cresce} rx={4} fill="#E8C468" opacity={1 - linha} />
                ))}
              {linha > 0 && (
                <path
                  d={barras.map((b, i) => `${i ? 'L' : 'M'}${27 + i * 48},${220 - 200 * b * cresce}`).join(' ')}
                  fill="none"
                  stroke="#E8C468"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={400}
                  strokeDashoffset={400 * (1 - linha)}
                />
              )}
            </svg>
            <div style={{position: 'absolute', left: 20, right: 20, bottom: 18, height: 4, borderRadius: 2, background: '#333'}}>
              <div style={{width: `${loop * 100}%`, height: '100%', borderRadius: 2, background: '#fff'}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 400, top: 40, width: 400, background: '#1e1e1e', borderRadius: 12, padding: '14px 16px', fontFamily: FONTE.mono, fontSize: 13, color: '#cfcfcd', lineHeight: 1.6, opacity: codigo, transform: `translateY(${(1 - codigo) * 12}px)`}}>
            <span style={{color: '#8a8478'}}>{'// sem modelo de vídeo: só código'}</span>
            <br />
            {'<div class="grafico">'}
            <br />
            {'  '}
            <span style={{color: COR.terra}}>animate</span>
            {'(".barra", { altura: "92%" },'}
            <br />
            {'    { duracao: 1.2 })'}
            <br />
            {'</div>'}
          </div>
          {t >= 602.6 && t < 606.6 && (
            <div style={{position: 'absolute', left: 400, top: 260, width: 380, background: '#fff', borderRadius: 12, padding: 12, fontFamily: FONTE.ui, fontSize: 14.5, color: '#1F1E1D', boxShadow: '0 16px 40px rgba(0,0,0,.25)', opacity: com}}>
              <span style={{color: COR.terra, fontWeight: 600}}>@Claude</span> Troque o gráfico de barras por um de linhas
            </div>
          )}
        </Artefato>
        <Cursor pts={[[597.0, 1000, 500], [602.2, 820, 420]]} cliques={[602.5]} />
      </JanelaApp>
    </App>
  );
};

