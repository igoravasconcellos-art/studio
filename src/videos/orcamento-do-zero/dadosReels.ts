// GERADO por vozes/gerar-reels.py — não edite à mão.
// O Reels é um recorte do vídeo longo: os tempos são os mesmos do
// palavras.json, deslocados para a linha do tempo nova.

export const DURACAO_REELS = 56.90;
export const FIM_DA_FALA = 52.40;

export type CenaR = {n: number; s: number; kw: string | null};
export const CENAS_R: CenaR[] = [{"n": 2, "s": 0.0, "kw": "DESISTIU"}, {"n": 3, "s": 6.29, "kw": "TRÊS COLUNAS"}, {"n": 4, "s": 15.37, "kw": "SEM PLANILHA"}, {"n": 5, "s": 18.61, "kw": null}];

/** Janelas em que a folha das três colunas ocupa a tela. */
export type FolhaR = {s: number; e: number; fonte: number};
export const FOLHAS_R: FolhaR[] = [{"s": 22.05, "e": 28.05, "fonte": 41.4}, {"s": 28.4, "e": 52.4, "fonte": 103.9}];

export type LegendaR = {t: string; s: number; e: number};
export const LEGENDAS_R: LegendaR[] = [{"t": "Se você já tentou fazer um orçamento e desistiu", "s": 0.27, "e": 3.19}, {"t": "na segunda semana, esse vídeo é para você.", "s": 3.19, "e": 5.85}, {"t": "Eu vou te mostrar um jeito de organizar um", "s": 6.29, "e": 8.65}, {"t": "mês que cabe em uma folha de papel,", "s": 8.65, "e": 10.51}, {"t": "em três colunas, e que você monta hoje,", "s": 10.71, "e": 13.61}, {"t": "em 10 ou 15 minutos,", "s": 13.77, "e": 14.99}, {"t": "sem planilha complicada, sem aplicativo obrigatório,", "s": 15.37, "e": 18.23}, {"t": "só caneta, papel e o extrato do seu banco.", "s": 18.61, "e": 21.43}, {"t": "Divida a folha em três colunas,", "s": 22.35, "e": 24.15}, {"t": "o que é essencial,", "s": 24.33, "e": 25.59}, {"t": "desejo e futuro. Essencial é o que você precisa", "s": 26.11, "e": 28.05}, {"t": "porta. Agora, a regra de ouro.", "s": 28.4, "e": 30.08}, {"t": "Preencha a coluna futuro primeiro,", "s": 30.6, "e": 32.32}, {"t": "antes do desejo. Escolha uma quantia,", "s": 32.66, "e": 35.94}, {"t": "mesmo pequena, e anote.", "s": 36.2, "e": 37.72}, {"t": "Isso vai para o futuro já.", "s": 37.84, "e": 39.82}, {"t": "Depois, preencha o essencial.", "s": 40.44, "e": 42.32}, {"t": "E o que sobrar é o que você vai", "s": 42.5, "e": 44.98}, {"t": "ter para os seus desejos.", "s": 44.98, "e": 46.14}, {"t": "Se você inverte a ordem,", "s": 46.58, "e": 48.42}, {"t": "o desejo come tudo e o futuro nunca aparece.", "s": 48.6, "e": 52.16}];
