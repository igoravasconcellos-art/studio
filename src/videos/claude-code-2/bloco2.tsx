import React from 'react';
import {Botao, CartaoAmbiente, CartaoConectores, CartaoContexto, CartaoSaidas, Conversa, Cursor, JanelaApp, Lateral, Menu, Modal, MsgClaude, MsgUsuario, Secao} from '../../estilos/demo-tutorial/app';
import {APP, Chip, FONTE, useAgora, useDigitado, useEm} from './base';
import {App, ConversaRelatorio, FIXADOS, LISTA_SOLTA, N, SAIDAS, it} from './comum';

// ---------- 1.12 · Conectores e saídas (164,4–173,1) ----------
export const C1_12: React.FC = () => {
  const t = useAgora();
  const hoverCon = t > 166.0 && t < 166.8 ? 0 : t >= 166.8 && t < 167.6 ? 1 : t >= 167.6 && t < 168.6 ? 2 : -1;
  return (
    <App
      focos={[
        [164.4, 1, 735, 432],
        [164.6, 1.9, 1330, 380, 1.0],
        [172.4, 1, 735, 432, 0.7],
      ]}
    >
      <JanelaApp lateral={<Lateral secoes={[FIXADOS, LISTA_SOLTA()]} sel="rel" />}>
        <ConversaRelatorio
          painel={
            <>
              <CartaoAmbiente />
              <CartaoContexto usado={18} />
              <CartaoConectores destaque={t > 164.9 && t < 169.5 ? 1 : 0} hover={hoverCon} />
              <CartaoSaidas itens={SAIDAS} destaque={t > 167.6 ? 1 : 0} hover={t > 170.6 ? 0 : -1} />
            </>
          }
        />
        <Cursor
          pts={[
            [165.6, 1240, 330],
            [166.0, 1240, 314],
            [166.8, 1240, 345],
            [167.6, 1240, 376],
            [169.0, 1260, 470],
            [170.6, 1300, 455],
          ]}
          cliques={[170.7]}
        />
      </JanelaApp>
    </App>
  );
};

// ---------- 2.1 · Seções na barra lateral (173,1–195,4) ----------
// Linhas da sidebar: Fixados em y 286, "Este computador" com itens a partir de y 394 (34 cada).
const S = {
  pontosProp: [229, 479] as [number, number],
  menuX: 40,
  menuY: 497,
};
export const MENU = [
  {t: 'Abrir em', sub: true},
  {t: '', sep: true},
  {t: 'Fixar', atalho: 'P'},
  {t: 'Marcar como não lida', atalho: 'U'},
  {t: 'Mudar o nome', atalho: 'R'},
  {t: 'Bifurcar', atalho: 'F'},
  {t: '', sep: true},
  {t: 'Mover para a seção', sub: true},
  {t: '', sep: true},
  {t: 'Arquivar', atalho: 'A'},
  {t: 'Apagar', atalho: 'D', perigo: true},
];

const T21 = {menu: 180.1, hoverMover: 182.0, sub: 182.4, cliqueNova: 183.2, modal: 183.4, digita: [184.3, 185.4], criar: 186.4, arrasta: [187.6, 189.2], segunda: 191.2};

export const C2_1: React.FC = () => {
  const t = useAgora();
  const nome = useDigitado('Clientes', T21.digita[0], T21.digita[1]);
  const criada = t >= T21.criar + 0.15;
  const solto = t >= T21.arrasta[1];
  const clientes: Secao = {
    titulo: 'Clientes',
    novoEm: T21.criar + 0.15,
    itens: [it('prop'), ...(solto ? [it('rel', {novoEm: T21.arrasta[1]})] : []), ...(t >= T21.segunda ? [it('notas', {novoEm: T21.segunda})] : [])],
  };
  const youtube: Secao = {titulo: 'YouTube', novoEm: T21.segunda + 0.5, itens: [it('thumb'), it('estr')]};
  const fora = [...(criada ? ['prop'] : []), ...(solto ? ['rel'] : []), ...(t >= T21.segunda ? ['notas'] : []), ...(t >= T21.segunda + 0.5 ? ['thumb', 'estr'] : [])];
  const arrastando = t >= T21.arrasta[0] && t < T21.arrasta[1];
  const solta = LISTA_SOLTA(fora);
  if (arrastando) solta.itens = solta.itens.map((x) => (x.id === 'rel' ? {...x, esmaecido: true} : x));
  const secoes = [FIXADOS, ...(criada ? [clientes] : []), ...(t >= T21.segunda + 0.5 ? [youtube] : []), solta];
  const pa = useEm(T21.arrasta[0], T21.arrasta[1] - T21.arrasta[0]);

  return (
    <App
      focos={[
        [173.1, 1, 735, 432],
        [175.6, 1.85, 330, 470, 1.1],
        [183.3, 1.3, 960, 400, 0.6],
        [186.5, 1.85, 330, 470, 0.7],
        [190.9, 1.15, 600, 432, 1.0],
      ]}
    >
      <JanelaApp
        lateral={<Lateral secoes={secoes} sel={t < T21.menu ? 'cal' : undefined} hover={t >= 178.9 && t < T21.cliqueNova ? 'prop' : undefined} />}
        overlay={
          <>
            <Menu em={T21.menu} ate={T21.cliqueNova} x={S.menuX} y={S.menuY} w={250} itens={MENU} hover={t >= T21.hoverMover ? 7 : -1} />
            <Menu em={T21.sub} ate={T21.cliqueNova} x={294} y={689} w={170} itens={[{t: 'Nova seção', atalho: '1'}]} hover={t >= T21.sub + 0.25 ? 0 : -1} />
            <Modal em={T21.modal} ate={T21.criar + 0.15} titulo="Nova seção">
              <div style={{height: 38, borderRadius: 8, border: `1.5px solid ${APP.link}`, background: '#262626', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 15, color: nome.texto ? APP.texto : APP.fraco}}>
                {nome.texto || 'Nome da seção'}
                {nome.digitando && <span style={{width: 2, height: 18, background: APP.texto, marginLeft: 1, opacity: Math.floor(t * 2.2) % 2 ? 0 : 1}} />}
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18}}>
                <Botao>Cancelar</Botao>
                <Botao primario ativo={t >= T21.criar - 0.1}>
                  Criar seção
                </Botao>
              </div>
            </Modal>
            {arrastando && (
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 472 + 2 + (420 - 472) * pa,
                  width: 230,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(70,70,70,.92)',
                  boxShadow: '0 10px 24px rgba(0,0,0,.5)',
                  color: APP.texto,
                  fontSize: 14.5,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  fontFamily: FONTE.ui,
                  transform: 'rotate(-1.5deg)',
                  zIndex: 40,
                }}
              >
                {N.rel}
              </div>
            )}
            {arrastando && pa > 0.55 && <div style={{position: 'absolute', left: 16, top: 427, width: 228, height: 2, borderRadius: 1, background: APP.link, zIndex: 39}} />}
          </>
        }
      >
        <Conversa titulo={N.cal}>
          <MsgUsuario>Monte o calendário de conteúdo do 4º trimestre: dois vídeos por semana, a newsletter toda sexta e o lançamento em novembro.</MsgUsuario>
          <MsgClaude>
            Aqui está o plano do 4º trimestre, semana a semana. A semana do lançamento fica reservada só para ele.
            <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
              <li>
                <b>24 vídeos</b>, terças e quintas.
              </li>
              <li>
                <b>13 newsletters</b>, cada uma a partir dos vídeos da semana.
              </li>
              <li>
                <b>Semana do lançamento:</b> dois vídeos, uma live de perguntas e três e-mails.
              </li>
            </ul>
          </MsgClaude>
        </Conversa>
        <Cursor
          pts={[
            [177.8, 520, 600],
            [179.4, ...S.pontosProp],
            [181.6, 120, 705],
            [182.5, 340, 706],
            [183.6, 640, 520],
            [186.0, 828, 486],
            [187.2, 110, 489],
            [189.2, 110, 421],
            [190.4, 160, 560],
          ]}
          cliques={[179.6, 183.2, 186.4]}
          arrasto={[T21.arrasta[0], T21.arrasta[1]]}
        />
      </JanelaApp>
    </App>
  );
};

// ---------- 2.2 · Antes × depois (195,4–203,2), câmera G ----------
const ListaMini: React.FC<{em: number; titulo: string; secoes: Secao[]; x: number; tom: 'claro' | 'terra'}> = ({em, titulo, secoes, x, tom}) => {
  const p = useEm(em, 0.6);
  return (
    <div style={{position: 'absolute', left: x, top: 210, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <Chip em={em} texto={titulo} tom={tom} tamanho={30} style={{position: 'relative', marginBottom: 26}} />
      <div style={{width: 520, borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 70px rgba(40,25,10,.3)', border: '1px solid #4a4a4a', marginTop: 20, background: APP.lateral}}>
        <div style={{zoom: 2.05}}>
          <Lateral secoes={secoes} soSecoes />
        </div>
      </div>
    </div>
  );
};

export const C2_2: React.FC = () => {
  const porData: Secao[] = [
    {titulo: 'Hoje', itens: [it('estr'), it('inbox'), it('thumb')]},
    {titulo: 'Ontem', itens: [it('news'), it('rel'), it('cal')]},
    {titulo: 'Últimos 7 dias', itens: [it('notas'), it('prop'), it('onb')]},
  ];
  const porAssunto: Secao[] = [
    {titulo: 'Clientes', itens: [it('prop'), it('rel'), it('notas')]},
    {titulo: 'YouTube', itens: [it('thumb'), it('estr')]},
    {titulo: 'Marketing', itens: [it('cal'), it('news'), it('onb')]},
  ];
  return (
    <>
      <ListaMini em={195.5} titulo="Antes: uma lista longa por data" secoes={porData} x={90} tom="claro" />
      <ListaMini em={200.7} titulo="Agora: por assunto" secoes={porAssunto} x={700} tom="terra" />
    </>
  );
};

