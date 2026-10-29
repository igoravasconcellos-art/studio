// GERADO por vozes/gerar-dados.py a partir da transcrição — não edite à mão.
// Todo gatilho é o início exato de uma palavra dita (regra 3 do CLAUDE.md).

export const DURACAO3 = 42.26;

export type Plano3 = {tipo: string; n: number; s: number};
export const PLANOS3: Plano3[] = [{"tipo": "img", "n": 23, "s": 0.0}, {"tipo": "valores", "n": 0, "s": 4.6}, {"tipo": "img", "n": 26, "s": 31.9}, {"tipo": "valores", "n": 1, "s": 35.5}];

/** O segundo em que cada número começa a ser falado. */
export const VALORES: Record<string, number> = {"total": 3.0, "futuro": 5.82, "aluguel": 10.98, "mercado": 13.06, "luz": 14.72, "internet": 17.42, "transporte": 19.38, "escola": 21.6, "soma": 23.44, "desejo": 26.16, "teto": 30.88};

export type Legenda3 = {t: string; s: number; e: number};
export const LEGENDAS3: Legenda3[] = [{"t": "Vamos montar com um casal de R$ 4.500,00,", "s": 0.46, "e": 3.88}, {"t": "futuro R$ 400,00,", "s": 4.6, "e": 6.42}, {"t": "estão separados já, então vamos para o essencial,", "s": 6.58, "e": 9.58}, {"t": "aluguel de R$ 1.100,00,", "s": 10.16, "e": 11.48}, {"t": "mercado de R$ 800,00,", "s": 11.98, "e": 13.38}, {"t": "luz e água de R$ 230,00,", "s": 13.68, "e": 15.42}, {"t": "internet celular de R$ 210,00,", "s": 15.82, "e": 17.88}, {"t": "transporte de R$ 410,00,", "s": 18.18, "e": 20.0}, {"t": "escola de R$ 350,00,", "s": 20.36, "e": 21.96}, {"t": "soma R$ 3.100,00,", "s": 22.42, "e": 24.8}, {"t": "sobamos desejos R$ 1.000,00,", "s": 24.8, "e": 26.52}, {"t": "delivery, lazer e compras pequenas,", "s": 27.0, "e": 29.3}, {"t": "tem um teto de R$ 1.000,00", "s": 29.3, "e": 31.06}, {"t": "por mês, repare, o casal não cortou o prazer", "s": 31.06, "e": 34.72}, {"t": "da vida, só decidiu,", "s": 34.72, "e": 36.26}, {"t": "antes do mês começar,", "s": 36.38, "e": 37.7}, {"t": "que R$ 400,00 vão para o futuro,", "s": 38.06, "e": 40.2}, {"t": "e que o desejo tem um teto.", "s": 40.44, "e": 42.26}];
