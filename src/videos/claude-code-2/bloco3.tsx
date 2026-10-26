import React from 'react';
import {Img, interpolate} from 'remotion';
import {Botao, Caixa, CartaoAmbiente, CartaoContexto, Conversa, Cursor, Ferramenta, Icone, JanelaApp, Lateral, MsgClaude, MsgUsuario, Secao, Trabalhando} from '../../estilos/demo-tutorial/app';
import {APP, Asterisco, COR, Cartela, Chip, FONTE, arq, clamp, useAgora, useDigitado, useEm, useMola} from './base';
import {App, ConversaRelatorio, FIXADOS, N, ORGANIZADA, it} from './comum';
import {Folha, IconeGrande, Linha, MiniChat, No, TituloDiagrama} from '../../estilos/demo-tutorial/diagrama';

// Posições (unidades da janela) na barra ORGANIZADA: YouTube › Vídeo da próxima semana em y 557; threads em 591, 625, 659, 693.
const Y_VIDEO = 557;
const Y_FILHO = (i: number) => 591 + i * 34;

const PEDIDO_VIDEO =
  'Me ajude a preparar o vídeo da próxima semana sobre onboarding de clientes com skills do Claude. Crie uma thread para cada parte: títulos e thumbnails, roteiro, visual e edição, e pesquisa.';

const ConversaVideo: React.FC<{em?: number; extra?: React.ReactNode; caixa?: React.ReactNode}> = ({em = -10, extra, caixa}) => (
  <Conversa titulo={N.video} caixa={caixa}>
    <MsgUsuario em={em}>{PEDIDO_VIDEO}</MsgUsuario>
    <MsgClaude em={em + 3.0}>Vou começar quatro threads dentro desta conversa, uma para cada parte. Vou orientar cada uma e reunir o trabalho.</MsgClaude>
    <Ferramenta em={em + 4.0} texto="Iniciou 4 threads" />
    {extra}
  </Conversa>
);

// ---------- 3.1 · Cartela 02/07 (203,2–208,7) ----------
export const C3_1: React.FC = () => <Cartela em={203.3} num={2} titulo={<>Projetos e sessões aninhadas</>} sub="uma conversa que coordena as outras" />;

// ---------- 3.2 · Liberação gradual, com o print real da barra (208,7–228,2), câmera G ----------
// prints/claude-app-1.png (2940×1912): menu da barra em x 0–500, y 160–560; "Projetos Beta" em y 300–365.
export const C3_2: React.FC = () => {
  const t = useAgora();
  const print = useMola(214.7);
  const anel = useEm(215.4, 0.4);
  const junta = useEm(226.4, 0.6);
  return (
    <>
      <TituloDiagrama em={209.2}>
        Liberação <span style={{color: COR.terra}}>gradual</span>
      </TituloDiagrama>
      <Chip em={211.6} texto="a sua tela pode estar um pouco diferente" tamanho={26} style={{left: 90, top: 160}} />
      <div style={{position: 'absolute', left: 90, top: 260, width: 520, height: 416, borderRadius: 18, overflow: 'hidden', boxShadow: '0 26px 60px rgba(40,25,10,.3)', opacity: print, transform: `translateY(${(1 - print) * 30}px) rotate(-1.5deg)`}}>
        <div style={{position: 'absolute', left: 0, top: -160 * 1.04, width: 2940 * 1.04, height: 1912 * 1.04}}>
          <Img src={arq('prints/claude-app-1.png')} style={{width: '100%', height: '100%'}} />
        </div>
        <div style={{position: 'absolute', left: 10, top: (300 - 160) * 1.04, width: 300 * anel, height: 66, borderRadius: 12, border: `3px solid ${COR.terra}`, boxShadow: '0 0 0 6px rgba(217,119,87,.2)'}} />
      </div>
      <Chip em={217.0} texto="a aba pode estar oculta: confira" tom="terra" tamanho={26} style={{left: 90, top: 712}} />
      <Folha em={220.5} x={700} y={260} w={500} style={{padding: '24px 28px', transform: `translateY(${junta * 40}px)`}}>
        <div style={{fontSize: 24, color: COR.cinza}}>Planos Pro e Max</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 8}}>
          <Icone n="projetos" t={34} cor={COR.terra} />
          <span style={{fontSize: 40, fontWeight: 600, letterSpacing: -1}}>Projetos</span>
        </div>
      </Folha>
      <Folha em={223.3} x={700} y={460} w={500} style={{padding: '24px 28px', transform: `translateY(${-junta * 40}px)`}}>
        <div style={{fontSize: 24, color: COR.cinza}}>Plano Team</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 8}}>
          <Icone n="chat" t={34} cor={COR.terra} />
          <span style={{fontSize: 40, fontWeight: 600, letterSpacing: -1}}>Sessões aninhadas</span>
        </div>
      </Folha>
      <Chip em={226.4} texto="a ideia é a mesma" tom="escuro" tamanho={30} style={{left: 820, top: 690, opacity: t < 226.4 ? 0 : undefined}} />
    </>
  );
};

// ---------- 3.3 · A conversa principal abre threads (228,2–240,7), câmera D ----------
export const C3_3: React.FC = () => (
  <App
    focos={[
      [228.2, 1.45, 820, 560, 0.01],
      [232.2, 1.85, 300, 600, 0.9],
      [235.8, 1.5, 820, 600, 0.8],
      [240.2, 1, 735, 432, 0.6],
    ]}
  >
    <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 232.4, [232.6, 232.8, 233.0, 233.2])} sel="video" />}>
      <ConversaVideo
        em={228.4}
        extra={
          <>
            <Ferramenta em={236.2} texto="Enviou mensagem para Roteiro" />
            <MsgClaude em={237.7}>Pedi ao Roteiro uma estrutura de sete partes. Ele confere comigo antes de fechar o gancho.</MsgClaude>
            <Ferramenta em={239.4} texto="Recebeu mensagem de Pesquisa: 6 fontes, configuração caiu de 3 horas para 25 minutos" />
          </>
        }
      />
    </JanelaApp>
  </App>
);

// ---------- 3.4 · De cinco chats a um coordenador (240,7–247,9), câmera G ----------
const THREADS: [string, string][] = [
  ['Pesquisa', 'fontes e dados'],
  ['Títulos e thumbnails', 'cinco opções'],
  ['Roteiro', 'sete partes'],
  ['Visual e edição', 'lista de tomadas'],
];
const XS = [70, 365, 660, 955];
export const C3_4: React.FC = () => (
  <>
    {['Títulos', 'Roteiro', 'Thumbnail', 'Visual', 'Pesquisa'].map((n, i) => (
      <MiniChat key={n} em={241.0 + i * 0.25} ate={243.9} x={[90, 520, 900, 230, 700][i]} y={[180, 140, 260, 520, 560][i]} w={300} titulo={n}>
        chat separado
      </MiniChat>
    ))}
    <No em={244.1} x={440} y={150} w={400} titulo="Coordenador" sub={N.video} grande />
    {XS.map((x, i) => (
      <React.Fragment key={x}>
        <Linha em={245.2 + i * 0.1} x1={640} y1={262} x2={x + 125} y2={520} cotovelo />
        <No em={245.4 + i * 0.12} x={x} y={520} w={250} titulo={THREADS[i][0]} sub={THREADS[i][1]} />
      </React.Fragment>
    ))}
    <Chip em={246.5} texto="uma pequena equipe de agentes" tom="terra" tamanho={32} style={{left: 360, top: 760}} />
  </>
);

// ---------- 3.6 · Um chat para cada parte (250,6–259,0), câmera D ----------
const SEPARADOS: Secao[] = [FIXADOS, {titulo: 'YouTube', itens: [it('thumb'), it('estr'), {id: 'pv', nome: 'Plano visual e edição'}]}, {titulo: 'Este computador', itens: [it('rel'), it('cal'), it('news')]}];
export const C3_6: React.FC = () => {
  const t = useAgora();
  const qual = t < 253.6 ? 0 : t < 255.3 ? 1 : 2;
  const conteudo = [
    {
      titulo: N.thumb,
      pedido: 'Me dê ideias de título e thumbnail para o vídeo sobre o Claude Code 2.0.',
      resposta: (
        <ol style={{margin: 0, paddingLeft: 22}}>
          <li>Claude Code 2.0 muda como você trabalha</li>
          <li>O novo app do Claude Code em 15 minutos</li>
          <li>Migrei para o aplicativo do Claude Code</li>
        </ol>
      ),
    },
    {
      titulo: N.estr,
      pedido: 'Monte a estrutura do roteiro em sete partes.',
      resposta: (
        <ol style={{margin: 0, paddingLeft: 22}}>
          <li>Gancho: o app mudou</li>
          <li>O novo layout</li>
          <li>Projetos e threads</li>
        </ol>
      ),
    },
    {
      titulo: 'Plano visual e edição',
      pedido: 'Faça a lista de tomadas para a edição.',
      resposta: (
        <ul style={{margin: 0, paddingLeft: 22}}>
          <li>Introdução: câmera no rosto, depois o app inteiro</li>
          <li>Layout: aproximar as seções da barra lateral</li>
          <li>Tela dividida: dois chats ao mesmo tempo</li>
        </ul>
      ),
    },
  ][qual];
  return (
    <App focos={[[250.6, 1.2, 640, 500]]}>
      <JanelaApp lateral={<Lateral secoes={SEPARADOS} sel={['thumb', 'estr', 'pv'][qual]} />}>
        <Conversa titulo={conteudo.titulo}>
          <MsgUsuario>{conteudo.pedido}</MsgUsuario>
          <MsgClaude>{conteudo.resposta}</MsgClaude>
        </Conversa>
        <Cursor pts={[[251.4, 140, 420], [252.0, 120, 413], [253.4, 120, 447], [255.1, 120, 481]]} cliques={[252.1, 253.6, 255.3]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 3.7 · Chats isolados (259,0–275,3), câmera G ----------
export const C3_7: React.FC = () => {
  const t = useAgora();
  const muda = useEm(264.6, 0.4);
  const p = interpolate(t, [268.8, 272.2], [0, 3], clamp);
  const pulo = [235, 605, 975, 605];
  const x = pulo[Math.floor(p)] + (pulo[Math.min(3, Math.floor(p) + 1)] - pulo[Math.floor(p)]) * (p % 1);
  return (
    <>
      <TituloDiagrama em={259.1}>Cada chat só conhece a si mesmo</TituloDiagrama>
      <MiniChat em={259.4} x={70} y={230} w={340} titulo="Títulos">
        <span style={{textDecoration: muda > 0.5 ? 'line-through' : 'none', opacity: 1 - muda * 0.5}}>O novo app do Claude Code</span>
        {muda > 0.5 && <div style={{color: COR.tinta, fontWeight: 600, marginTop: 6}}>Claude Code 2.0 muda como você trabalha</div>}
      </MiniChat>
      <MiniChat em={259.6} x={440} y={230} w={340} titulo="Roteiro" destaque={t > 266.9 && t < 271 ? 1 : 0}>
        Gancho: “O novo app do Claude Code”
      </MiniChat>
      <MiniChat em={259.8} x={810} y={230} w={340} titulo="Visual e edição">
        Lista de tomadas da introdução
      </MiniChat>
      {[70, 440, 810].map((x0, i) => (
        <Chip key={x0} em={260.4 + i * 0.15} texto="só conhece esta conversa" tamanho={22} style={{left: x0 + 20, top: 470}} />
      ))}
      <Chip em={266.9} texto="continua como estava" tom="terra" tamanho={24} style={{left: 470, top: 175}} />
      {t > 268.8 && t < 272.6 && <div style={{position: 'absolute', left: x - 18, top: 560, width: 36, height: 36, borderRadius: 18, background: COR.terra, boxShadow: '0 8px 20px rgba(217,119,87,.4)'}} />}
      <Chip em={272.4} texto="sem contexto compartilhado do projeto" tom="escuro" tamanho={30} style={{left: 70, top: 680}} />
    </>
  );
};

// ---------- 3.8 · Tudo num chat só (275,3–280,6), câmera E ----------
const CTX94: [string, number][] = [
  ['812k', 81.2],
  ['63k', 6.3],
  ['17.4k', 1.7],
  ['10.2k', 1.0],
  ['9.8k', 1.0],
  ['9.4k', 0.9],
  ['33k', 3.3],
  ['45k', 4.6],
];
export const C3_8: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [275.3, 1, 735, 432],
        [278.4, 1.8, 1330, 330, 0.8],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={ORGANIZADA(['tudo'])} sel="tudo" />}>
        <Conversa
          titulo={N.tudo}
          rolagem={interpolate(t, [275.3, 278.3], [260, 0], clamp)}
          painel={
            <>
              <CartaoAmbiente pasta="youtube · ~/Projetos/youtube" />
              <CartaoContexto usado={94} valores={CTX94} aberto destaque={t > 278.6 ? 1 : 0} />
            </>
          }
        >
          <MsgUsuario>Agora me dê cinco títulos.</MsgUsuario>
          <MsgClaude>Cinco títulos, começando pelo mais forte…</MsgClaude>
          <MsgUsuario>Muda o gancho do roteiro para usar o título 1.</MsgUsuario>
          <MsgClaude>Feito. Atualizei a abertura e as partes 2 e 3…</MsgClaude>
          <MsgUsuario>E a lista de tomadas? Volta para a versão anterior do título.</MsgUsuario>
          <MsgClaude>Voltei o título, mas o roteiro ainda usa o gancho novo…</MsgClaude>
        </Conversa>
      </JanelaApp>
    </App>
  );
};

// ---------- 3.9–3.10 · Coordenador e threads na barra (280,6–309,7), câmera D ----------
const AJUSTE = 'Peça ao roteiro para abrir com os números da pesquisa. Os títulos devem acompanhar essa ideia.';
export const C3_9: React.FC = () => {
  const t = useAgora();
  const d = useDigitado(AJUSTE, 293.9, 296.8);
  const enviado = t >= 297.0;
  const naThread = t >= 303.0;
  return (
    <App
      focos={[
        [280.6, 1, 735, 432],
        [287.2, 1.8, 300, 620, 0.9],
        [293.4, 1.6, 820, 780, 0.8],
        [298.0, 1.4, 820, 600, 0.6],
        [301.6, 1.7, 330, 620, 0.7],
        [304.4, 1.4, 820, 560, 0.8],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 288.0, [292.8, 290.0, 291.2, 291.8])} sel={naThread ? 'rot' : 'video'} hover={t > 302.2 && !naThread ? 'rot' : undefined} />}>
        {!naThread ? (
          <ConversaVideo
            caixa={<Caixa texto={enviado ? '' : d.texto} digitando={d.digitando && !enviado} />}
            extra={
              enviado && (
                <>
                  <MsgUsuario em={297.0}>{AJUSTE}</MsgUsuario>
                  <Ferramenta em={298.3} texto="Enviou mensagem para Roteiro e Títulos e thumbnails" />
                </>
              )
            }
          />
        ) : (
          <Conversa titulo={`${N.video}  ›  ${N.rot}`}>
            <Ferramenta texto="Orientação recebida da conversa principal" />
            <MsgClaude em={303.6}>
              Abrir com os números da pesquisa: a configuração por cliente caiu de cerca de três horas para 25 minutos. Títulos e thumbnails vão usar o mesmo gancho.
            </MsgClaude>
            <MsgClaude em={305.4}>
              <ol style={{margin: 0, paddingLeft: 22}}>
                <li>Gancho: de 3 horas para 25 minutos</li>
                <li>O que é o onboarding com skills</li>
                <li>As três skills do processo</li>
              </ol>
            </MsgClaude>
          </Conversa>
        )}
        <Cursor pts={[[301.0, 500, 700], [302.4, 150, Y_FILHO(2)]]} cliques={[302.9]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 3.11 · O coordenador devolve o status (309,7–319,1), câmera H ----------
const LINHAS: [string, string, string][] = [
  ['Pesquisa', 'Concluída', '6 fontes, tempo de configuração por cliente'],
  ['Títulos e thumbnails', 'Concluída após uma revisão', '5 títulos com fontes, 3 thumbnails'],
  ['Roteiro', 'Concluída', '7 partes, do gancho ao encerramento'],
  ['Visual e edição', 'Concluída', 'Lista de tomadas e 4 animações'],
];
export const C3_11: React.FC = () => {
  const t = useAgora();
  return (
    <App
      focos={[
        [309.7, 1, 735, 432],
        [314.8, 1.55, 830, 560, 0.9],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 0)} sel={t >= 310.6 ? 'video' : 'rot'} />}>
        {t < 310.6 ? (
          <Conversa titulo={`${N.video}  ›  ${N.rot}`}>
            <MsgClaude>Estrutura pronta: sete partes, do gancho ao encerramento.</MsgClaude>
          </Conversa>
        ) : (
          <Conversa titulo={N.video}>
            <MsgClaude>As quatro threads terminaram a primeira entrega.</MsgClaude>
            <MsgClaude em={311.4}>
              <table style={{borderCollapse: 'collapse', width: '100%', fontSize: 14.5}}>
                <thead>
                  <tr style={{color: APP.apagado, textAlign: 'left'}}>
                    {['Thread', 'Status', 'Primeira entrega'].map((h) => (
                      <th key={h} style={{fontWeight: 500, padding: '6px 10px', borderBottom: `1px solid ${APP.linha}`}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LINHAS.map((l, i) => (
                    <tr key={l[0]} style={{background: t > 317.6 && i === 1 ? 'rgba(217,119,87,.14)' : 'transparent'}}>
                      <td style={{padding: '8px 10px', borderBottom: `1px solid ${APP.linha}`}}>{l[0]}</td>
                      <td style={{padding: '8px 10px', borderBottom: `1px solid ${APP.linha}`, color: APP.verde}}>{l[1]}</td>
                      <td style={{padding: '8px 10px', borderBottom: `1px solid ${APP.linha}`}}>{l[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MsgClaude>
          </Conversa>
        )}
        <Cursor pts={[[309.9, 400, 700], [310.4, 150, Y_VIDEO]]} cliques={[310.5]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 3.12 · Threads × subagentes (319,1–335,3), câmera G ----------
export const C3_12: React.FC = () => {
  const t = useAgora();
  return (
    <>
      <TituloDiagrama em={319.2}>E os subagentes?</TituloDiagrama>
      {XS.map((x, i) => (
        <React.Fragment key={x}>
          <No em={319.6 + i * 0.12} x={x} y={430} w={250} titulo={THREADS[i][0]} destaque={i === 1 && t > 329.9 ? 1 : 0} />
          {[0, 1, 2].map((k) => {
            const cx = x + 40 + k * 85;
            return (
              <React.Fragment key={k}>
                <Linha em={322.4 + i * 0.1} x1={x + 125} y1={510} x2={cx + 22} y2={620} cor={COR.borda} cotovelo dur={0.4} />
                <Subagente em={322.6 + i * 0.1 + k * 0.05} x={cx} y={620} risca={i === 3 && k === 0 ? 333.2 : undefined} />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      <Chip em={322.4} texto="cada thread chama os próprios subagentes" tamanho={24} style={{left: 70, top: 720}} />
      <No em={326.9} x={440} y={170} w={400} titulo="Coordenador" sub="uma camada a mais por cima" grande />
      {XS.map((x, i) => (
        <Linha key={x} em={327.4 + i * 0.08} x1={640} y1={282} x2={x + 125} y2={430} cotovelo />
      ))}
      <Folha em={330.4} x={380} y={300} w={330} style={{padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 18px 40px rgba(40,30,15,.22)'}}>
        <div style={{width: 34, height: 34, borderRadius: 17, background: COR.tinta, color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>M</div>
        <span style={{fontSize: 23, fontWeight: 600}}>Deixe o título 2 mais curto</span>
      </Folha>
      <Chip em={333.2} texto="com subagente, não dá para conversar direto" tom="escuro" tamanho={24} style={{left: 600, top: 790}} />
    </>
  );
};
const Subagente: React.FC<{em: number; x: number; y: number; risca?: number}> = ({em, x, y, risca}) => {
  const m = useMola(em);
  const r = useEm(risca ?? 1e9, 0.3);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 44, height: 44, borderRadius: 22, background: COR.mesaClara, border: `1.5px solid ${r > 0 ? COR.vermelho : COR.borda}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: m, transform: `scale(${m})`}}>
      <Asterisco tamanho={22} cor={r > 0 ? COR.vermelho : '#C9B9A6'} />
    </div>
  );
};

// ---------- 3.13 · Novo projeto (335,3–347,6), câmera D ----------
const OBJETIVO = 'Lançar a newsletter semanal da agência';
const SUGESTOES: [string, string][] = [
  ['Pesquisar o público', 'Quem lê, o que já assina e o que falta.'],
  ['Escrever as quatro primeiras edições', 'No tom das newsletters anteriores.'],
  ['Montar a página de inscrição', 'Texto, formulário e e-mail de boas-vindas.'],
];
export const C3_13: React.FC = () => {
  const t = useAgora();
  const novo = t >= 339.6;
  const d = useDigitado(OBJETIVO, 340.3, 341.9);
  const sug = useMola(342.4);
  const iniciou = t >= 346.0;
  return (
    <App
      focos={[
        [335.3, 1, 735, 432],
        [338.8, 1.45, 800, 300, 0.7],
        [342.2, 1.4, 760, 470, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 0)} nav="Projetos" />}>
        <div style={{flex: 1, background: APP.fundo, fontFamily: FONTE.ui, color: APP.texto, padding: '56px 120px', position: 'relative'}}>
          {!novo ? (
            <>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{fontFamily: FONTE.serifa, fontSize: 34}}>Projetos</span>
                <div style={{flex: 1}} />
                <span style={{fontSize: 14, color: APP.apagado, border: `1px solid ${APP.linha}`, borderRadius: 8, padding: '7px 12px', marginRight: 10}}>Ordenar por Criado</span>
                <Botao primario ativo={t > 339.3}>
                  Novo projeto
                </Botao>
              </div>
              <div style={{fontSize: 14, color: APP.apagado, marginTop: 50}}>Fixados</div>
              <div style={{marginTop: 12, width: 440, background: '#2c2c2c', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center'}}>
                <Icone n="projetos" t={22} cor={APP.apagado} />
                <div>
                  <div style={{fontSize: 15}}>Agência</div>
                  <div style={{fontSize: 13, color: APP.apagado}}>há 6 dias</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <span style={{fontFamily: FONTE.serifa, fontSize: 34}}>Novo projeto</span>
              <div style={{fontSize: 14, color: APP.apagado, marginTop: 28}}>Qual é o objetivo?</div>
              <div style={{marginTop: 8, height: 46, borderRadius: 12, background: APP.caixa, border: `1px solid #4a4a4a`, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 16}}>
                {d.texto}
                {d.digitando && <span style={{width: 2, height: 18, background: APP.texto, marginLeft: 1, opacity: Math.floor(t * 2.2) % 2 ? 0 : 1}} />}
              </div>
              <div style={{marginTop: 26, border: `1px solid ${APP.bordaCartao}`, borderRadius: 14, padding: '16px 18px', opacity: sug, transform: `translateY(${(1 - sug) * 16}px)`}}>
                <div style={{fontSize: 14, color: APP.apagado, marginBottom: 6}}>Algumas coisas que posso começar agora:</div>
                {SUGESTOES.map(([a, b], i) => (
                  <div key={a} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? `1px solid ${APP.linha}` : 'none'}}>
                    <div style={{width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${iniciou ? APP.verde : '#666'}`, background: iniciou ? APP.verde : 'transparent'}} />
                    <div style={{flex: 1}}>
                      <div style={{fontSize: 15}}>{a}</div>
                      <div style={{fontSize: 13, color: APP.apagado}}>{b}</div>
                    </div>
                    <span style={{fontSize: 13, color: iniciou ? APP.verde : APP.apagado}}>{iniciou ? 'Rodando' : 'Iniciar'}</span>
                  </div>
                ))}
                <div style={{marginTop: 10}}>
                  <Botao primario ativo={t > 345.7}>
                    Iniciar 3 threads
                  </Botao>
                </div>
              </div>
            </>
          )}
        </div>
        <Cursor pts={[[336.4, 800, 500], [339.1, 1300, 100], [342.6, 900, 560], [345.6, 405, 745]]} cliques={[339.5, 346.0]} />
      </JanelaApp>
    </App>
  );
};

// ---------- 3.14 · Sessão aninhada a partir de uma conversa em branco (347,6–369,5), câmera D ----------
const PEDIDO_ONB = 'Me ajude a reformular o onboarding de clientes: os e-mails de boas-vindas, o roteiro da reunião inicial e o checklist de configuração.';
const NOVAS: [string, string][] = [
  ['E-mails de boas-vindas', 'Reescrever a sequência de três e-mails para novos clientes.'],
  ['Roteiro da reunião inicial', 'Uma reunião de 30 minutos, com as perguntas a fazer.'],
  ['Checklist de configuração', 'Contas, acessos e primeiras entregas, na ordem.'],
];
export const C3_14: React.FC = () => {
  const t = useAgora();
  const d = useDigitado(PEDIDO_ONB, 352.4, 356.0);
  const enviado = t >= 356.3;
  return (
    <App
      focos={[
        [347.6, 1, 735, 432],
        [352.0, 1.6, 820, 780, 0.7],
        [356.4, 1.3, 820, 560, 0.7],
        [366.4, 1.5, 820, 560, 0.8],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={ORGANIZADA(enviado ? ['onbNovo'] : [], 0)} sel={enviado ? 'onbNovo' : undefined} nav={t > 350.2 && !enviado ? 'Criar' : undefined} />}>
        <Conversa titulo={enviado ? N.onbNovo : 'Nova sessão'} caixa={<Caixa texto={enviado ? '' : d.texto} digitando={d.digitando && !enviado} />}>
          {enviado && (
            <>
              <MsgUsuario em={356.3}>{PEDIDO_ONB}</MsgUsuario>
              <Trabalhando em={357.0} ate={366.6} texto="Pensando" />
              <MsgClaude em={366.6}>São três partes separadas. Quer que eu inicie uma thread para cada uma?</MsgClaude>
              <CartaoThreads em={366.8} itens={NOVAS} hover={t > 368.4} />
            </>
          )}
        </Conversa>
        <Cursor pts={[[348.6, 500, 400], [350.0, 60, 79], [351.4, 600, 780], [367.6, 900, 700], [368.3, 980, 742]]} cliques={[350.2, 351.6]} />
      </JanelaApp>
    </App>
  );
};

const CartaoThreads: React.FC<{em: number; itens: [string, string][]; hover?: boolean; unico?: boolean}> = ({em, itens, hover, unico}) => {
  const m = useMola(em);
  return (
    <div style={{border: `1px solid ${APP.bordaCartao}`, borderRadius: 12, background: '#2a2a2a', padding: '12px 16px', opacity: m, transform: `translateY(${(1 - m) * 14}px)`, fontSize: 14.5}}>
      <div style={{color: APP.apagado, fontSize: 13.5, marginBottom: 4}}>{unico ? 'Nova sessão' : 'Novas threads'}</div>
      {itens.map(([a, b]) => (
        <div key={a} style={{padding: '7px 0'}}>
          <div style={{color: APP.texto}}>{a}</div>
          <div style={{color: APP.apagado, fontSize: 13.5}}>{b}</div>
        </div>
      ))}
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
        <span style={{color: APP.apagado, fontSize: 13.5}}>Opções</span>
        <div style={{flex: 1}} />
        <Botao>Fazer aqui</Botao>
        <Botao primario ativo={hover}>
          {unico ? 'Iniciar' : `Iniciar ${itens.length} threads`}
        </Botao>
      </div>
    </div>
  );
};

// ---------- 3.15 · Um pedido fora do assunto (369,5–384,8), câmera E ----------
const PEDIDO_LI = 'Você também pode escrever um post no LinkedIn sobre o nosso novo serviço de onboarding?';
export const C3_15: React.FC = () => {
  const t = useAgora();
  const d = useDigitado(PEDIDO_LI, 370.0, 374.6);
  const enviado = t >= 375.0;
  return (
    <>
      <App
        focos={[
          [369.5, 1.45, 820, 700, 0.01],
          [376.8, 1.5, 820, 560, 0.8],
        ]}
      >
        <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 0)} sel="rel" />}>
          <ConversaRelatorio
            caixa={<Caixa texto={enviado ? '' : d.texto} digitando={d.digitando && !enviado} />}
            extra={
              enviado && (
                <>
                  <MsgUsuario em={375.0}>{PEDIDO_LI}</MsgUsuario>
                  <MsgClaude em={377.0}>É uma tarefa separada. Quer começar em uma conversa própria, para não misturar com o relatório?</MsgClaude>
                  <CartaoThreads em={377.4} itens={[['Post no LinkedIn sobre o onboarding', 'Um post curto anunciando o novo serviço.']]} unico hover={t > 379.2} />
                </>
              )
            }
          />
        </JanelaApp>
      </App>
      <Chip em={380.9} texto="uma conversa por tarefa" tom="terra" tamanho={30} style={{left: 40, top: 160}} />
    </>
  );
};

// ---------- 3.16 · Threads na barra lateral (384,8–392,4), câmera D ----------
export const C3_16: React.FC = () => (
  <App
    focos={[
      [384.8, 1, 735, 432],
      [385.6, 2.0, 300, 600, 0.9],
    ]}
  >
    <JanelaApp lateral={<Lateral secoes={ORGANIZADA([], 390.0)} sel="video" hover={undefined} />}>
      <ConversaVideo />
      <Cursor pts={[[387.0, 400, 700], [389.6, 26, Y_VIDEO]]} cliques={[390.0]} />
    </JanelaApp>
  </App>
);

// ---------- 3.17–3.19 · Nuvem × computador (392,4–404,4), câmera G; B-roll no meio ----------
export const C3_17: React.FC = () => {
  const t = useAgora();
  const segunda = t >= 400.0;
  const sub = useEm(395.0, 0.4);
  return (
    <>
      <TituloDiagrama em={392.5}>Em resumo</TituloDiagrama>
      <Folha em={393.2} x={90} y={240} w={520} h={520} style={{padding: 34}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icone n="projetos" t={34} cor={COR.terra} />
          <span style={{fontSize: 40, fontWeight: 600, letterSpacing: -1}}>Projetos</span>
        </div>
        <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
          <IconeGrande n="nuvem" t={150} cor={COR.terra} />
        </div>
        <div style={{fontSize: 30, textAlign: 'center', marginTop: 20, fontWeight: 600}}>threads rodam na nuvem</div>
        <div style={{fontSize: 25, textAlign: 'center', marginTop: 10, color: COR.cinza, opacity: segunda ? 1 : sub}}>o notebook pode fechar</div>
      </Folha>
      <Folha em={400.8} x={660} y={240} w={520} h={520} style={{padding: 34}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icone n="chat" t={34} cor={COR.terra} />
          <span style={{fontSize: 40, fontWeight: 600, letterSpacing: -1}}>Sessões aninhadas</span>
        </div>
        <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
          <IconeGrande n="notebook" t={150} />
        </div>
        <div style={{fontSize: 30, textAlign: 'center', marginTop: 20, fontWeight: 600}}>só no seu computador</div>
        <div style={{fontSize: 25, textAlign: 'center', marginTop: 10, color: COR.cinza}}>mantenha ligado</div>
      </Folha>
    </>
  );
};

