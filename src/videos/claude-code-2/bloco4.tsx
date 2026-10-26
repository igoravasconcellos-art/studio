import React from 'react';
import {Caixa, Conversa, Cursor, Ferramenta, Icone, JanelaApp, Lateral, Menu, MsgClaude, MsgUsuario, Trabalhando} from '../../estilos/demo-tutorial/app';
import {APP, COR, Cartela, Chip, FONTE, useAgora, useDigitado, useEm, useMola} from './base';
import {App, ConversaRelatorio, N, ORGANIZADA} from './comum';
import {Folha, TituloDiagrama} from '../../estilos/demo-tutorial/diagrama';
import {MENU} from './bloco2';

const BARRA = ORGANIZADA([], 0);

// ---------- chat lateral: coluna à direita com abas, histórico próprio e caixa própria ----------
const ChatLateral: React.FC<{em: number; abas: string[]; ativa: number; abaNovaEm?: number; children?: React.ReactNode; caixa?: React.ReactNode; rodape?: React.ReactNode}> = ({
  em,
  abas,
  ativa,
  abaNovaEm,
  children,
  caixa,
  rodape,
}) => {
  const t = useAgora();
  const p = useEm(em, 0.55);
  const nova = useMola(abaNovaEm ?? 1e9);
  const visiveis = abas.filter((_, i) => i === 0 || t >= (abaNovaEm ?? -1));
  return (
    <div style={{width: 440 * p, overflow: 'hidden', flexShrink: 0, borderLeft: `1px solid ${APP.linha}`, background: '#232323'}}>
      <div style={{width: 440, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FONTE.ui}}>
        <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderBottom: `1px solid ${APP.linha}`}}>
          {visiveis.map((a, i) => (
            <div
              key={a}
              style={{
                padding: '6px 11px',
                borderRadius: 8,
                fontSize: 13.5,
                color: i === ativa ? APP.texto : APP.apagado,
                background: i === ativa ? APP.sel : 'transparent',
                opacity: i > 0 ? nova : 1,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {a}
              <span style={{color: APP.fraco}}>×</span>
            </div>
          ))}
          <Icone n="mais" t={16} cor={APP.apagado} style={{marginLeft: 4}} />
          <div style={{flex: 1}} />
          <Icone n="lado" t={16} cor={APP.apagado} />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14, padding: '0 20px 14px', overflow: 'hidden'}}>{children}</div>
        {rodape}
        {caixa ?? <Caixa placeholder="Faça uma pergunta à parte" rodape={false} />}
      </div>
    </div>
  );
};

const AVISO = 'Pergunte sobre esta sessão. O chat lateral lê o histórico principal até agora. Nada do que você disser aqui entra nele.';

// ---------- 4.1 · Cartela 03/07 (404,4–411,3) ----------
export const C4_1: React.FC = () => <Cartela em={404.5} num={3} titulo={<>Conversas laterais</>} sub="o side chat: pergunte sem parar a tarefa" />;

// ---------- 4.2–4.3 · Tarefa rodando e o chat lateral (411,3–438,4), câmera D ----------
const FEITOS_RODANDO = [0, 415.0, 431.3, 1e9, 1e9];
export const C4_2: React.FC = () => {
  const t = useAgora();
  const aberto = t >= 428.0;
  return (
    <App
      focos={[
        [411.3, 1, 735, 432],
        [413.2, 1.5, 620, 540, 0.8],
        [418.6, 1, 735, 432, 0.8],
        [424.6, 1.7, 1260, 160, 0.8],
        [428.6, 1.2, 1000, 432, 0.8],
        [433.4, 1.9, 1250, 90, 0.7],
        [436.6, 1.2, 1000, 432, 0.7],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={BARRA} sel="rel" />}
        overlay={
          <Menu
            em={425.3}
            ate={427.9}
            x={1170}
            y={48}
            w={280}
            hover={t > 427.2 ? 0 : -1}
            itens={[{t: 'Chat lateral', atalho: '⌘;'}, {t: 'Simulador de iOS'}, {t: '', sep: true}, {t: 'Manter computador ativo', desc: 'Apenas para esta sessão'}]}
          />
        }
      >
        <ConversaRelatorio final={false} feitos={FEITOS_RODANDO} hoverPontos={t > 424.8 && t < 427.9} extra={<Trabalhando texto={t < 431.3 ? 'Buscando os números no controle' : 'Conferindo e-mails e Slack'} />} />
        {aberto && (
          <ChatLateral em={428.9} abas={['Chat lateral', 'Chat lateral 2']} ativa={t >= 434.5 ? 1 : 0} abaNovaEm={434.5}>
            <div style={{fontSize: 14, color: APP.apagado, lineHeight: 1.5}}>{AVISO}</div>
          </ChatLateral>
        )}
        <Cursor
          pts={[
            [418.8, 700, 500],
            [424.6, 1449, 28],
            [426.9, 1260, 66],
            [432.6, 1300, 300],
            [433.6, (aberto ? 1030 : 1300) + 262, 28],
          ]}
          cliques={[425.0, 427.8, 433.9]}
        />
      </JanelaApp>
    </App>
  );
};

// ---------- 4.4 · Como um /btw (438,4–445,2), câmera G ----------
export const C4_4: React.FC = () => (
  <>
    <TituloDiagrama em={438.5}>
      Como um <span style={{fontFamily: FONTE.mono, color: COR.terra}}>/btw</span>
    </TituloDiagrama>
    <Folha em={439.3} x={90} y={220} w={520} style={{background: '#1E1E1E', border: '1px solid #333', padding: 0, overflow: 'hidden'}}>
      <div style={{height: 38, background: '#2a2a2a', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, fontSize: 16, color: '#aaa'}}>
        <Icone n="terminal" t={18} cor="#aaa" /> terminal · VS Code
      </div>
      <div style={{padding: '20px 22px', fontFamily: FONTE.mono, fontSize: 21, color: '#ddd', lineHeight: 1.6}}>
        <span style={{color: COR.terra}}>&gt;</span> /btw quanto falta no relatório?
        <div style={{color: '#888', fontSize: 18, marginTop: 8}}>Faça uma pergunta rápida à parte sem adicioná-la à sessão</div>
      </div>
    </Folha>
    <Folha em={441.5} x={660} y={220} w={540} style={{padding: '22px 26px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <Icone n="chat" t={30} cor={COR.terra} />
        <span style={{fontSize: 34, fontWeight: 600, letterSpacing: -0.8}}>Chat lateral</span>
      </div>
      <div style={{fontSize: 24, color: COR.cinza, marginTop: 14, lineHeight: 1.4}}>a mesma ideia, numa janela própria: várias abas, histórico e resposta completa</div>
    </Folha>
    <Chip em={444.0} texto="no terminal você já usava assim" tamanho={26} style={{left: 90, top: 520}} />
  </>
);

// ---------- 4.5–4.6 · Perguntas no chat lateral (445,2–471,4), câmera D ----------
const P1 = 'Revise o trabalho feito até agora e faça um resumo. Quanto falta?';
const P2 = 'Me dê três assuntos para a newsletter de sexta.';
export const C4_5: React.FC = () => {
  const t = useAgora();
  const d1 = useDigitado(P1, 451.4, 454.4);
  const d2 = useDigitado(P2, 462.8, 464.1);
  const env1 = t >= 454.7;
  const env2 = t >= 464.4;
  const aba2 = t >= 458.5;
  const zero = useMola(456.4);
  const caixa = aba2 ? <Caixa placeholder="Faça uma pergunta à parte" rodape={false} texto={env2 ? '' : d2.texto} digitando={d2.digitando && !env2} /> : <Caixa placeholder="Faça uma pergunta à parte" rodape={false} texto={env1 ? '' : d1.texto} digitando={d1.digitando && !env1} />;
  return (
    <App
      focos={[
        [445.2, 1.25, 1000, 432, 0.01],
        [446.6, 1.7, 1250, 420, 0.8],
        [451.0, 1.7, 1250, 700, 0.6],
        [455.0, 1.6, 1250, 520, 0.6],
        [458.6, 1.6, 1250, 640, 0.6],
        [464.6, 1.6, 1250, 540, 0.6],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} sel="rel" />}>
        <ConversaRelatorio final={false} feitos={[0, 0, 0, 1e9, 1e9]} extra={<Trabalhando texto="Escrevendo o relatório" />} />
        <ChatLateral
          em={-10}
          abas={['Chat lateral', 'Chat lateral 2']}
          ativa={aba2 ? 1 : 0}
          abaNovaEm={-10}
          caixa={caixa}
          rodape={
            !aba2 && t >= 456.4 ? (
              <div style={{margin: '0 20px 10px', padding: '7px 12px', borderRadius: 8, background: 'rgba(141,187,118,.14)', color: APP.verde, fontSize: 13.5, opacity: zero}}>
                0 tokens adicionados ao contexto principal
              </div>
            ) : undefined
          }
        >
          {!aba2 ? (
            <>
              <div style={{fontSize: 14, color: APP.apagado, lineHeight: 1.5, background: t > 446.8 && t < 450.6 ? 'rgba(217,119,87,.16)' : 'transparent', borderRadius: 6, padding: 4, margin: -4}}>{AVISO}</div>
              {env1 && (
                <>
                  <MsgUsuario em={454.7}>{P1}</MsgUsuario>
                  <Ferramenta em={455.0} texto="Leu a transcrição da sessão" />
                  <MsgClaude em={455.4} style={{fontSize: 14.5}}>
                    O relatório semanal está na <b>tarefa 4 de 5</b>.
                    <ul style={{margin: '6px 0', paddingLeft: 18}}>
                      <li>Leu o relatório anterior para manter as quatro seções.</li>
                      <li>Buscou os números: 3 de 4 automações no ar, 41 horas economizadas.</li>
                      <li>Conferiu os e-mails do cliente e o Slack.</li>
                    </ul>
                    <b>Falta:</b> cerca de seis minutos.
                  </MsgClaude>
                </>
              )}
            </>
          ) : (
            env2 && (
              <>
                <MsgUsuario em={464.4}>{P2}</MsgUsuario>
                <MsgClaude em={465.0} style={{fontSize: 14.5}}>
                  <ol style={{margin: 0, paddingLeft: 20}}>
                    <li>Três resultados de clientes nesta semana</li>
                    <li>O que entregamos para a Northwind Logistics</li>
                    <li>O resumo de IA de sexta-feira</li>
                  </ol>
                </MsgClaude>
              </>
            )
          )}
        </ChatLateral>
      </JanelaApp>
    </App>
  );
};

// ---------- 4.7 · A revisão volta para o chat principal (471,4–480,9), câmera E ----------
export const C4_7: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [471.4, 1.5, 1250, 520, 0.01],
        [477.2, 1.45, 560, 600, 0.9],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA} sel="rel" />}>
        <ConversaRelatorio
          final={false}
          feitos={[0, 0, 0, 0, 1e9]}
          extra={
            t >= 477.6 && (
              <>
                <Ferramenta em={477.6} texto="Mensagem do chat lateral" />
                <MsgUsuario em={477.8}>Acrescentar ao relatório a comparação com os números da semana passada.</MsgUsuario>
                <MsgClaude em={479.6}>Certo. Vou incluir a comparação antes de conferir os números.</MsgClaude>
              </>
            )
          }
        />
        <ChatLateral em={-10} abas={['Chat lateral', 'Chat lateral 2']} ativa={0} abaNovaEm={-10}>
          <MsgUsuario>Revise o relatório antes de ele ir para o cliente.</MsgUsuario>
          <MsgClaude em={471.8} style={{fontSize: 14.5}}>
            Conferi os números com o controle e as quatro seções estão no lugar.
            <br />
            <span style={{background: t > 474.6 ? 'rgba(217,119,87,.25)' : 'transparent', borderRadius: 4}}>Falta uma coisa: o relatório não compara com a semana anterior.</span>
          </MsgClaude>
          <Ferramenta em={476.9} texto="Enviou ao chat principal" />
        </ChatLateral>
      </JanelaApp>
    </App>
  );
};

// ---------- tela dividida: colunas independentes, uma barra lateral só ----------
const COLUNAS: Record<string, {titulo: string; pedido: string; resposta: string}> = {
  rel: {titulo: N.rel, pedido: 'Use o controle atual e o relatório da semana passada.', resposta: 'Mantive o formato da semana passada: números primeiro, depois os destaques e os próximos passos.'},
  cal: {titulo: N.cal, pedido: 'Confira o que publicamos no 4º trimestre.', resposta: 'Publicamos 38 vídeos e 11 newsletters. Os tutoriais do Claude Code foram os que mais performaram.'},
  prop: {titulo: N.prop, pedido: 'Use as notas da reunião e o modelo de proposta.', resposta: 'Rascunhei a proposta da Brightline Dental com o escopo combinado na reunião e três opções de prazo.'},
};
const Coluna: React.FC<{k: keyof typeof COLUNAS; em?: number; primeira?: boolean}> = ({k, em = -10, primeira}) => {
  const p = useEm(em, 0.6);
  const c = COLUNAS[k];
  return (
    <div style={{flex: p, minWidth: 0, display: 'flex', borderLeft: primeira ? 'none' : `1px solid ${APP.linha}`, overflow: 'hidden', opacity: Math.min(1, p * 1.5)}}>
      <Conversa titulo={c.titulo} caixa={<Caixa rodape={false} />}>
        <MsgUsuario>{c.pedido}</MsgUsuario>
        <MsgClaude>{c.resposta}</MsgClaude>
        <Trabalhando texto="Trabalhando" />
      </Conversa>
    </div>
  );
};

// ---------- 5.1 · Cartela 04/07 (480,9–483,7) ----------
export const C5_1: React.FC = () => <Cartela em={481.0} num={4} titulo={<>Tela dividida</>} sub="várias conversas na mesma tela" />;

// ---------- 5.2 · Lado a lado (483,7–493,8), câmera H ----------
export const C5_2: React.FC = () => (
  <App focos={[[483.7, 1, 735, 432]]}>
    <JanelaApp lateral={<Lateral secoes={BARRA} sel="rel" />}>
      <Coluna k="rel" primeira />
      <Coluna k="cal" em={487.6} />
    </JanelaApp>
  </App>
);

// ---------- 5.3 · Arrastar da barra lateral (493,8–501,3), câmera H ----------
// "Calendário de conteúdo" fica em "Este computador", y 703.
export const C5_3: React.FC = () => {
  const t = useAgora();
  const arr = t >= 494.7 && t < 500.6;
  const pa = useEm(494.7, 3.6);
  const alvo = useEm(498.6, 0.3);
  const gx = 30 + (900 - 30) * pa;
  const gy = 703 + (400 - 703) * pa;
  return (
    <App
      focos={[
        [493.8, 1, 735, 432],
        [494.0, 1.3, 600, 560, 0.7],
        [497.4, 1, 735, 432, 1.0],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={BARRA} sel="rel" hover={t > 494.2 && t < 494.8 ? 'cal' : undefined} />}
        overlay={
          <>
            {arr && t >= 498.6 && (
              <div style={{position: 'absolute', left: 254 + 608, top: 56, width: 608, height: 808, background: `rgba(76,141,219,${0.16 * alvo})`, border: `2px solid rgba(76,141,219,${0.7 * alvo})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{background: COR.azul, color: '#fff', fontFamily: FONTE.ui, fontSize: 15, fontWeight: 600, padding: '8px 14px', borderRadius: 10, opacity: alvo}}>Dividir à direita</span>
              </div>
            )}
            {arr && (
              <div style={{position: 'absolute', left: gx - 12, top: gy - 16, width: 230, height: 32, borderRadius: 8, background: 'rgba(70,70,70,.92)', boxShadow: '0 10px 24px rgba(0,0,0,.5)', color: APP.texto, fontSize: 14.5, display: 'flex', alignItems: 'center', padding: '0 10px', fontFamily: FONTE.ui, transform: 'rotate(-1.5deg)'}}>
                {N.cal}
              </div>
            )}
          </>
        }
      >
        <Coluna k="rel" primeira />
        <Coluna k="cal" em={t >= 500.6 ? 500.6 : 1e9} />
        <Cursor pts={[[494.0, 300, 600], [494.6, 60, 703], [498.3, 900, 400], [500.6, 1000, 420]]} cliques={[500.6]} arrasto={[494.7, 500.6]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 5.4 · Três pontos › Abrir em › Tela dividida (501,3–511,2), câmera H ----------
// "Proposta Brightline Dental" em Clientes, y 445; ⋯ em x 229.
const SUB_ABRIR = [
  {t: 'Tela dividida'},
  {t: 'Nova janela', atalho: '1'},
  {t: '', sep: true},
  {t: 'Abrir em', titulo: true},
  {t: 'VS Code', atalho: '2'},
  {t: 'Finder', atalho: '3'},
  {t: '', sep: true},
  {t: 'Continuar em', titulo: true},
  {t: 'Nuvem', atalho: '4', desc: 'Executa sem o seu computador'},
];
export const C5_4: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [501.3, 1, 735, 432],
        [501.6, 1.55, 420, 560, 0.8],
        [506.4, 1, 735, 432, 1.0],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={BARRA} sel="rel" hover={t > 502.0 && t < 505.9 ? 'prop' : undefined} />}
        overlay={
          <>
            <Menu em={502.7} ate={505.9} x={40} y={463} w={250} itens={MENU} hover={t > 504.3 ? 0 : -1} />
            <Menu em={504.6} ate={505.9} x={294} y={466} w={250} itens={SUB_ABRIR} hover={t > 505.2 ? 0 : -1} />
          </>
        }
      >
        <Coluna k="rel" primeira />
        <Coluna k="cal" />
        <Coluna k="prop" em={t >= 506.0 ? 506.0 : 1e9} />
        <Cursor pts={[[501.6, 500, 600], [502.4, 229, 445], [504.2, 120, 480], [505.4, 360, 483], [507.2, 700, 700]]} cliques={[502.6, 505.9]} />
      </JanelaApp>
    </App>
  );
};
