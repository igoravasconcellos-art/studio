# Biblioteca de sons

Dez efeitos que vieram do Reels **"Tops sons que você procura e não acha"**, de
[@chamaogomes](https://www.instagram.com/chamaogomes/), mandado em 18/11/2026. O Reels é uma
vitrine: toca os sons em sequência e escreve o nome de cada um na timeline.

Daquele vídeo só saíram os **nomes**. Sete dos dez foram depois baixados limpos, do original,
em banco gratuito. Os três que sobraram não têm original gratuito porque têm dono — esses
continuam sendo o recorte do Reels.

## Por que a pasta mora aqui dentro

`projetos/` é a pasta pública do Remotion. Som que vai entrar em vídeo precisa estar aqui para
o `staticFile()` enxergar:

```tsx
<Audio src={staticFile('_sons/transicoes/woosh.wav')} />
```

O underline no começo mantém a pasta fora da numeração `NNN. slug` dos projetos.

## O que tem

| arquivo | dura | o que é | onde cabe |
|---|---|---|---|
| `transicoes/woosh.wav` | 0,57 s | passada curta e seca | entrada de texto, print ou card; o mais usável do pacote |
| `transicoes/faah.wav` | 2,32 s | sopro de ar longo, que vai sumindo | passagem entre blocos; começa junto com a última palavra do bloco que sai |
| `impactos/core.wav` | 0,59 s | pancada grave e cheia | o número da virada, o dado que você quer que doa |
| `impactos/magic-reveal.wav` | 1,30 s | brilho que abre e decai | revelação: o gráfico que se monta, a resposta da promessa |
| `interface/click.wav` | 0,29 s | clique seco | item de lista aparecendo, marca-texto, checkbox |
| `interface/ding.wav` | 1,52 s | sino curto com cauda | acerto, confirmação, "é isso" |
| `interface/discord-notification.wav` | 0,34 s | o ping do Discord | notificação; muita gente reconhece e olha o próprio celular |
| `memes/cha-ching-money.mp3` | 3,50 s | caixa registradora | dinheiro entrando; corte o pedaço que quiser, vem com a gaveta |
| `memes/taco-bell-bong.wav` | 1,45 s | o "bong" do Taco Bell | piada de fim de frase |
| `memes/dexter-meme.wav` | 4,46 s | a musiquinha do meme do Dexter | leito curto, não efeito |

## De onde veio cada um, e com que licença

| arquivo | fonte | licença |
|---|---|---|
| `woosh` | Mixkit, *Fast transitions swoosh* (sfx 3115) | [Mixkit Free SFX](https://mixkit.co/license/#sfxFree) — uso comercial, sem atribuição |
| `faah` | Mixkit, *Air woosh* (sfx 1489) | Mixkit Free SFX |
| `core` | Mixkit, *Impact of a blow* (sfx 2150) | Mixkit Free SFX |
| `magic-reveal` | Mixkit, *Fairy magic sparkle* (sfx 871) | Mixkit Free SFX |
| `click` | Mixkit, *Classic click* (sfx 1117) | Mixkit Free SFX |
| `ding` | Mixkit, *Attention bell ding* (sfx 586) | Mixkit Free SFX |
| `cha-ching-money` | Pixabay, *Cha Ching*, de freesound_community | [Pixabay Content License](https://pixabay.com/service/license-summary/) — uso comercial, sem atribuição |
| `discord-notification` | recorte do Reels | **som de um produto**, sem original livre |
| `taco-bell-bong` | recorte do Reels | **assinatura sonora de uma marca**, sem original livre |
| `dexter-meme` | recorte do Reels | **trilha de um desenho com dono**, sem original livre |

Os sete de cima são limpos, no arquivo original do banco: WAV 44,1 kHz (o cha-ching é MP3
24 kHz, que é como o Pixabay publica). Os três de baixo passaram pelo Instagram e pelo
WhatsApp — AAC comprimido duas vezes, com o pico batendo em 0 dB. Servem, mas são de segunda mão.

**Em vídeo monetizado, os três de baixo podem dar reclamação de direitos autorais no YouTube.**
Em Reels e TikTok o risco é menor, mas existe. Não é proibição; é para você escolher sabendo.

Para trocar algum dos sete por outro som do Mixkit, o endereço é direto:
`https://assets.mixkit.co/active_storage/sfx/<id>/<id>.wav`. Alternativas que eu tinha
separado e não usei: woosh → 175, 1491 · faah → 787, 2608 · core → 2655, 781 ·
magic → 3062, 3083 · click → 1109, 1120 · ding → 933, 600.

## Como usar sem estragar o vídeo

- **O som entra na palavra, não perto dela.** O gatilho sai do `palavras.json`, igual à
  animação. Efeito meio quadro fora do tempo soa como erro de edição, não como efeito.
- **Um por batida.** Dois efeitos juntos viram barulho e nenhum dos dois é ouvido.
- **Baixo.** Comece em −18 dB em relação à sua voz e suba só se sumir. Efeito que compete com
  a fala faz a pessoa sair, não ficar.
- **O `dexter-meme` é música.** Quatro segundos e meio de leito; por baixo da fala, abaixe mais.

## `_fonte/`

- `chamaogomes-reels-2026-11-18.wav` — o áudio inteiro do Reels, para recortar de novo.
- `recortes-reels/` — os sete recortes que os originais limpos substituíram. Ficam como
  referência: é por eles que dá para conferir se o original baixado é mesmo o mesmo som.
- `13.8-15.0-sem-rotulo.wav` — um último som que toca no fim do Reels **sem rótulo na tela**.
  Está aqui caso sirva; eu não sei o nome dele.
