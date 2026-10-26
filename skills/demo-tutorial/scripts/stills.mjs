// Stills de conferência em lote, com um bundle só (remotion still faz um bundle por quadro).
// Uso, na raiz do studio: node skills/demo-tutorial/scripts/stills.mjs <Composicao> <pasta-saida> <segundos...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [id, out, ...tempos] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('projetos')});
const comp = await selectComposition({serveUrl, id});
for (const t of tempos) {
  const frame = Math.round(Number(t) * comp.fps);
  await renderStill({serveUrl, composition: comp, frame, output: path.join(out, `s${String(t).padStart(6, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 70});
  process.stdout.write(t + ' ');
}
