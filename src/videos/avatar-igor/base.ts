import {staticFile} from 'remotion';

// 009. Avatar Igor — vídeo de teste do avatar em desenho.
// Não há vídeo gravado: a fala é narração do VoiceStudio e a imagem é gerada na Higgsfield,
// então a regra 1 do CLAUDE.md (locked-final-cut) não se aplica. A duração vem da narração.

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;

export const f = (s: number) => Math.round(s * FPS);
export const arq = (p: string) => staticFile(`009. Avatar Igor/${p}`);

export const NARRACAO = arq('audio/narracao.wav');

// ffprobe da narração: 29,692708 s. Os cortes caem nas pausas entre frases.
export const DURACAO = 29.692708;
export const QUADROS = f(DURACAO); // 891

/** Os três clipes de fala gerados no Wan 2.7, na ordem. `fim` é o corte no áudio contínuo. */
export const CLIPES = [
  {arquivo: arq('hf/01_fala.mp4'), inicio: 0, fim: 13.91},
  {arquivo: arq('hf/02_fala.mp4'), inicio: 13.91, fim: 25.75},
  {arquivo: arq('hf/03_fala.mp4'), inicio: 25.75, fim: DURACAO},
] as const;

// Paleta Nalu Invest, a mesma da série Praia.
export const COR = {
  navy: '#07253A',
  navyProfundo: '#041723',
  branco: '#FFFFFF',
  turquesa: '#19D3C5',
  turquesaClaro: '#7FEAE0',
  coral: '#FF6B4A',
};

export const FONTE = "'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif";

// Faixa útil do texto: abaixo do queixo do avatar e acima da interface dos apps.
// O rosto ocupa o terço superior; os últimos ~420 px ficam livres por regra do formato vertical.
export const FAIXA = {topo: 1180, altura: 300} as const;
export const MARGEM = 60;

/** Uma palavra e o segundo exato em que ela é dita, de transcricao/palavras.json. */
export type Tok = {t: string; s: number; e: number};

/**
 * Blocos de texto. Todo gatilho vem do palavras.json: nada aparece antes de ser dito.
 * `legenda` corre na faixa de baixo; os outros tomam o lugar dela para não competir.
 */
export type Bloco =
  | {tipo: 'legenda'; s: number; e: number; toks: Tok[]}
  | {tipo: 'numero'; s: number; e: number; rotulo: string; valor: string}
  | {tipo: 'chips'; s: number; e: number; itens: Tok[]}
  | {tipo: 'fecho'; s: number; e: number; linhas: string[]; s2: number};

export const BLOCOS: Bloco[] = [
  // Gancho e tese: legenda palavra por palavra, a falada em destaque.
  {
    tipo: 'legenda',
    s: 0,
    e: 3.9,
    toks: [
      {t: 'INVESTIR SEM RESERVA', s: 0, e: 1.5},
      {t: 'É CORRER DE', s: 1.5, e: 2.6},
      {t: 'TÊNIS FURADO', s: 2.6, e: 3.9},
    ],
  },
  {
    tipo: 'legenda',
    s: 4.08,
    e: 7.9,
    toks: [
      {t: 'VOCÊ ATÉ SAI NA FRENTE', s: 4.08, e: 5.5},
      {t: 'MAS O PRIMEIRO BURACO', s: 5.64, e: 6.8},
      {t: 'TE TIRA DA CORRIDA', s: 6.8, e: 7.9},
    ],
  },
  {
    tipo: 'legenda',
    s: 8.22,
    e: 13.7,
    toks: [
      {t: 'RESERVA NÃO É INVESTIMENTO', s: 8.22, e: 9.7},
      {t: 'É O QUE TE IMPEDE DE VENDER', s: 9.96, e: 11.9},
      {t: 'NO PIOR DIA POSSÍVEL', s: 11.9, e: 13.7},
    ],
  },
  // A conta prometida no gancho chega aqui, aos 16 s: número grande, nada mais na tela.
  {tipo: 'numero', s: 15.9, e: 18.5, rotulo: 'GASTO DA CASA POR MÊS', valor: '× 6'},
  // Três qualidades, um chip por palavra falada.
  {
    tipo: 'chips',
    s: 19.58,
    e: 23.3,
    itens: [
      {t: 'LÍQUIDO', s: 19.58, e: 23.3},
      {t: 'DISPONÍVEL', s: 20.1, e: 23.3},
      {t: 'CHATO', s: 20.74, e: 23.3},
    ],
  },
  {
    tipo: 'legenda',
    s: 23.46,
    e: 25.56,
    toks: [
      {t: 'PRIMEIRO O COLCHÃO', s: 23.46, e: 24.4},
      {t: 'DEPOIS O RENDIMENTO', s: 24.5, e: 25.56},
    ],
  },
  // Fecho: a frase que amarra, em tipografia grande.
  {
    tipo: 'fecho',
    s: 25.94,
    e: DURACAO,
    linhas: ['SUA RESERVA', 'É O SEU PRÓXIMO'],
    s2: 28.64,
  },
];
