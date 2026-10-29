import {loadFont as carregarMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as carregarSora} from '@remotion/google-fonts/Sora';
import {staticFile} from 'remotion';

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;

// Não há vídeo gravado: a narração é a trilha principal e ela manda na duração.
// ffprobe de narracao/narracao.wav: 32,132208 s.
export const DURACAO = 32.132208;
export const QUADROS = Math.round(DURACAO * FPS); // 964

export const f = (s: number) => Math.round(s * FPS);
export const arq = (p: string) => staticFile(`008. ICF - Carta que Vale/${p}`);
export const NARRACAO = arq('narracao/narracao.wav');

// Paleta marca-v1 do ICF. Em fundo claro teal, amarelo e coral são cor gráfica, nunca texto corrido.
export const COR = {
  navy: '#0D1B3D',
  navyEscuro: '#08132D',
  teal: '#14B8A6',
  amarelo: '#F2C94C',
  coral: '#FF6B5B',
  offWhite: '#F2EDE6',
  branco: '#FFFFFF',
};

// Sora nos títulos, Montserrat no corpo: as duas fontes do sistema marca-v1.
export const {fontFamily: SORA} = carregarSora();
export const {fontFamily: MONTSERRAT} = carregarMontserrat();

export const MARGEM = 72;

/** Uma palavra e o segundo exato em que ela é dita (de transcricao/palavras.json). */
export type Tok = {t: string; s: number};
export type Linha = {s: number; e: number; toks: Tok[]};

// Legendas queimadas: Reels roda sem som na maior parte do tempo.
// Todo gatilho vem do palavras.json — nada aparece antes de ser dito.
export const LEGENDAS: Linha[] = [
  {s: 0.00, e: 0.92, toks: [{t: "Seu", s: 0.00}, {t: "filho", s: 0.30}, {t: "tem", s: 0.52}, {t: "um", s: 0.76}]},
  {s: 0.92, e: 2.08, toks: [{t: "monte", s: 0.92}, {t: "de", s: 1.18}, {t: "carta", s: 1.34}, {t: "Pokémon", s: 1.64}]},
  {s: 2.08, e: 3.28, toks: [{t: "jogada", s: 2.08}, {t: "no", s: 2.72}, {t: "chão", s: 2.90}, {t: "do", s: 3.14}]},
  {s: 3.28, e: 4.26, toks: [{t: "quarto.", s: 3.28}]},
  {s: 4.26, e: 5.40, toks: [{t: "Você", s: 4.26}, {t: "pagou", s: 4.56}, {t: "caro.", s: 4.88}]},
  {s: 5.40, e: 6.12, toks: [{t: "Em", s: 5.40}, {t: "dois", s: 5.50}, {t: "meses,", s: 5.72}]},
  {s: 6.12, e: 7.48, toks: [{t: "virou", s: 6.12}, {t: "papel", s: 6.40}, {t: "amassado.", s: 6.66}]},
  {s: 12.08, e: 13.58, toks: [{t: "Carta", s: 12.08}, {t: "de", s: 12.44}, {t: "colecionador", s: 12.60}, {t: "tem", s: 13.36}]},
  {s: 13.58, e: 14.32, toks: [{t: "preço.", s: 13.58}]},
  {s: 14.32, e: 15.54, toks: [{t: "Tem", s: 14.32}, {t: "gente", s: 14.50}, {t: "que", s: 14.80}, {t: "compra,", s: 15.00}]},
  {s: 15.54, e: 16.56, toks: [{t: "vende", s: 15.54}, {t: "e", s: 15.80}, {t: "acompanha", s: 15.98}, {t: "a", s: 16.40}]},
  {s: 16.56, e: 17.32, toks: [{t: "cotação.", s: 16.56}]},
  {s: 17.32, e: 18.10, toks: [{t: "No", s: 17.32}, {t: "dia", s: 17.60}, {t: "em", s: 17.82}, {t: "que", s: 18.02}]},
  {s: 18.10, e: 19.42, toks: [{t: "ele", s: 18.10}, {t: "descobre", s: 18.26}, {t: "que", s: 18.84}, {t: "guardar", s: 18.98}]},
  {s: 19.42, e: 20.82, toks: [{t: "vale", s: 19.42}, {t: "mais", s: 19.70}, {t: "que", s: 19.90}, {t: "rasgar,", s: 20.04}]},
  {s: 20.82, e: 21.80, toks: [{t: "muda", s: 20.82}, {t: "tudo.", s: 21.04}]},
];

export type Cena =
  // Print inteiro na tela, com deriva de zoom. `cinza` dessatura (o papel perdendo valor).
  | {tipo: 'print'; s: number; e: number; img: string; de: number; ate: number; cinza?: boolean}
  // Tipografia grande sobre navy: a frase é o próprio visual, sem legenda por baixo.
  | {tipo: 'frase'; s: number; e: number; linhas: {t: string; s: number; cor?: string}[]}
  // Os dois prints de marketplace, com marca-texto entrando sobre o preço.
  | {tipo: 'precos'; s: number; e: number}
  // Escada: uma palavra por vez, no segundo em que é dita.
  | {tipo: 'escada'; s: number; e: number; rotulo: {t: string; s: number}; degraus: {t: string; s: number}[]}
  | {tipo: 'logo'; s: number; e: number};

export const CENAS: Cena[] = [
  // 1. O problema, mostrado antes de ser nomeado.
  {tipo: 'print', s: 0, e: 4.26, img: 'prints/cartas_leque.png', de: 1, ate: 1.12},
  // 2. Mesma imagem perdendo cor: "virou papel amassado".
  {tipo: 'print', s: 4.26, e: 7.48, img: 'prints/cartas_leque.png', de: 1.12, ate: 1.2, cinza: true},
  // 3. A virada do roteiro em tipografia. Sem legenda: o texto já está na tela.
  {
    tipo: 'frase',
    s: 7.48,
    e: 12.08,
    linhas: [
      {t: 'O PROBLEMA NÃO É A CARTA.', s: 7.48},
      {t: 'NINGUÉM DISSE PRA ELE', s: 9.28},
      {t: 'O QUE ELA VALE.', s: 10.74, cor: COR.amarelo},
    ],
  },
  // 4. A prova: carta de colecionador tem preço.
  {tipo: 'precos', s: 12.08, e: 17.32},
  // 5. A virada da criança.
  {tipo: 'print', s: 17.32, e: 21.80, img: 'prints/criancas_fichario.webp', de: 1.14, ate: 1},
  // 6. Escada: carta, brinquedo, bicicleta, mesada. Cada palavra no segundo em que é dita.
  {
    tipo: 'escada',
    s: 21.80,
    e: 27.18,
    rotulo: {t: 'ELE PASSA A CUIDAR', s: 21.80},
    degraus: [
      {t: 'A CARTA', s: 23.72},
      {t: 'O BRINQUEDO', s: 24.76},
      {t: 'A BICICLETA', s: 25.56},
      {t: 'A MESADA', s: 26.72},
    ],
  },
  // 7. Assinatura. O logo é o SVG/PNG oficial, nunca redigitado.
  {tipo: 'logo', s: 27.18, e: DURACAO},
];

// Medido no próprio print (liga_pikachu_marketplace.png, 1088×800), não estimado:
// a linha "Preço Médio de Venda no Marketplace" e a célula do primeiro "R$ 699,90".
// O número é real e vem do print — por isso aparece na tela, enquanto a narração
// fala só em "tem preço". Nada de estatística inventada.
export const PRECO = {
  print: 'prints/liga_pikachu_marketplace.png',
  larguraPrint: 1088,
  // Recorte mostrado na tela, em pixels do print.
  recorte: {x: 365, y: 330, largura: 690, altura: 72},
  // Célula do primeiro preço, medida numa ampliação 4x do print com régua de 20 px:
  // o marcador verde começa em x 812 e o texto termina em x 868; a linha vai de y 371 a 385.
  celula: {x: 810, y: 366, largura: 62, altura: 22},
  // Largura do recorte na composição: o resto sai dessa proporção.
  larguraNaTela: 936,
  // O texto do print tem 11 px de altura: ampliar até ficar legível no celular borraria tudo.
  // O número entra em tipografia da marca e o recorte do print fica embaixo, como comprovante.
  valor: 'R$ 699,90',
  carta: 'Pikachu 095/127 · LigaPokémon',
};

// O fichário tem a marca d'água do buscador no canto inferior esquerdo.
// Cortamos 34 px de baixo e 30 px da esquerda em vez de deixá-la aparecer.
export const FICHARIO = {
  print: 'prints/criancas_fichario.webp',
  larguraPrint: 654,
  alturaPrint: 422,
  recorte: {x: 30, y: 0, largura: 624, altura: 388},
  larguraNaTela: 936,
};
