# 6. O Padrão Nalu

Este é o formato fixo dos vídeos de educação financeira do canal: **explainer 16:9 com o avatar
como narrador**. Ele existe para você não reinventar a direção a cada vídeo — você escreve o
roteiro dentro do molde, e a montagem já sabe o que fazer.

O molde de direção veio de fora: `twoclipping-000267`, do acervo
[referencias/](../referencias/README.md). Duas regras de movimento vieram do `twoclipping-551116`.
O que está aqui é a adaptação ao nosso assunto, já testada no projeto `009. Avatar Igor`.

Código do padrão: [`src/videos/avatar-igor/cenas.ts`](../src/videos/avatar-igor/cenas.ts) (os dados)
e [`Explainer.tsx`](../src/videos/avatar-igor/Explainer.tsx) (o desenho). Para um vídeo novo você
troca as cenas e os gatilhos. **A estrutura não muda.**

---

## Uma honestidade, antes de tudo

**Ninguém prevê viral.** Não existe formato que garanta alcance, e quem promete está vendendo
alguma coisa. O que existe são os motivos concretos de a pessoa deslizar o dedo, e este padrão
tira esses motivos um por um. É isso que ele faz, e só isso.

---

## As oito batidas

Trinta segundos, oito planos, **uma ideia por plano**. Esta é a forma do roteiro: você escreve
oito frases, uma por linha, respeitando o tempo de cada uma.

| # | Batida | Tempo | O que a frase tem de fazer |
|---|---|---|---|
| 1 | **Gancho** | ~4 s | Diz o erro que custa dinheiro, com uma imagem concreta. Termina numa palavra que dá para desenhar |
| 2 | **Consequência** | ~4 s | O que acontece com quem comete o erro. Vira processo na tela: algo avança e quebra |
| 3 | **Tese** | ~6 s | A distinção que o nicho confunde. Duas palavras opostas, uma contra a outra |
| 4 | **Respiro** | ~1,7 s | Anuncia o que vem. Uma frase curta, o avatar vem para a frente |
| 5 | **O número** | ~3,7 s | A regra prática. **Um número só** na tela inteira |
| 6 | **As qualidades** | ~4 s | Três palavras, uma por vez. A terceira é a virada — a que parece defeito e é a vantagem |
| 7 | **A ordem** | ~2,4 s | A sequência, em dois passos numerados. Primeiro isto, depois aquilo |
| 8 | **Fecho** | ~4 s | Devolve a promessa do gancho como ação. A última palavra é a mais forte |

**Tamanho do roteiro: 75 a 85 palavras.** Mais que isso não cabe em 30 s sem a narração acelerar,
e narração acelerada cansa.

### O exemplo que já está pronto

> **1.** Investir sem reserva de emergência é correr uma maratona de tênis furado.
> **2.** Você até sai na frente, mas o primeiro buraco te tira da corrida.
> **3.** Reserva não é investimento. Reserva é o que te impede de vender o seu investimento, no
> pior dia possível.
> **4.** E a conta é simples:
> **5.** quanto a sua casa gasta por mês, vezes seis.
> **6.** Esse dinheiro fica líquido, disponível e chato. Chato é exatamente o ponto.
> **7.** Primeiro o colchão. Depois o rendimento.
> **8.** Se a sua reserva ainda não está pronta, ela é o seu próximo investimento.

---

## O que aparece na tela

**A grade manda.** Margem de 140 px em toda volta, uma coluna de texto à esquerda, o avatar à
direita. Nada é posicionado no olhômetro: toda medida sai de `cenas.ts`.

**Quatro tamanhos de letra, e nenhum fora da lista:** herói 200 (o número), título 112 (a frase),
sub 76 (a segunda linha), rótulo 34 em caixa alta com entreletra aberta.

**Duas superfícies de tela cheia**, navy e claro, alternando a cada batida. Sem painel flutuante,
sem moldura, sem card de enfeite: foi exatamente isso que deixou a primeira versão pesada.

**Uma cor de destaque só: o turquesa.** Sobre o navy ela vira a palavra. Sobre o claro ela não tem
contraste, então ali o destaque é a tinta cheia com uma régua turquesa embaixo.

**Três âncoras para o avatar, e só três.** Ele desliza entre elas e é o que costura um plano no
seguinte: o fundo troca, o texto troca, ele continua. Nunca é cortado no rosto — todo card nasce
da zona do rosto medida nos quadros, via `enquadrarRosto`.

### Movimento

- **Nada entra de estalo.** Cada linha sobe atravessando uma linha de máscara, em 0,55 s.
- **A câmera nunca para.** Empurrão lento de 1,00 a 1,035 em cada plano, só na camada de texto.
- **O conteúdo entra depois que o plano começa e sai antes do seguinte.** É o que impede texto de
  se sobrepor.
- **A cor do fundo troca em 0,35 s.** Nunca um corte seco, nunca uma piscada.
- **Todo gatilho vem do `palavras.json`.** O que aparece entra no instante da palavra. Animação
  solta vira enfeite, e enfeite cansa.

### Proibido

Está escrito no topo do `Explainer.tsx` porque é o que faz um vídeo parecer amador:

brilho · degradê em moldura · easing saltitante · tremor de câmera · estouro de partículas ·
estalo de entrada · fundo piscando · painel flutuante com borda · ponto final em texto de tela ·
texto que repete o que a voz está dizendo (legenda é a exceção, e este padrão não usa legenda)

---

## Como escrever o próximo roteiro

1. **Escolha o erro.** Um só, que custe dinheiro de verdade e que o seu público cometa.
2. **Ache a imagem.** O gancho precisa de uma metáfora concreta, de coisas que existem: tênis
   furado, colchão, buraco na pista. Nada abstrato.
3. **Escreva as oito frases** na tabela acima, respeitando os tempos. Leia em voz alta com o
   cronômetro: se passar de 30 s, corte palavra, não corte batida.
4. **Marque o que vira desenho.** Na batida 2 (o processo) e na 5 (o número) a tela mostra, não
   escreve. Diga qual é o desenho.
5. **Confira a promessa.** Se o gancho promete um número, uma lista ou uma resposta, ela tem de
   chegar — e antes do fim. Neste molde ela chega na batida 5, aos 16 s.
6. Narração no VoiceStudio → `tools/transcrever.py` → `palavras.json` → **confira a transcrição
   contra o roteiro** (o TTS já engoliu palavras uma vez) → clipes de fala no Wan 2.7 →
   trocar os dados em `cenas.ts`.

### A lista de conferência antes de renderizar

- [ ] Os dois primeiros segundos começam pela frase mais forte, sem apresentação e sem rodeio
- [ ] Cada plano tem **uma** ideia. Nenhum tem duas
- [ ] Todo texto na tela é legível num celular na mão
- [ ] Nenhum texto na tela repete o que a voz está dizendo naquele instante
- [ ] A promessa do gancho é cumprida antes do último segundo
- [ ] Nenhuma palavra passa por baixo do card do avatar
- [ ] `npm run typecheck` passa, incluindo a verificação de enquadramento do rosto

---

## O que este padrão ainda não cobre

- **A versão vertical.** A composição `AvatarVertical` ainda está no formato antigo, de legenda
  sobre o avatar em tela cheia. Para o Short falar a mesma língua, as cenas precisam ser adaptadas
  para painel em cima e avatar embaixo.
- **Som.** O molde original coloca um efeito em cada evento e normaliza em −14 LUFS. Aqui ainda só
  existe a narração.
- **A voz.** É sintética. Trocar pela voz do Igor exige regerar o lip-sync.
