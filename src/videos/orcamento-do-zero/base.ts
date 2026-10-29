import {loadFont as carregarCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as carregarMontserrat} from '@remotion/google-fonts/Montserrat';
import {staticFile} from 'remotion';
import {DURACAO} from './dados';

// 012. Orçamento do zero — piloto dos dois primeiros blocos do roteiro S01B.
//
// Formato: história ilustrada (projeto 011), com o personagem `igor-ilustrado`.
// Não há vídeo gravado e o avatar não fala na tela: a narração é a trilha principal
// e ela manda na duração. A regra 1 do CLAUDE.md (locked-final-cut) não se aplica.
//
// A construção é híbrida, e é de propósito: a cena ilustrada é imagem gerada, mas
// tudo que é texto ou número — legenda, palavra-chave, a folha das três colunas —
// é desenhado aqui. Nenhum texto dentro de imagem gerada por IA (regra 6).

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;
export const QUADROS = Math.round(DURACAO * FPS);

export const arq = (p: string) => staticFile(`012. Orcamento do Zero/${p}`);
export const NARRACAO = arq('audio/narracao.wav');
export const cena = (n: number) => arq(`cenas/${String(n).padStart(2, '0')}.png`);

const {fontFamily: MONTSERRAT} = carregarMontserrat('normal', {weights: ['600', '700']});
const {fontFamily: CAVEAT} = carregarCaveat('normal', {weights: ['700']});

/** Legenda e rótulos: sem graça de propósito, para não disputar com a ilustração. */
export const FONTE = MONTSERRAT;
/** A palavra-chave que flutua sobre a cena, no jeito manuscrito da referência. */
export const FONTE_MAO = CAVEAT;

// Paleta tirada das próprias ilustrações, para a camada desenhada não destoar.
export const COR = {
  tinta: '#3E2E26',
  papel: '#F6EFE6',
  terracota: '#B86A4B',
  oliva: '#7D8A6A',
  legenda: '#FFFFFF',
};

/**
 * Onde a palavra-chave entra em cada cena. Escolhido olhando cada imagem:
 * ela só pode pousar onde há espaço vazio, e nunca sobre o rosto.
 */
export const POSICAO_KW: Record<number, 'esq' | 'dir' | 'centro'> = {
  2: 'esq',
  3: 'esq',
  4: 'dir',
  7: 'centro',
  8: 'dir',
  9: 'esq',
  11: 'esq',
  12: 'esq',
  16: 'dir',
};

/**
 * Cenas que entram em corte seco, sem dissolver: são os cortes casados, em que o
 * cenário e o enquadramento são os mesmos e só uma coisa muda. Dissolver aqui
 * apagaria justamente o que o corte tem de dizer.
 */
export const CORTE_SECO = new Set([12, 16]);

export const DISSOLVE = 0.45;

/**
 * A folha das três colunas, desenhada sobre a folha em branco da cena 14.
 * Os valores são a fração do quadro ocupada pelo papel, medidos na imagem com
 * uma grade por cima (frames de medição em scratchpad, não no projeto).
 */
export const FOLHA_CENA14 = {x0: 0.228, y0: 0.125, x1: 0.772, y1: 0.8};

/**
 * A folha que ele segura na cena 3, medida do mesmo jeito. Ela é estreita — 17% da
 * largura do quadro —, então só cabem as divisórias: três títulos aqui sairiam com
 * 17 px e ninguém leria num celular. Quem nomeia é a palavra-chave da cena.
 * O papel está levemente inclinado na ilustração; daí a rotação.
 */
export const FOLHA_CENA3 = {x0: 0.608, y0: 0.226, x1: 0.779, y1: 0.772, giro: -3.8};

export const COLUNAS = [
  {titulo: 'ESSENCIAL', cor: COR.tinta},
  {titulo: 'DESEJO', cor: COR.terracota},
  {titulo: 'FUTURO', cor: COR.oliva},
] as const;
