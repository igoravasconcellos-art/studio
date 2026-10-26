---
name: demo-tutorial
description: >
  Edição no estilo Demo Tutorial no Studio (~/dev/Studio/studio): o Macks em câmera conduzindo uma demonstração
  do Claude desktop (ou outro app) reconstruído em camadas no Remotion, com cursor, cliques, digitação, menus,
  zoom no que está sendo falado, tela dividida com a câmera em card (vertical, 16:9, quadrada) e tela cheia na
  abertura e no fechamento. Funciona com qualquer entrada: pacote de direção do Roteirista + gravação, gravação +
  roteiro, só a gravação, ou só o roteiro (animatic). Tira os prints do app real quando faltam. Acione quando o
  Macks pedir "estilo demo tutorial", "edição demo", "tutorial mostrando o app", "reconstruir a tela do Claude",
  "edita como o vídeo do Claude Code 2.0", ou trouxer um projeto do Studio com pasta direcao/ de roteiro demo.
  NÃO acione para aula em papel recortado, vídeos verticais curtos ou roteiro sem edição (roteiro demo é no Roteirista).
---

# Demo Tutorial

Resultado: parece que o Macks está mostrando o **próprio** Claude desktop num tutorial. A interface é recriada fiel (tema, rótulos em português, estrutura atual), a câmera dele fica num card ao lado, e o zoom acompanha a fala. Referência completa: projeto `006. claude-code-2-0` (código em `src/videos/claude-code-2/`, plano em `projetos/006. claude-code-2-0/plano.md`).

Esta skill complementa o `CLAUDE.md` do Studio (regras de master intocável, rosto livre, aprovações) e os guias de nível; não os substitui.

## Peças prontas (`src/estilos/demo-tutorial/`)

| arquivo | o que tem |
|---|---|
| `base.tsx` | cores (`COR` mesa creme, `APP` tema escuro do app), fontes, `Cena`, `useAgora` (segundos absolutos do master), `useEm`, `useMola`, `useDigitado`, `Mesa`, `Chip`, `Marca`, `Cartela` (01/07), `Broll`, `Asterisco` |
| `app.tsx` | `JanelaApp`, `Lateral` (seções, árvore de threads, `soSecoes`), `Conversa`, `Cabecalho`, `Caixa`, `MsgUsuario`, `MsgClaude`, `Ferramenta`, `Trabalhando`, `ListaTarefas`, cartões do painel (`CartaoAmbiente`, `CartaoContexto`, `CartaoConectores`, `CartaoSaidas`, `CartaoProgresso`), `Menu`, `Modal`, `Botao`, `Chave`, `Cursor`, `Enquadro` (zoom) |
| `camera.tsx` | `layoutsDemo(rosto)` → A, G, D, E, H, Q · `T` (B-roll) · `Crono` · `CameraDemo` · `AppDemo` |
| `diagrama.tsx` | `Folha`, `MiniChat`, `No` (asterisco), `Linha` (que se desenha), `TituloDiagrama`, `BarraContexto`, `IconeGrande` |

Exemplo sem vídeo: composição `DemoTutorial` (`src/estilos/DemoTutorial.tsx`). Componente que não existe ainda (artefato novo, tela de outro app): crie no projeto; se servir para outros vídeos, promova para `app.tsx`.

## Entradas

| o que chegou | caminho |
|---|---|
| pacote `direcao/` do Roteirista + gravação | casar cenas com a fala real (passo 4) |
| gravação + roteiro | escrever o pacote a partir do roteiro, depois casar |
| só a gravação | transcrever, achar o que está sendo demonstrado, escrever o pacote |
| só o roteiro | animatic: mesma montagem com `CameraFalsa` e tempos a 150 palavras/min, para validar ritmo antes de gravar |

O formato do pacote está em [references/pacote-direcao.md](references/pacote-direcao.md). Sempre que você mesmo escrever a direção, use esse formato e salve em `projetos/<NNN. slug>/direcao/`.

## Fluxo

1. **Organizar e transcrever** (guia do nível). Confira o `transcript.md` por buracos: o VAD do faster-whisper engole trechos (no 006 sumiram 8 s). Buraco > 2 s entre frases → retranscreva o trecho sem VAD e insira no `palavras.json`.
2. **Zona do rosto**: `scripts/rosto.py` (1 quadro/s, vídeo inteiro). Use os percentis p2/p98 + ~40 px de cabelo e ~60 px de queixo. Passe para `layoutsDemo`; se `enquadrarRosto` reclamar, o card é pequeno demais para o rosto.
3. **Prints do app real.** A reconstrução copia o app **do Macks**, não o da fonte (no 006 o dele era escuro e a referência clara). Peça licença uma vez (AskUserQuestion), depois:
   - `open -a Claude` + `screencapture -x prints/<nome>.png` (tela inteira, Retina: pixel ÷ 2 = ponto);
   - navegue com `osascript -l JavaScript scripts/clique.js x y` (clique) ou `… x y move` (hover, abre submenu); `Esc` com `osascript -e 'tell application "System Events" to key code 53'`;
   - capture: barra lateral, uma conversa com o painel direito, cartões abertos, menu ⋯ da conversa e submenus, menu ⋯ do topo, menu de `/`, páginas (Projetos, Artefatos) e o que o vídeo cita;
   - **não altere nada**: só abrir, passar o mouse e fechar. Se digitar `/` numa caixa, apague; não clique em itens que executam ação; anote em que tela o app ficou;
   - para sites, Chrome logado conforme o CLAUDE.md global (perguntar antes).
   Amostre as cores dos prints (PIL) e confira os rótulos: o app real manda sobre o pacote de direção (ex.: "Chat lateral", "Mover para a seção"). Atualize `APP` em `base.tsx` se o tema mudou.
4. **Casar direção e fala** no `plano.md` (ponto de aprovação): tabela de **variações entre roteiro e fala** (o que foi dito manda), correções de nome na tela, e a timeline por bloco com início, câmera, o que aparece e a palavra-gatilho. Nada de terceiros na tela (nomes, pastas, selos); números de demo ficam como demonstração. Liste os prints que ainda faltam e de onde vêm.
5. **Higgsfield (opcional, ~40 cr no 006)**: poucos B-rolls no mundo do estúdio do Macks (use um recorte do cenário dele, sem o rosto, como `image_references`): Mac de frente e celular com **tela preta e reta** (a interface entra na montagem; meça o retângulo da tela com PIL), objeto da metáfora de um bloco. Sem texto nas imagens. B-roll em tela cheia ≤ 5 s.
6. **Programar** em `src/videos/<slug>/`:
   - `base.tsx`: `export * from '../../estilos/demo-tutorial/base'` + `FPS`, `DURACAO`, `arq`;
   - `comum.tsx`: `L = layoutsDemo(ROSTO)`, o `CRONO` único (câmera e app mudam juntos), `Camera`/`App`, e os **dados do exemplo** (nomes de conversa, tarefas, saídas) iguais do começo ao fim;
   - `blocoN.tsx`: uma cena por componente, tempos absolutos tirados do `palavras.json` (gere um índice compacto palavra·tempo e leia por bloco);
   - `<Slug>.tsx`: lista `SOB` (app, diagramas, B-roll: embaixo da câmera) e `SOBRE` (elementos de tela cheia na abertura e no fechamento: em cima da câmera). Entre telas do app use entrada `corte`, para a janela não piscar.
7. **Conferir** com `node skills/demo-tutorial/scripts/stills.mjs <Composicao> <pasta> <segundos…>` (um bundle para todos), montando folhas 3×3 com PIL. Uma still a cada ~10 s na primeira passada; depois, só os pontos corrigidos.
8. **Render**: `npx remotion render src/index.ts <Composicao> <saida>.mp4 --muted --codec=h264 --crf=18 --concurrency=6`, depois `ffmpeg -i video.mp4 -i master -map 0:v -map 1:a -c copy -movflags +faststart` (áudio do master bit a bit). Valide com ffprobe (duração ±1 quadro, fps, uma trilha) e `volumedetect` igual ao master. No 006: 14 min em 24 min de render.
9. **Folha de revisão do arquivo final** (`frames/revisao/`), extraída com ffmpeg do MP4 renderizado: ponto de aprovação antes de chamar de final.

## Linguagem do estilo

- **Abertura e fechamento em tela cheia** (câmera A): título discreto, lista de novidades, card de vídeo citado, CTA. Elementos só à esquerda do rosto.
- **Miolo em tela dividida**, variando o card: G nas cartelas, diagramas e frases de opinião; D nas demos; E quando o foco é o painel direito do app; H (16:9) em telas largas (colunas, tabelas); Q para objetos (celular, cartão de mod). Troca de layout em ~0,9 s, câmera e app na mesma curva.
- **Zoom segue a fala**: aproxima onde o cursor vai agir (sidebar, menu, painel, caixa de mensagem), segura para leitura (menu ≥ 0,8 s, tabela 2–3 s) e volta ao app inteiro. O app nunca passa por baixo da câmera: o `Enquadro` recorta na caixa do layout.
- **Cursor real**: aproxima, pausa, clica (anel terracota), a interface responde. Arraste com item fantasma e alvo de soltura. O cursor não marca tarefas do agente: elas se marcam sozinhas.
- **Cartelas `01 / 07`** abrindo cada bloco; diagramas com as peças da interface (cartões claros, asterisco terracota, linhas finas), sem ícone genérico de IA.
- **Dialeto**: mesa `#F0EEE6` com quadriculado, app escuro do Macks, terracota `#D97757` só no que é novo ou apontado, Inter na interface, Newsreader nos títulos do app, JetBrains Mono em comandos. Nada de neon, gradiente chamativo ou brilho.

## Armadilhas (já aconteceram)

- **Hook dentro de condicional** (`cond && useEm(...)`, `x ? 1 : useEm(...)`) quebra entre quadros. Calcule os hooks no topo do componente.
- **Árvore da sidebar** com altura fixa deixa buraco antes dos filhos nascerem; use o `fator` da `Linha` (já resolvido em `app.tsx`).
- **Zoom com dois níveis de interpolação** atravessa o meio do app e corta a sidebar no caminho; o `Enquadro` já centraliza quando cabe e prende a borda quando amplia.
- **Foco do zoom** perto da borda corta o texto digitado: mire no começo da caixa (x ≈ 700 na janela), não no centro.
- **Menu real ≠ menu da fonte**: o submenu "Abrir em" do Macks não tinha "Tela dividida". Se a fala descreve, acrescente e registre no plano.
- `remotion still` copia a pasta `projetos/` inteira a cada chamada (GBs): use o `stills.mjs`.
