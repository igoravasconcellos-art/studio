import React from 'react';
import {Img, interpolate} from 'remotion';
import {Caixa, Chave, Conversa, Cursor, Ferramenta, Icone, JanelaApp, Lateral, Menu, MsgClaude, MsgUsuario, Trabalhando} from '../../estilos/demo-tutorial/app';
import {APP, Asterisco, COR, Cartela, Chip, FONTE, arq, clamp, suave, useAgora, useDigitado, useEm, useMola} from './base';
import {App, Mono, N, ORGANIZADA} from './comum';
import {Folha, TituloDiagrama} from '../../estilos/demo-tutorial/diagrama';

const BARRA = (extra: (keyof typeof N)[] = []) => ORGANIZADA(extra, 0);

// ---------- menu de barra (como no app: nomes à esquerda, descrição ao lado do item em foco) ----------
type Cmd = [string, string];
const COMANDOS: Cmd[] = [
  ['output-style', 'Escolha como o Claude responde'],
  ['doctor', 'Verifique a instalação e audite as instruções'],
  ['skill-doctor', 'Veja quanto cada skill custa'],
  ['advisor', 'Consulte um modelo mais forte nos momentos certos'],
  ['btw', 'Faça uma pergunta rápida à parte sem adicioná-la à sessão'],
  ['rewind', 'Volte a um ponto anterior da conversa'],
  ['fork', 'Bifurque a conversa'],
  ['model', 'Troque o modelo'],
  ['plan', 'Planeje antes de mudar'],
];
const MenuBarra: React.FC<{em: number; ate?: number; hover?: number; marcados?: number; itens?: Cmd[]}> = ({em, ate = 1e9, hover = 0, marcados = 0, itens = COMANDOS}) => {
  const t = useAgora();
  const p = useEm(em, 0.18);
  if (t < em || t >= ate) return null;
  return (
    <div style={{position: 'absolute', left: 300, bottom: 104, display: 'flex', alignItems: 'flex-start', gap: 8, opacity: p, fontFamily: FONTE.ui, zIndex: 20}}>
      <div style={{width: 300, background: '#2E2E2E', border: `1px solid ${APP.linha}`, borderRadius: 12, padding: 6, boxShadow: '0 18px 50px rgba(0,0,0,.55)'}}>
        {itens.map(([c], i) => (
          <div key={c} style={{display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 7, fontSize: 14.5, color: APP.texto, background: i === hover ? '#414141' : 'transparent'}}>
            {c}
            <div style={{flex: 1}} />
            {i < marcados && <span style={{width: 8, height: 8, borderRadius: 4, background: COR.terra}} />}
          </div>
        ))}
      </div>
      <div style={{marginTop: 6 + hover * 33, maxWidth: 270, background: '#2E2E2E', border: `1px solid ${APP.linha}`, borderRadius: 9, padding: '7px 11px', fontSize: 13.5, color: APP.texto, lineHeight: 1.35}}>{itens[hover][1]}</div>
    </div>
  );
};

// ---------- 7.1 · Cartela 06/07 (608,9–613,6) ----------
export const C7_1: React.FC = () => <Cartela em={609.0} num={6} titulo={<>Comandos de barra</>} sub="atalhos que começam com /" />;

// ---------- 7.2 · O menu de barra (613,8–624,8), câmera D › G › D ----------
export const C7_2: React.FC = () => {
  const t = useAgora();
  const d = useDigitado('/', 617.0, 617.05);
  const marcados = Math.max(0, Math.min(4, Math.floor(interpolate(t, [617.9, 619.5], [0, 4.99], clamp))));
  return (
    <App
      focos={[
        [613.8, 1, 735, 432],
        [616.6, 1.55, 560, 560, 0.8],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA(['leads'])} sel="leads" />} overlay={<MenuBarra em={617.1} hover={Math.max(0, marcados - 1)} marcados={marcados} />}>
        <Conversa titulo={N.leads} caixa={<Caixa texto={d.texto} digitando={t > 616.4} />}>
          <MsgUsuario>Ajuste o script de pontuação de leads com o que combinamos na reunião.</MsgUsuario>
          <MsgClaude>Ajustei o script. Agora o peso de cada ação segue a tabela que você mandou e os leads parados perdem pontos com o tempo.</MsgClaude>
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 7.3–7.4 · /output-style e um estilo próprio (624,8–651,8), câmera D ----------
const ESTILOS: [string, string][] = [
  ['Padrão', 'O Claude como sempre'],
  ['Conciso', 'Respostas diretas'],
  ['Explicativo', 'Explica o porquê das escolhas'],
  ['Aprendizado', 'Ensina enquanto faz'],
  ['ELI5', 'Respostas curtas e simples'],
];
const PERGUNTA = 'O que mudou na pontuação de leads?';
const PEDIDO_ESTILO = 'Crie um estilo de resposta com frases curtas, palavras simples e uma conclusão direta.';
const Seletor: React.FC<{em: number; sel: number; extra?: boolean; novoEm?: number}> = ({em, sel, extra, novoEm}) => {
  const m = useMola(em);
  const n = useMola(novoEm ?? 1e9);
  const lista = extra ? [...ESTILOS, ['Direto', 'Frases curtas e conclusão direta'] as [string, string]] : ESTILOS;
  return (
    <div style={{border: `1px solid ${APP.bordaCartao}`, borderRadius: 12, background: '#2a2a2a', padding: '10px 12px', fontSize: 14.5, opacity: m, transform: `translateY(${(1 - m) * 12}px)`}}>
      <div style={{color: APP.apagado, fontSize: 13.5, padding: '2px 6px 8px'}}>Escolha um estilo de resposta. Vale para esta sessão.</div>
      {lista.map(([a, b], i) => (
        <div key={a} style={{display: 'flex', gap: 12, alignItems: 'center', padding: '7px 8px', borderRadius: 8, background: i === sel ? 'rgba(217,119,87,.16)' : 'transparent', border: i === sel ? `1px solid ${COR.terra}` : '1px solid transparent', opacity: i === 5 ? n : 1}}>
          <span style={{width: 110, color: APP.texto}}>{a}</span>
          <span style={{color: APP.apagado, fontSize: 13.5}}>{b}</span>
        </div>
      ))}
    </div>
  );
};
export const C7_3: React.FC = () => {
  const t = useAgora();
  const cmd = useDigitado('/output-style', 625.9, 626.9);
  const perg = useDigitado(PERGUNTA, 636.6, 638.6);
  const est = useDigitado(PEDIDO_ESTILO, 642.0, 645.0);
  const cmd2 = useDigitado('/output-style', 648.6, 649.2);
  const fase = t < 627.4 ? 0 : t < 638.9 ? 1 : t < 641.4 ? 2 : t < 645.3 ? 3 : t < 649.4 ? 4 : 5;
  const caixa =
    fase === 0 ? <Caixa texto={cmd.texto} digitando /> : fase === 1 && t >= 636.4 ? <Caixa texto={perg.texto} digitando /> : fase === 3 ? <Caixa texto={est.texto} digitando /> : fase === 4 && t >= 648.4 ? <Caixa texto={cmd2.texto} digitando /> : <Caixa />;
  const resumo = useEm(640.3, 0.5);
  return (
    <App
      focos={[
        [624.8, 1.5, 700, 700, 0.6],
        [627.6, 1.55, 760, 560, 0.6],
        [636.4, 1.55, 760, 700, 0.6],
        [639.2, 1.5, 760, 560, 0.6],
        [641.6, 1.55, 760, 720, 0.6],
        [645.6, 1.5, 760, 600, 0.6],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA(['leads'])} sel="leads" />}>
        <Conversa titulo={N.leads} caixa={caixa}>
          {fase >= 1 && fase <= 2 && (
            <>
              <MsgUsuario em={627.6}>/output-style</MsgUsuario>
              <Seletor em={627.8} sel={t >= 632.6 ? 4 : 0} />
              {t >= 633.8 && <Ferramenta em={633.8} texto="Estilo de resposta: ELI5" />}
            </>
          )}
          {fase === 2 && (
            <>
              <MsgUsuario em={638.9}>{PERGUNTA}</MsgUsuario>
              <MsgClaude em={639.4}>
                Mudei três coisas para os melhores leads aparecerem primeiro. Abrir um e-mail agora conta menos. Agendar uma reunião ou visitar a página de preços conta mais. Lead parado há 60
                dias perde pontos.
                <div style={{marginTop: 8}}>
                  <span style={{backgroundImage: 'linear-gradient(rgba(232,196,104,.35), rgba(232,196,104,.35))', backgroundRepeat: 'no-repeat', backgroundSize: `${resumo * 100}% 100%`}}>
                    Em resumo: quem tem mais chance de comprar agora fica no topo.
                  </span>
                </div>
              </MsgClaude>
            </>
          )}
          {fase >= 4 && (
            <>
              <MsgUsuario>{PEDIDO_ESTILO}</MsgUsuario>
              <Ferramenta em={645.8} texto="Criou output-styles/direto.md" />
              <MsgClaude em={646.3}>
                Pronto. O estilo <b>Direto</b> já aparece no <Mono>/output-style</Mono>.
              </MsgClaude>
              {fase === 5 && <Seletor em={649.4} sel={5} extra novoEm={649.8} />}
            </>
          )}
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 7.5 · /doctor prompt-audit e o CLAUDE.md (651,8–667,0), câmera G ----------
export const C7_5: React.FC = () => {
  const t = useAgora();
  const cmd = useDigitado('/doctor prompt-audit', 652.6, 654.8);
  const env = t >= 655.0;
  return (
    <>
      <App focos={[[651.8, 1.5, 760, 640, 0.01]]}>
        <JanelaApp lateral={<Lateral secoes={BARRA(['audit'])} sel="audit" />}>
          <Conversa titulo={env ? N.audit : 'Nova sessão'} caixa={<Caixa texto={env ? '' : cmd.texto} digitando={!env} />}>
            {env && (
              <>
                <MsgUsuario em={655.0}>/doctor prompt-audit</MsgUsuario>
                <Trabalhando em={655.6} texto="Lendo as instruções" />
              </>
            )}
          </Conversa>
        </JanelaApp>
      </App>
      <Folha em={662.3} x={200} y={250} w={620} style={{padding: '28px 32px', boxShadow: '0 30px 70px rgba(30,20,10,.4)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Icone n="doc" t={46} cor={COR.terra} />
          <span style={{fontFamily: FONTE.mono, fontSize: 40, fontWeight: 500}}>CLAUDE.md</span>
        </div>
        <div style={{fontSize: 28, marginTop: 14, lineHeight: 1.35}}>o arquivo de instruções que o Claude lê no começo de cada conversa</div>
        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          {['skills', 'configurações', 'comandos'].map((x, i) => (
            <span key={x} style={{fontSize: 22, padding: '6px 14px', borderRadius: 10, border: `1.5px solid ${COR.borda}`, color: COR.cinza, opacity: useEm(663.6 + i * 0.3, 0.3)}}>
              {x}
            </span>
          ))}
        </div>
      </Folha>
      <Chip em={659.3} texto="escritos para modelos antigos" tom="terra" tamanho={28} style={{left: 50, top: 40}} />
    </>
  );
};

// ---------- 7.6–7.7 · A auditoria roda e o resultado (667,0–699,2), câmera D ----------
export const C7_6: React.FC = () => {
  const t = useAgora();
  const fim = t >= 679.6;
  const n404 = useEm(680.5, 0.4);
  const n312 = useEm(682.8, 0.4);
  const nota = useEm(686.6, 0.4);
  return (
    <App
      focos={[
        [667.0, 1.45, 760, 600, 0.01],
        [679.4, 1.6, 760, 470, 0.7],
        [684.0, 1.5, 760, 640, 0.8],
        [695.6, 1, 735, 432, 1.0],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA(['audit'])} sel="audit" />}>
        <Conversa titulo={N.audit}>
          {!fim ? (
            <>
              <MsgUsuario>/doctor prompt-audit</MsgUsuario>
              <MsgClaude em={667.2}>Iniciando a auditoria. O escopo é grande: 96 arquivos de instrução, 287 skills, 14 comandos e 7 estilos de resposta. Vou dividir a leitura entre agentes auxiliares.</MsgClaude>
              <Ferramenta em={668.4} texto="Iniciou 6 agentes auxiliares" />
              <MsgClaude em={670.4}>Enquanto eles leem, eu audito os arquivos pequenos: o CLAUDE.md global, as importações e as configurações.</MsgClaude>
              <Ferramenta em={674.2} texto="Minha parte terminou: 18 achados" />
              <Ferramenta em={676.4} texto="Primeiro lote de skills: 64 achados · 5 agentes ainda trabalhando" />
              <Trabalhando em={676.8} texto="Procurando instruções velhas" />
            </>
          ) : (
            <>
              <MsgClaude>
                <b>Auditoria concluída.</b> Não alterei nenhum dos arquivos auditados.
                <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
                  <li>
                    Verifiquei <b style={{color: n404 > 0 ? COR.terra : APP.texto, fontSize: 15 + 5 * n404}}>404 arquivos</b> e encontrei{' '}
                    <b style={{color: n312 > 0 ? COR.terra : APP.texto, fontSize: 15 + 5 * n312}}>312 problemas</b>: 73 de alta prioridade, 154 de média e 85 de baixa.
                  </li>
                  <li>Escrevi uma proposta de correção para cada achado, com o antes e o depois.</li>
                </ul>
              </MsgClaude>
              <MsgClaude em={684.2}>
                <div style={{fontWeight: 600}}>Exemplo de alta prioridade</div>
                <div style={{fontFamily: FONTE.mono, fontSize: 13, background: '#1e1e1e', border: `1px solid ${APP.linha}`, borderRadius: 8, padding: '10px 12px', marginTop: 6, lineHeight: 1.6}}>
                  <div style={{color: '#E8826A'}}>- SEMPRE confira cada número duas vezes antes de responder.</div>
                  <div style={{color: '#E8826A'}}>- Repita as instruções em voz alta antes de começar.</div>
                  <div style={{color: '#8a8a88'}}>  40 linhas de passo a passo carregadas em toda execução</div>
                </div>
                <div style={{marginTop: 8, opacity: nota}}>O Opus 5.5 já faz isso sozinho. Essas linhas só gastam tokens e deixam a resposta mais lenta.</div>
              </MsgClaude>
            </>
          )}
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 7.8–7.9 · /skill-doctor (699,2–719,8), câmera H › D ----------
const SKILLS: [string, string, string, string, string][] = [
  ['client-onepager', 'userSettings', '~310', '46', 'Hoje'],
  ['proposal-writer', 'userSettings', '~280', '31', 'Hoje'],
  ['call-prep', 'userSettings', '~140', '22', 'Há 1 dia'],
  ['weekly-client-report', 'userSettings', '~260', '12', 'Há 2 dias'],
  ['newsletter-writer', 'userSettings', '~200', '5', 'Há 9 dias'],
  ['crm-dedupe', 'userSettings', '~240', '0', 'Nunca'],
  ['competitor-radar', 'userSettings', '~330', '0', 'Nunca'],
  ['invoice-chaser', 'userSettings', '~220', '0', 'Nunca'],
  ['firecrawl-agent', 'firecrawl', '~210', '0', 'Nunca'],
];
export const C7_8: React.FC = () => {
  const t = useAgora();
  const cmd = useDigitado('/skill-doctor', 701.0, 701.9);
  const env = t >= 702.2;
  const col = t > 709.3 && t < 711.3 ? 2 : t >= 711.3 && t < 712.1 ? 3 : -1;
  const vinte = useEm(719.0, 0.5);
  return (
    <App
      focos={[
        [699.2, 1.4, 760, 700, 0.01],
        [707.4, 1.35, 800, 420, 0.8],
        [715.8, 1.7, 800, 700, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={BARRA(['skills'])} sel="skills" />}>
        <Conversa titulo={env ? N.skills : 'Nova sessão'} caixa={<Caixa texto={env ? '' : cmd.texto} digitando={!env} />}>
          {env && (
            <>
              <MsgUsuario em={702.2}>/skill-doctor</MsgUsuario>
              <Ferramenta em={703.4} texto="Executou um comando" />
              <MsgClaude em={707.4}>
                <div style={{fontWeight: 600, marginBottom: 6}}>Skills carregadas nesta sessão</div>
                <table style={{borderCollapse: 'collapse', width: '100%', fontSize: 13.5}}>
                  <thead>
                    <tr style={{color: APP.apagado, textAlign: 'left'}}>
                      {['skill', 'origem', 'contexto (tokens)', 'usos em 30 dias', 'último uso'].map((h, i) => (
                        <th key={h} style={{fontWeight: 500, padding: '4px 8px', borderBottom: `1px solid ${APP.linha}`, color: i === col ? COR.terra : APP.apagado}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SKILLS.map((r) => {
                      const nunca = r[4] === 'Nunca' && t > 712.1;
                      return (
                        <tr key={r[0]} style={{background: nunca ? 'rgba(232,130,106,.12)' : 'transparent'}}>
                          {r.map((c, i) => (
                            <td key={i} style={{padding: '4px 8px', borderBottom: `1px solid #333`, fontFamily: i === 0 ? FONTE.mono : undefined, fontSize: i === 0 ? 12.5 : 13.5, color: nunca && i === 4 ? '#E8826A' : i === col ? COR.terra : APP.texto}}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </MsgClaude>
              <MsgClaude em={712.8}>
                84 skills carregadas e nunca usadas nos últimos 30 dias. Juntas, ocupam{' '}
                <span style={{backgroundImage: 'linear-gradient(rgba(232,196,104,.35), rgba(232,196,104,.35))', backgroundRepeat: 'no-repeat', backgroundSize: `${vinte * 100}% 100%`, fontWeight: 600}}>
                  cerca de 20.000 tokens
                </span>{' '}
                de contexto em toda conversa. Recomendo desativar as 52 skills suas sem uso e os plugins que somam outras 32.
              </MsgClaude>
            </>
          )}
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 7.10 · /advisor opus (719,8–724,8), câmera D ----------
export const C7_10: React.FC = () => {
  const t = useAgora();
  const cmd = useDigitado('/advisor opus', 720.9, 721.8);
  const env = t >= 722.0;
  return (
    <App focos={[[719.8, 1.55, 760, 640, 0.01]]}>
      <JanelaApp lateral={<Lateral secoes={BARRA(['inbox'])} sel="inbox" />}>
        <Conversa titulo={N.inbox} caixa={<Caixa texto={env ? '' : cmd.texto} digitando={!env} />}>
          <MsgUsuario>Organize minha caixa de entrada dos últimos 30 dias.</MsgUsuario>
          {env && (
            <>
              <MsgUsuario em={722.0}>/advisor opus</MsgUsuario>
              <Ferramenta em={722.4} texto="Consultor definido como Opus 5.5" />
            </>
          )}
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 7.10b · Sonnet trabalha, Opus aconselha (724,8–739,1), câmera G ----------
const ETAPAS: [string, boolean][] = [
  ['Ler 42 e-mails', false],
  ['Ordenar por urgência', false],
  ['Escalonamento Northwind', true],
  ['Redigir respostas', false],
  ['Pedido de reembolso', true],
  ['Arquivar newsletters', false],
];
export const C7_10b: React.FC = () => {
  const t = useAgora();
  const pos = interpolate(t, [726.0, 737.0], [0, 5], {...clamp, easing: suave});
  const custo = useEm(734.9, 0.8);
  return (
    <>
      <TituloDiagrama em={724.9}>
        <span style={{color: '#3F7C8C'}}>Sonnet</span> trabalha, <span style={{color: COR.terra}}>Opus</span> aconselha
      </TituloDiagrama>
      <Folha em={728.6} x={760} y={170} w={330} style={{padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14}}>
        <Asterisco tamanho={40} />
        <div>
          <div style={{fontSize: 32, fontWeight: 600}}>Opus 5.5</div>
          <div style={{fontSize: 20, color: COR.cinza}}>consultor</div>
        </div>
      </Folha>
      <div style={{position: 'absolute', left: 120, top: 470, width: 1000, height: 4, background: COR.borda, borderRadius: 2}} />
      {ETAPAS.map(([n, sobe], i) => {
        const x = 120 + i * 200;
        const ativo = pos >= i - 0.05;
        const consulta = sobe && t > (i === 2 ? 729.0 : 735.6);
        return (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left: x - 13, top: 459, width: 26, height: 26, borderRadius: 13, background: ativo ? (sobe ? COR.terra : '#3F7C8C') : COR.mesaClara, border: `2px solid ${sobe ? COR.terra : '#3F7C8C'}`}} />
            <div style={{position: 'absolute', left: x - 90, top: 500, width: 180, textAlign: 'center', fontFamily: FONTE.ui, fontSize: 21, color: ativo ? COR.tinta : COR.cinza, fontWeight: sobe ? 600 : 400}}>{n}</div>
            {consulta && <div style={{position: 'absolute', left: x - 1.5, top: 255, width: 3, height: 200, background: `repeating-linear-gradient(${COR.terra} 0 8px, transparent 8px 16px)`}} />}
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 120 + pos * 200 - 60, top: 400, padding: '6px 14px', borderRadius: 10, background: '#3F7C8C', color: '#fff', fontFamily: FONTE.ui, fontWeight: 600, fontSize: 22}}>Sonnet 5.5</div>
      <div style={{position: 'absolute', left: 120, top: 680, width: 1000, opacity: custo, fontFamily: FONTE.ui}}>
        <div style={{fontSize: 22, color: COR.cinza, letterSpacing: 1.5}}>CUSTO</div>
        <div style={{display: 'flex', height: 34, borderRadius: 10, overflow: 'hidden', marginTop: 8}}>
          <div style={{flex: 8, background: '#3F7C8C'}} />
          <div style={{flex: 0.5, background: COR.terra}} />
          <div style={{flex: 6, background: '#3F7C8C'}} />
          <div style={{flex: 0.5, background: COR.terra}} />
          <div style={{flex: 3, background: '#3F7C8C'}} />
        </div>
        <div style={{fontSize: 22, marginTop: 10}}>
          o modelo forte entra <b style={{color: COR.terra}}>só duas vezes</b>
        </div>
      </div>
    </>
  );
};

// ---------- 7.11 · Caixa de entrada com advisor (739,1–753,2), câmera D ----------
export const C7_11: React.FC = () => (
  <App
    focos={[
      [739.1, 1.45, 760, 560, 0.01],
      [747.0, 1.5, 760, 640, 0.8],
    ]}
  >
    <JanelaApp lateral={<Lateral secoes={BARRA(['inbox'])} sel="inbox" />}>
      <Conversa titulo={N.inbox}>
        <MsgUsuario>
          <b style={{fontWeight: 600, fontSize: 13, letterSpacing: 0.5}}>A TAREFA</b>
          <br />
          Organize minha caixa de entrada dos últimos 30 dias. Prepare rascunhos para os clientes. Não envie nada sem a minha aprovação.
        </MsgUsuario>
        <Ferramenta em={740.2} texto="Leu 214 e-mails · Sonnet 5.5" />
        <MsgClaude em={742.4}>
          Reduzi a lista a seis conversas que alguém realmente escreveu. <b>Uma é crítica:</b> a Northwind Logistics está insatisfeita com dois relatórios semanais que não chegaram.
        </MsgClaude>
        <Ferramenta em={747.3} texto="Consultou o advisor · Opus 5.5" />
        <MsgClaude em={748.6}>Orientação: assuma a falha na primeira frase, apresente uma correção concreta e ofereça uma conversa ainda nesta semana. Não comece oferecendo desconto.</MsgClaude>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: useEm(750.8, 0.4)}}>
          <Ferramenta texto="Criou um rascunho no Gmail: Re: relatórios semanais" />
          <span style={{fontSize: 12.5, color: '#E8C468', border: '1px solid #8a7440', borderRadius: 7, padding: '2px 8px'}}>Rascunho · não enviado</span>
        </div>
      </Conversa>
    </JanelaApp>
  </App>
);

// ---------- 8.1 · Cartela 07/07 (753,2–755,8) ----------
export const C8_1: React.FC = () => <Cartela em={753.3} num={7} titulo={<>Mods</>} sub="você muda o próprio app" />;

// ---------- 8.2 · O cartão do mod (755,8–763,8), câmera Q ----------
const CartaoMod: React.FC<{ligaEm?: number; compacto?: boolean}> = ({ligaEm, compacto}) => (
  <div style={{width: 300, background: '#2E2E2E', border: `1px solid ${APP.linha}`, borderRadius: 14, padding: '14px 16px', fontFamily: FONTE.ui, color: APP.texto, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      <Icone n="mic" t={18} cor={COR.terra} />
      <span style={{fontSize: 15, fontWeight: 600}}>Organizar ditado</span>
      <div style={{flex: 1}} />
      <Chave em={ligaEm} />
    </div>
    {!compacto && (
      <>
        <div style={{fontSize: 13.5, color: '#cfcfcd', marginTop: 10, lineHeight: 1.45}}>Reescreve pedidos longos por voz em um prompt claro antes de o Claude começar.</div>
        <div style={{fontSize: 12.5, color: APP.apagado, marginTop: 10}}>
          Roda em <span style={{color: APP.texto}}>mensagens com mais de 150 palavras</span>
        </div>
        <div style={{fontSize: 12.5, color: APP.apagado, marginTop: 4}}>
          Escreve <span style={{color: APP.texto}}>Tarefa · Motivo · Restrições · Concluído</span>
        </div>
      </>
    )}
  </div>
);
export const C8_2: React.FC = () => {
  const t = useAgora();
  const solta = useMola(756.2);
  const p = interpolate(t, [760.4, 762.0], [0, 1], {...clamp, easing: suave});
  const x = 560 + (1140 - 560) * p;
  const y = 330 + (70 - 330) * p;
  return (
    <App focos={[[755.8, 1.5, 760, 420, 0.01], [760.3, 1.45, 1060, 260, 1.6]]}>
      <JanelaApp
        lateral={<Lateral secoes={BARRA()} sel="plano" />}
        overlay={
          <div style={{position: 'absolute', left: x, top: y, opacity: solta, transform: `scale(${(0.9 + 0.1 * solta) * (p > 0 && p < 1 ? 1.03 : 1)}) rotate(${p > 0 && p < 1 ? -1.5 : 0}deg)`, zIndex: 30}}>
            <CartaoMod ligaEm={762.6} />
          </div>
        }
      >
        <Conversa titulo={N.plano}>
          <MsgUsuario>Transforme o roteiro desta semana em três posts para o LinkedIn.</MsgUsuario>
          <MsgClaude>Pronto. Os três posts estão em <Mono>posts/linkedin-semana-43.md</Mono>: uma história sobre o app novo, a lista de cinco dicas e um texto curto para sexta.</MsgClaude>
        </Conversa>
        <Cursor pts={[[759.4, 700, 500], [760.2, 700, 345], [762.0, 1280, 85], [762.5, 1395, 82]]} cliques={[760.3, 762.6]} arrasto={[760.4, 762.0]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 8.4 · O ditado bagunçado (767,1–781,5), câmera G ----------
const DITADO: [string, number?][] = [
  ['Tá, eu quero organizar os e-mails de onboarding dos novos clientes, porque hoje está tudo meio espalhado. '],
  ['Pensei numa sequência, '],
  ['talvez cinco e-mails, não, espera, quatro', 776.9],
  [', ao longo das duas primeiras semanas. O primeiro é o de boas-vindas, depois '],
  ['a reunião inicial', 780.0],
  ['. Ah, e eles precisam preencher '],
  ['o formulário antes da reunião. Na verdade, esse link vai no próprio e-mail de boas-vindas', 781.0],
  ['. E também explicar como usamos o Slack e o Google Drive com eles…'],
];
export const C8_4: React.FC = () => {
  const t = useAgora();
  const total = DITADO.reduce((a, [s]) => a + s.length, 0);
  const n = Math.round(interpolate(t, [767.4, 781.2], [0, total], clamp));
  let resto = n;
  return (
    <Folha em={767.2} x={60} y={130} w={1180} style={{padding: '30px 36px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 46, height: 46, borderRadius: 12, background: COR.terra, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icone n="mic" t={26} cor="#fff" />
        </div>
        <div>
          <div style={{fontSize: 26, fontWeight: 600}}>Ditado por voz</div>
          <div style={{fontSize: 18, color: COR.cinza}}>Macks · 2:14</div>
        </div>
        <div style={{flex: 1}} />
        <svg width={260} height={50}>
          {Array.from({length: 40}).map((_, i) => {
            const h = 8 + Math.abs(Math.sin(i * 1.7 + t * 6)) * 34 * (t < 781.5 ? 1 : 0.2);
            return <rect key={i} x={i * 6.5} y={25 - h / 2} width={3.5} height={h} rx={1.75} fill={COR.terra} opacity={0.75} />;
          })}
        </svg>
      </div>
      <div style={{fontSize: 33, lineHeight: 1.55, marginTop: 24, color: COR.tinta}}>
        {DITADO.map(([s, marca], i) => {
          const vis = s.slice(0, Math.max(0, resto));
          resto -= s.length;
          if (!vis) return null;
          const on = marca !== undefined && t >= marca;
          return (
            <span key={i} style={{background: on ? 'rgba(232,196,104,.45)' : 'transparent', borderRadius: 6, transition: 'none'}}>
              {vis}
            </span>
          );
        })}
      </div>
    </Folha>
  );
};

// ---------- 8.5–8.6 · O mod organiza e criar o seu (781,5–803,5), câmera D ----------
const SECOES_PROMPT: [string, React.ReactNode, number][] = [
  ['A TAREFA', 'Escrever uma sequência de quatro e-mails de onboarding para novos clientes, ao longo das duas primeiras semanas.', 786.5],
  ['O MOTIVO', 'Hoje o e-mail de boas-vindas é enviado na mão ou nem é enviado. A sequência prepara o cliente para a reunião inicial.', 787.3],
  ['AS RESTRIÇÕES', 'Só rascunhos, nada enviado. Seguir o tom do e-mail de boas-vindas da pasta de modelos.', 788.1],
  ['CONCLUÍDO QUANDO', 'Quatro e-mails com menos de 120 palavras cada, num documento para revisão. O primeiro já leva o link do formulário.', 788.9],
];
const PEDIDO_MOD = 'Crie um mod que transforme meus pedidos longos por voz em um prompt claro e organizado antes de você começar.';
export const C8_5: React.FC = () => {
  const t = useAgora();
  const novo = t >= 796.4;
  const d = useDigitado(PEDIDO_MOD, 797.0, 800.4);
  const env = t >= 800.6;
  return (
    <App
      focos={[
        [781.5, 1.35, 760, 520, 0.01],
        [786.2, 1.45, 760, 560, 0.8],
        [796.4, 1.55, 760, 700, 0.6],
        [800.8, 1.5, 760, 640, 0.6],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={BARRA(novo ? [] : ['onb'])} sel={novo ? undefined : 'onb'} />}
        overlay={
          !novo && (
            <div style={{position: 'absolute', left: 1140, top: 70}}>
              <CartaoMod ligaEm={-10} compacto />
            </div>
          )
        }
      >
        {!novo ? (
          <Conversa titulo={N.onb}>
            <MsgUsuario em={781.6}>
              <span style={{color: APP.apagado, fontSize: 13.5}}>
                Tá, eu quero organizar os e-mails de onboarding dos novos clientes… talvez cinco e-mails, não, espera, quatro… depois a reunião inicial… na verdade, esse link vai no próprio e-mail…
              </span>
            </MsgUsuario>
            <Ferramenta em={782.4} texto="O mod Organizar ditado reescreveu sua mensagem" />
            <MsgClaude em={786.3}>
              <div style={{border: `1px solid ${APP.bordaCartao}`, borderRadius: 12, padding: '12px 16px', background: '#2a2a2a', display: 'flex', flexDirection: 'column', gap: 10}}>
                {SECOES_PROMPT.map(([h, c, em]) => (
                  <Secaozinha key={h} h={h} em={em}>
                    {c}
                  </Secaozinha>
                ))}
              </div>
            </MsgClaude>
          </Conversa>
        ) : (
          <Conversa titulo={env ? 'Mod de ditado' : 'Nova sessão'} caixa={<Caixa texto={env ? '' : d.texto} digitando={!env} />}>
            {env && (
              <>
                <MsgUsuario em={800.6}>{PEDIDO_MOD}</MsgUsuario>
                <Trabalhando em={801.4} texto="Construindo o mod" />
              </>
            )}
          </Conversa>
        )}
      </JanelaApp>
    </App>
  );
};
const Secaozinha: React.FC<{h: string; em: number; children: React.ReactNode}> = ({h, em, children}) => {
  const m = useMola(em);
  return (
    <div style={{opacity: m, transform: `translateY(${(1 - m) * 10}px)`}}>
      <div style={{fontSize: 12.5, fontWeight: 600, letterSpacing: 1, color: COR.terra}}>{h}</div>
      <div style={{fontSize: 14.5, marginTop: 2}}>{children}</div>
    </div>
  );
};

// ---------- 9 · Encerramento em tela cheia e CTA do RecMove (803,5–849,7) ----------
// recmove.png (2428×1302): manchete "Beta fechado…" em x 24–635, y 865–902; formulário em x 24–1186, y 1095–1210; botão em x 877–1174.
export const C9_1: React.FC = () => (
  <>
    <Chip
      em={809.9}
      texto={
        <>
          <span style={{fontSize: 30}}>👍</span> deixa um like
        </>
      }
      tamanho={32}
      style={{left: 90, top: 780}}
    />
    <Chip em={811.0} texto="inscreva-se no canal" tom="terra" tamanho={32} style={{left: 90, top: 870}} />
  </>
);

export const C9_2: React.FC = () => {
  const t = useAgora();
  const card = useMola(821.6);
  const nome = useMola(828.2);
  const marca = useEm(832.0, 0.6);
  const form = useMola(844.2);
  const sai = interpolate(t, [847.8, 848.6], [1, 0], clamp);
  const k = 580 / 2428;
  return (
    <div style={{opacity: sai}}>
      <Chip em={819.2} texto="link na descrição" tamanho={28} style={{left: 90, top: 70}} />
      <div style={{position: 'absolute', left: 70, top: 170, width: 580, borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.12)', opacity: card, transform: `translateY(${(1 - card) * 40}px) rotate(-1.5deg)`}}>
        <Img src={arq('recmove.png')} style={{width: 580, display: 'block'}} />
        <div style={{position: 'absolute', left: 24 * k - 4, top: 865 * k - 3, width: (635 - 24) * k * marca + 8, height: (902 - 865) * k + 6, background: 'rgba(217,119,87,.35)', borderRadius: 4, mixBlendMode: 'screen'}} />
      </div>
      <div style={{position: 'absolute', left: 90, top: 520, display: 'flex', alignItems: 'baseline', gap: 16, opacity: nome, transform: `translateY(${(1 - nome) * 20}px)`}}>
        <span style={{fontFamily: FONTE.ui, fontWeight: 700, fontSize: 64, color: '#FAF9F5', letterSpacing: -2, textShadow: '0 4px 24px rgba(0,0,0,.5)'}}>RecMove</span>
        <span style={{fontFamily: FONTE.ui, fontSize: 28, color: 'rgba(250,249,245,.85)', textShadow: '0 2px 16px rgba(0,0,0,.6)'}}>lista de espera</span>
      </div>
      <div style={{position: 'absolute', left: 70, top: 640, width: (1186 - 380) * 0.72, height: (1210 - 1095) * 0.72, borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.6)', opacity: form, transform: `scale(${0.9 + 0.1 * form})`, transformOrigin: 'left center'}}>
        <div style={{position: 'absolute', left: -380 * 0.72, top: -1095 * 0.72, width: 2428 * 0.72, height: 1302 * 0.72}}>
          <Img src={arq('recmove.png')} style={{width: '100%', height: '100%'}} />
        </div>
        <div style={{position: 'absolute', left: (877 - 380) * 0.72 - 4, top: 8, width: (1174 - 877) * 0.72 + 8, height: (1210 - 1095) * 0.72 - 16, borderRadius: 14, boxShadow: `0 0 0 ${3 + 3 * Math.abs(Math.sin(t * 4))}px rgba(250,249,245,.85)`}} />
      </div>
      <Chip em={845.6} texto="1º link da descrição ↓" tom="terra" tamanho={30} style={{left: 90, top: 760}} />
    </div>
  );
};
