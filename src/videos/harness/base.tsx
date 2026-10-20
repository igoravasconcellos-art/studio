import {staticFile} from 'remotion';

export const FPS = 30;
export const DURACAO = 52.4867;
export const f = (s: number) => Math.round(s * FPS);
export const arq = (p: string) => staticFile(`003. harness/${p}`);

export * from '../../estilos/papel-recortado';
