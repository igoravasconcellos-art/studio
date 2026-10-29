import {ZonaRosto} from '../../_shared/enquadramento';

// 009. Avatar Igor — o Padrão Nalu: explainer 16:9 com o avatar como narrador.
//
// Molde de direção: referencias/awesome-opus5-5-videos, prompt `twoclipping-000267`
// ("high-end minimal: uma ideia por plano, muito espaço vazio, uma cor de destaque, uma
// tipografia só, revelações de texto por máscara, cortes de empurrão, material real sempre").
// Duas regras de movimento vêm do `twoclipping-551116`: a câmera nunca para, e nada aparece
// de estalo — as linhas sobem atravessando uma linha de máscara, uma por vez.
//
// Proibido aqui, por escrito, porque é o que faz um vídeo parecer amador: brilho, degradê em
// moldura, easing saltitante, tremor de câmera, estalo de entrada, fundo piscando, painel
// flutuante com borda, ponto final em texto de tela.

export const LARGURA = 1920;
export const ALTURA = 1080;

// Os clipes de fala são verticais: 1076×1928, saídos do Wan 2.7.
export const CLIPE_LARGURA = 1076;
export const CLIPE_ALTURA = 1928;

/**
 * Zona do rosto medida nos quadros reais: 1 por segundo dos três clipes (30 quadros),
 * união das caixas, em frames/zona_grade_linhas.png. O cabelo encosta no topo e o queixo
 * desce até ~830 px no quadro mais fechado. Todo card nasce daqui, via enquadrarRosto.
 */
export const ZONA_ROSTO: ZonaRosto = {x0: 180, y0: 0, x1: 950, y1: 830};

/* ----------------------------------------------------------------------------
   A grade. É isto que faltava: toda posição sai daqui, nada é olhômetro.
---------------------------------------------------------------------------- */

/** Margem de segurança em todos os lados, e o vão entre a coluna de texto e o avatar. */
export const MARGEM = 140;
export const VAO = 32;

/** Escala tipográfica. Quatro tamanhos, nenhum valor fora desta lista. */
export const TIPO = {
  /** O número ou a palavra que é a ideia do plano. Um por vídeo, no máximo dois. */
  heroi: 200,
  /** A frase do plano. */
  titulo: 112,
  /** A segunda linha, quando a frase não cabe em uma. */
  sub: 76,
  /** Rótulo em caixa alta com entreletra aberta: diz o que a tela mostra, nunca repete o áudio. */
  rotulo: 34,
} as const;

/** Formatos do card do avatar. Verticais, porque o clipe é vertical. Medidas já validadas. */
export const CARD = {
  grande: {w: 560, h: 900},
  mini: {w: 300, h: 520},
  // "Herói" é card emoldurado, não tela cheia: no clipe mais fechado o alto do cabelo já sai do
  // quadro gerado, e emoldurar deixa isso como enquadramento em vez de erro de corte.
  heroi: {w: 700, h: 960},
} as const;

export type Geometria = {x: number; y: number; w: number; h: number};

/**
 * Três âncoras, só. O avatar é o elemento que atravessa o vídeo inteiro sem ser cortado —
 * ele desliza entre estas posições e nunca para em outro lugar. É o corte casado do molde:
 * o fundo e o texto trocam, ele continua.
 */
export const ANCORA: Record<keyof typeof CARD, Geometria> = {
  grande: {x: LARGURA - MARGEM - CARD.grande.w, y: (ALTURA - CARD.grande.h) / 2, ...CARD.grande},
  mini: {x: LARGURA - MARGEM - CARD.mini.w, y: ALTURA - 100 - CARD.mini.h, ...CARD.mini},
  heroi: {x: LARGURA - MARGEM - CARD.heroi.w, y: ALTURA - 60 - CARD.heroi.h, ...CARD.heroi},
};

/** Largura da coluna de texto: da margem até o avatar, menos o vão. Sem invadir. */
export const colunaDe = (ancora: keyof typeof CARD) => ANCORA[ancora].x - VAO - MARGEM;

/* ----------------------------------------------------------------------------
   As oito batidas. Uma ideia por batida, e nada mais na tela.
---------------------------------------------------------------------------- */

export type Cena = {
  id:
    | 'gancho'
    | 'corrida'
    | 'contraste'
    | 'respiro'
    | 'conta'
    | 'selos'
    | 'ordem'
    | 'fecho';
  /** O segundo em que a batida começa — sempre um tempo do palavras.json. */
  s: number;
  /** Superfície de tela cheia. Duas, alternadas: nada de painel flutuante. */
  fundo: 'navy' | 'claro';
  ancora: keyof typeof CARD;
};

export const CENAS: Cena[] = [
  // 1. O gancho, na frase mais forte. Avatar grande: o espectador conhece o narrador em 1 s.
  {id: 'gancho', s: 0, fundo: 'navy', ancora: 'grande'},
  // 2. A consequência, como processo: a pista que se rompe. O conteúdo manda, o avatar encolhe.
  {id: 'corrida', s: 4.08, fundo: 'claro', ancora: 'mini'},
  // 3. A tese, em duas palavras separadas por uma régua.
  {id: 'contraste', s: 8.22, fundo: 'navy', ancora: 'grande'},
  // 4. Respiro antes da conta: o avatar vem para a frente e anuncia.
  {id: 'respiro', s: 14.22, fundo: 'claro', ancora: 'heroi'},
  // 5. A conta prometida no gancho, aos 16 s. Tipografia herói, nada mais.
  {id: 'conta', s: 15.9, fundo: 'navy', ancora: 'mini'},
  // 6. As três qualidades, uma por palavra dita.
  {id: 'selos', s: 19.58, fundo: 'claro', ancora: 'grande'},
  // 7. A ordem das coisas, como dois passos numerados.
  {id: 'ordem', s: 23.46, fundo: 'navy', ancora: 'mini'},
  // 8. O fecho, com a última palavra entrando por último. Âncora `grande` porque a palavra
  // final é a maior do vídeo e precisa da coluna inteira: em `heroi` ela passava por baixo do card.
  {id: 'fecho', s: 25.94, fundo: 'claro', ancora: 'grande'},
];

/** Janela do deslize do avatar entre âncoras. A cor do fundo troca em 0,35 s (regra do molde). */
export const TRANSICAO = 0.9;
export const TROCA_DE_COR = 0.35;

/**
 * Gatilhos de conteúdo, todos vindos de transcricao/palavras.json.
 * Nada aparece antes de ser dito, e cada linha sobe atravessando a máscara no instante da palavra.
 */
export const GATILHO = {
  gancho: [
    {t: 'INVESTIR SEM RESERVA', s: 0.0},
    {t: 'É CORRER DE', s: 1.52},
    {t: 'TÊNIS FURADO', s: 2.64},
  ],
  corridaLargada: 4.08,
  corridaBuraco: 5.64,
  corridaQueda: 6.8,
  contrasteReserva: 8.22,
  contrasteInvestimento: 9.96,
  contrasteTrava: 11.9,
  respiro: 14.22,
  contaRotulo: 15.9,
  contaMes: 16.6,
  contaMultiplica: 17.64,
  contaTotal: 17.9,
  selos: [
    {t: 'LÍQUIDO', s: 19.58},
    {t: 'DISPONÍVEL', s: 20.1},
    {t: 'CHATO', s: 20.74},
  ],
  seloPonto: 21.66,
  ordemColchao: 23.46,
  ordemSeta: 24.5,
  ordemRendimento: 24.82,
  fechoLinha1: 25.94,
  fechoLinha2: 28.4,
  fechoCarimbo: 29.02,
} as const;
