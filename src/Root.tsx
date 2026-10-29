import React from 'react';
import {Composition, Folder} from 'remotion';
import {MinimalSuico} from './estilos/MinimalSuico';
import {PapelRecortadoLeve} from './estilos/PapelRecortadoLeve';
import {TerminalTecnico} from './estilos/TerminalTecnico';
import {VerticalDados} from './estilos/VerticalDados';
import {VerticalLegendas} from './estilos/VerticalLegendas';
import {VerticalPrint} from './estilos/VerticalPrint';
import {DURACAO as MODS_DURACAO, FPS as MODS_FPS} from './videos/mods/base';
import {Mods} from './videos/mods/Mods';
import {DURACAO as OPENCLAW_DURACAO, FPS as OPENCLAW_FPS} from './videos/openclaw/base';
import {OpenClaw} from './videos/openclaw/OpenClaw';
import {CapaOpenClaw} from './videos/openclaw/Capa';
import {DURACAO as HARNESS_DURACAO, FPS as HARNESS_FPS} from './videos/harness/base';
import {Harness} from './videos/harness/Harness';
import {
  ALTURA as PRAIA_ALTURA,
  FPS as PRAIA_FPS,
  LARGURA as PRAIA_LARGURA,
  QUADROS_MASTER as PRAIA_QUADROS_MASTER,
  QUADROS_TOTAL as PRAIA_QUADROS,
} from './videos/praia-reserva/base';
import {PraiaReserva} from './videos/praia-reserva/PraiaReserva';
import {
  ALTURA as CARTA_ALTURA,
  FPS as CARTA_FPS,
  LARGURA as CARTA_LARGURA,
  QUADROS as CARTA_QUADROS,
} from './videos/icf-carta-que-vale/base';
import {CartaQueVale} from './videos/icf-carta-que-vale/CartaQueVale';
import {
  ALTURA as AVATAR_ALTURA,
  FPS as AVATAR_FPS,
  LARGURA as AVATAR_LARGURA,
  QUADROS as AVATAR_QUADROS,
} from './videos/avatar-igor/base';
import {Vertical as AvatarVertical} from './videos/avatar-igor/Vertical';
import {Explainer as AvatarExplainer} from './videos/avatar-igor/Explainer';
import {ALTURA as EXP_ALTURA, LARGURA as EXP_LARGURA} from './videos/avatar-igor/cenas';
import {
  ALTURA as ORC_ALTURA,
  FPS as ORC_FPS,
  LARGURA as ORC_LARGURA,
  QUADROS as ORC_QUADROS,
} from './videos/orcamento-do-zero/base';
import {Piloto as OrcamentoPiloto} from './videos/orcamento-do-zero/Piloto';
import {Bloco2 as OrcamentoBloco2} from './videos/orcamento-do-zero/Bloco2';
import {DURACAO2} from './videos/orcamento-do-zero/dados2';
import {Bloco3 as OrcamentoBloco3} from './videos/orcamento-do-zero/Bloco3';
import {DURACAO3} from './videos/orcamento-do-zero/dados3';
import {Bloco4 as OrcamentoBloco4} from './videos/orcamento-do-zero/Bloco4';
import {DURACAO4} from './videos/orcamento-do-zero/dados4';
import {Fecho as OrcamentoFecho} from './videos/orcamento-do-zero/Fecho';
import {DURACAO5} from './videos/orcamento-do-zero/dados5';
import {Completo as OrcamentoCompleto, DURACAO_COMPLETA} from './videos/orcamento-do-zero/Completo';
import {
  Miniatura as OrcamentoMiniatura,
  MINI_LARGURA,
  MINI_ALTURA,
} from './videos/orcamento-do-zero/Miniatura';
import {
  Banner as CanalBanner,
  BANNER_LARGURA,
  BANNER_ALTURA,
} from './videos/orcamento-do-zero/Banner';

const FPS = 30;
const SEIS_SEGUNDOS = 6 * FPS;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Exemplos que rodam sem nenhum vídeo. Servem de referência de estilo, não de padrão fixo. */}
    <Folder name="Estilos">
      <Composition id="MinimalSuico" component={MinimalSuico} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="TerminalTecnico" component={TerminalTecnico} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="PapelRecortadoLeve" component={PapelRecortadoLeve} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="VerticalLegendas" component={VerticalLegendas} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="VerticalPrint" component={VerticalPrint} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="VerticalDados" component={VerticalDados} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
    </Folder>

    {/* Seus vídeos entram aqui: um <Folder name="001-slug"> por projeto, com o código em src/videos/<slug>/. */}
    <Folder name="001-mods">
      <Composition id="Mods" component={Mods} width={1920} height={1080} fps={MODS_FPS} durationInFrames={Math.round(MODS_DURACAO * MODS_FPS)} />
    </Folder>
    <Folder name="002-abertura-openclaw">
      <Composition id="OpenClaw" component={OpenClaw} width={1920} height={1080} fps={OPENCLAW_FPS} durationInFrames={Math.round(OPENCLAW_DURACAO * OPENCLAW_FPS)} />
      <Composition id="CapaOpenClaw" component={CapaOpenClaw} width={1280} height={720} fps={30} durationInFrames={1} />
      <Composition id="CapaOpenClawIA" component={CapaOpenClaw} defaultProps={{ia: "CAPA1.png"}} width={1280} height={720} fps={30} durationInFrames={1} />
    </Folder>
    <Folder name="003-harness">
      <Composition id="Harness" component={Harness} width={1920} height={1080} fps={HARNESS_FPS} durationInFrames={Math.round(HARNESS_DURACAO * HARNESS_FPS)} />
    </Folder>

    {/* Série "Praia" do Igor: quatro criativos verticais, um por tomada. */}
    <Folder name="Praia">
      {/* Cartela de CTA na faixa inferior: mesma duração do master (regra 1). */}
      <Composition id="PraiaReserva" component={PraiaReserva} defaultProps={{variante: 'faixa' as const}} width={PRAIA_LARGURA} height={PRAIA_ALTURA} fps={PRAIA_FPS} durationInFrames={PRAIA_QUADROS_MASTER} />
      {/* Cartela de CTA em tela cheia depois do último quadro: 5 s a mais que o master. */}
      <Composition id="PraiaReservaCartelaFinal" component={PraiaReserva} defaultProps={{variante: 'fim' as const}} width={PRAIA_LARGURA} height={PRAIA_ALTURA} fps={PRAIA_FPS} durationInFrames={PRAIA_QUADROS} />
    </Folder>

    {/* 008: Short narrado, sem gravação. A duração vem da narração, não de um master. */}
    <Folder name="008-carta-que-vale">
      <Composition
        id="CartaQueVale"
        component={CartaQueVale}
        width={CARTA_LARGURA}
        height={CARTA_ALTURA}
        fps={CARTA_FPS}
        durationInFrames={CARTA_QUADROS}
      />
    </Folder>

    {/* 009: avatar em desenho falando. Tudo gerado, sem vídeo gravado: a duração vem da narração. */}
    <Folder name="009-avatar-igor">
      {/* O template: explainer 16:9 com o avatar como narrador. */}
      <Composition
        id="AvatarExplainer"
        component={AvatarExplainer}
        width={EXP_LARGURA}
        height={EXP_ALTURA}
        fps={AVATAR_FPS}
        durationInFrames={AVATAR_QUADROS}
      />
      {/* O mesmo roteiro em vertical, para derivar o Short. */}
      <Composition
        id="AvatarVertical"
        component={AvatarVertical}
        width={AVATAR_LARGURA}
        height={AVATAR_ALTURA}
        fps={AVATAR_FPS}
        durationInFrames={AVATAR_QUADROS}
      />
    </Folder>

    {/* 012: orçamento do zero, no formato de história ilustrada. Piloto dos dois primeiros blocos. */}
    <Folder name="012-orcamento-do-zero">
      <Composition
        id="OrcamentoPiloto"
        component={OrcamentoPiloto}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={ORC_QUADROS}
      />
      {/* Bloco 2: o Passo 1 e as três colunas. A folha é desenhada, não gerada. */}
      <Composition
        id="OrcamentoBloco2"
        component={OrcamentoBloco2}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={Math.round(DURACAO2 * ORC_FPS)}
      />
      {/* Bloco 3: o exemplo da família. Zero crédito — folha em código e cenas reaproveitadas. */}
      <Composition
        id="OrcamentoBloco3"
        component={OrcamentoBloco3}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={Math.round(DURACAO3 * ORC_FPS)}
      />
      {/* Bloco 4: onde achar os números. O extrato se marca sozinho. Zero crédito. */}
      <Composition
        id="OrcamentoBloco4"
        component={OrcamentoBloco4}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={Math.round(DURACAO4 * ORC_FPS)}
      />
      {/* Bloco 5: os erros comuns e o fecho. Zero crédito. */}
      <Composition
        id="OrcamentoFecho"
        component={OrcamentoFecho}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={Math.round(DURACAO5 * ORC_FPS)}
      />
      {/* O vídeo inteiro: os cinco blocos numa trilha contínua só. */}
      <Composition
        id="OrcamentoCompleto"
        component={OrcamentoCompleto}
        width={ORC_LARGURA}
        height={ORC_ALTURA}
        fps={ORC_FPS}
        durationInFrames={Math.round(DURACAO_COMPLETA * ORC_FPS)}
      />
      {/* As duas miniaturas do YouTube. Um quadro só: saem com `remotion still`. */}
      <Composition
        id="OrcamentoMiniaturaA"
        component={OrcamentoMiniatura}
        width={MINI_LARGURA}
        height={MINI_ALTURA}
        fps={ORC_FPS}
        durationInFrames={1}
        defaultProps={{variante: 'duas-batidas' as const}}
      />
      <Composition
        id="OrcamentoMiniaturaB"
        component={OrcamentoMiniatura}
        width={MINI_LARGURA}
        height={MINI_ALTURA}
        fps={ORC_FPS}
        durationInFrames={1}
        defaultProps={{variante: 'tres-batidas' as const}}
      />
      {/* O banner do canal. Mora aqui porque nasceu da paleta deste vídeo. */}
      <Composition
        id="CanalBanner"
        component={CanalBanner}
        width={BANNER_LARGURA}
        height={BANNER_ALTURA}
        fps={ORC_FPS}
        durationInFrames={1}
      />
    </Folder>
  </>
);
