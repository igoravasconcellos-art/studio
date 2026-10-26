import React from 'react';
import {Composition, Folder} from 'remotion';
import {MinimalSuico} from './estilos/MinimalSuico';
import {PapelRecortadoLeve} from './estilos/PapelRecortadoLeve';
import {TerminalTecnico} from './estilos/TerminalTecnico';
import {VerticalDados} from './estilos/VerticalDados';
import {VerticalLegendas} from './estilos/VerticalLegendas';
import {VerticalPrint} from './estilos/VerticalPrint';
import {DemoTutorial} from './estilos/DemoTutorial';
import {DURACAO as MODS_DURACAO, FPS as MODS_FPS} from './videos/mods/base';
import {Mods} from './videos/mods/Mods';
import {DURACAO as OPENCLAW_DURACAO, FPS as OPENCLAW_FPS} from './videos/openclaw/base';
import {OpenClaw} from './videos/openclaw/OpenClaw';
import {CapaOpenClaw} from './videos/openclaw/Capa';
import {DURACAO as HARNESS_DURACAO, FPS as HARNESS_FPS} from './videos/harness/base';
import {Harness} from './videos/harness/Harness';
import {DURACAO as CC2_DURACAO, FPS as CC2_FPS} from './videos/claude-code-2/base';
import {ClaudeCode2} from './videos/claude-code-2/ClaudeCode2';

const FPS = 30;
const SEIS_SEGUNDOS = 6 * FPS;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Exemplos que rodam sem nenhum vídeo. Servem de referência de estilo, não de padrão fixo. */}
    <Folder name="Estilos">
      <Composition id="MinimalSuico" component={MinimalSuico} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="TerminalTecnico" component={TerminalTecnico} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="PapelRecortadoLeve" component={PapelRecortadoLeve} width={1920} height={1080} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="DemoTutorial" component={DemoTutorial} width={1920} height={1080} fps={FPS} durationInFrames={8 * FPS} />
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
    <Folder name="006-claude-code-2-0">
      <Composition id="ClaudeCode2" component={ClaudeCode2} width={1920} height={1080} fps={CC2_FPS} durationInFrames={Math.round(CC2_DURACAO * CC2_FPS)} />
    </Folder>
  </>
);
