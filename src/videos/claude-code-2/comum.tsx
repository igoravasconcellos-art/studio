import React from 'react';
import {AppDemo, CameraDemo, Crono, T, layoutsDemo} from '../../estilos/demo-tutorial/camera';
import {Conversa, Foco, ListaTarefas, MsgClaude, MsgUsuario, Secao} from '../../estilos/demo-tutorial/app';
import {FONTE, arq} from './base';

// Zona do rosto medida com detector em 1 quadro/s (850 quadros, percentis 2–98) + cabelo e queixo.
export const L = layoutsDemo({x0: 690, y0: 30, x1: 1270, y1: 720});

// [início, layout, duração da transição]
const CRONO: Crono = [
  [0, L.A, 0.01],
  [4.75, T, 0.3],
  [7.0, L.A, 0.35],
  [63.6, L.G, 1.0],
  [77.4, L.D, 0.7],
  [96.0, L.G, 0.8],
  [98.0, L.D, 0.8],
  [117.0, L.E, 0.9],
  [130.4, L.Q, 0.9],
  [143.5, L.E, 0.9],
  [155.6, L.G, 0.9],
  [164.0, L.E, 0.9],
  [172.6, L.D, 0.9],
  [195.0, L.G, 1.0],
  [228.0, L.D, 0.9],
  [240.4, L.G, 0.9],
  [247.8, T, 0.25],
  [250.5, L.D, 0.3],
  [258.8, L.G, 0.9],
  [275.0, L.E, 0.9],
  [280.4, L.D, 0.9],
  [309.6, L.H, 0.9],
  [318.9, L.G, 0.9],
  [335.1, L.D, 0.9],
  [369.3, L.E, 0.9],
  [384.6, L.D, 0.9],
  [392.2, L.G, 0.9],
  [395.5, T, 0.25],
  [400.0, L.G, 0.3],
  [411.3, L.D, 0.9],
  [438.2, L.G, 0.9],
  [445.0, L.D, 0.9],
  [471.2, L.E, 0.9],
  [480.7, L.G, 0.9],
  [483.5, L.H, 0.9],
  [511.0, L.G, 0.9],
  [532.6, L.D, 0.9],
  [608.7, L.G, 0.9],
  [613.6, L.D, 0.9],
  [620.4, L.G, 0.8],
  [624.0, L.D, 0.8],
  [651.6, L.G, 0.9],
  [666.8, L.D, 0.9],
  [699.0, L.H, 0.9],
  [715.6, L.D, 0.9],
  [724.8, L.G, 0.9],
  [739.0, L.D, 0.9],
  [753.0, L.G, 0.9],
  [755.8, L.Q, 0.9],
  [763.8, T, 0.25],
  [767.1, L.G, 0.3],
  [781.5, L.D, 0.9],
  [803.4, L.A, 1.2],
];

export const Camera: React.FC = () => <CameraDemo crono={CRONO} src={arq('Claude 2.mp4')} />;
export const App: React.FC<{focos?: Foco[]; children: React.ReactNode}> = (p) => <AppDemo crono={CRONO} {...p} />;

// ---------- dados do exemplo (os mesmos do começo ao fim) ----------

export const N = {
  rel: 'Relatório semanal do cliente',
  cal: 'Calendário de conteúdo do 4º tri',
  prop: 'Proposta Brightline Dental',
  news: 'Rascunho da newsletter',
  thumb: 'Ideias de thumbnail',
  notas: 'Notas da reunião Northwind',
  estr: 'Estrutura do vídeo',
  onb: 'E-mails de onboarding',
  inbox: 'Triagem da caixa de entrada',
  plano: 'Plano semanal de conteúdo',
  video: 'Vídeo da próxima semana',
  pesq: 'Pesquisa',
  tit: 'Títulos e thumbnails',
  rot: 'Roteiro',
  vis: 'Visual e edição',
  tudo: 'Tudo sobre o vídeo',
  resumo: 'Resumo do relatório de cliente',
  leads: 'Mudanças na pontuação de leads',
  audit: 'Auditoria de instruções',
  skills: 'Custo das skills',
  onbNovo: 'Reformular o onboarding',
};
export type ChaveN = keyof typeof N;
export const it = (id: ChaveN, extra: object = {}) => ({id, nome: N[id], ...extra});

export const FIXADOS: Secao = {titulo: 'Fixados', itens: [it('plano')]};
export const PADRAO: ChaveN[] = ['rel', 'cal', 'prop', 'news', 'thumb', 'notas', 'estr', 'onb', 'inbox'];
export const LISTA_SOLTA = (fora: string[] = [], base: ChaveN[] = PADRAO, extra: ChaveN[] = []): Secao => ({
  titulo: 'Este computador',
  itens: [...extra, ...base].filter((k) => !fora.includes(k)).map((k) => it(k)),
});
// Barra lateral depois de organizada (a partir do bloco de seções).
export const ORGANIZADA = (extraTopo: ChaveN[] = [], videoAberto?: number, filhosEm: number[] = []): Secao[] => [
  FIXADOS,
  {titulo: 'Clientes', itens: [it('rel'), it('prop'), it('notas')]},
  {
    titulo: 'YouTube',
    itens: [
      it('video', {
        abertoEm: videoAberto,
        filhos: (['pesq', 'tit', 'rot', 'vis'] as ChaveN[]).map((k, i) => it(k, filhosEm[i] !== undefined ? {novoEm: filhosEm[i]} : {})),
      }),
      it('thumb'),
      it('estr'),
    ],
  },
  {titulo: 'Este computador', itens: [...extraTopo.map((k) => it(k)), it('cal'), it('news'), it('onb'), it('inbox')]},
];

export const TAREFAS = [
  'Ler o relatório da semana passada',
  'Buscar os números desta semana no controle',
  'Conferir e-mails do cliente e o Slack',
  'Escrever o relatório semanal',
  'Conferir cada número no controle',
];
export const SAIDAS = [
  {nome: 'Relatório semanal Northwind - 24 out.md', sub: 'Criado · relatorios/'},
  {nome: 'Controle semanal Northwind', sub: 'Lido · Google Drive'},
];

export const Mono: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: FONTE.mono, fontSize: 13.5, background: '#333', borderRadius: 5, padding: '1px 5px'}}>{children}</span>
);

export const PedidoRelatorio: React.FC<{em?: number}> = ({em}) => (
  <MsgUsuario em={em}>
    <b style={{fontWeight: 600, letterSpacing: 0.5, fontSize: 13}}>A TAREFA</b>
    <br />
    Escreva o relatório desta semana para a Northwind Logistics: o que fizemos, os resultados e o que vem a seguir.
  </MsgUsuario>
);

export const ConversaRelatorio: React.FC<{painel?: React.ReactNode; feitos?: number[]; listaEm?: number; final?: boolean; extra?: React.ReactNode; caixa?: React.ReactNode; hoverPontos?: boolean; rolagem?: number}> = ({
  painel,
  feitos = [0, 0, 0, 0, 0],
  listaEm,
  final = true,
  extra,
  caixa,
  hoverPontos,
  rolagem,
}) => (
  <Conversa titulo={N.rel} painel={painel} caixa={caixa} hoverPontos={hoverPontos} rolagem={rolagem}>
    <PedidoRelatorio />
    <MsgClaude>Vou planejar primeiro e depois trabalhar em cada etapa.</MsgClaude>
    <ListaTarefas em={listaEm} itens={TAREFAS} feitos={feitos} />
    {final && (
      <MsgClaude>
        O relatório está em <Mono>relatorios/Relatório semanal Northwind - 24 out.md</Mono>. Conferi cada número no controle, acrescentei os dois pedidos do cliente que chegaram por
        e-mail e as atualizações da equipe no Slack. Nada foi enviado ao cliente.
      </MsgClaude>
    )}
    {extra}
  </Conversa>
);
