import {staticFile} from 'remotion';

export * from '../../estilos/demo-tutorial/base';

export const FPS = 30000 / 1001;
export const DURACAO = 849.748333;
export const arq = (p: string) => staticFile(`006. claude-code-2-0/${p}`);
