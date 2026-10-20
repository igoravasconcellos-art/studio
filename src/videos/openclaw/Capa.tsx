import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {COR, FONTE, Fontes, arq} from './base';

// Rascunho gratuito da capa: quadro real (3,3 s) com o rosto à direita e texto curto à esquerda.
// Com `ia`, o fundo é a capa gerada (rosto já à direita) e a janela de terminal sai para não brigar com a garra.
export const CapaOpenClaw: React.FC<{ia?: string}> = ({ia}) => (
  <AbsoluteFill style={{background: COR.fundo, overflow: 'hidden'}}>
    <Fontes />
    {ia ? (
      <Img src={arq(`hf/${ia}`)} style={{position: 'absolute', width: 1280, height: 720, objectFit: 'cover'}} />
    ) : (
      <Img src={arq('frames/capa_base.png')} style={{position: 'absolute', width: 1920 * 0.9, left: 960 - 945 * 0.9, top: -50, filter: 'saturate(1.1) contrast(1.05)'}} />
    )}
    <AbsoluteFill style={{background: ia ? 'linear-gradient(90deg, rgba(14,10,36,.75) 0%, rgba(14,10,36,.35) 35%, transparent 55%)' : `linear-gradient(90deg, ${COR.fundo} 0%, rgba(14,10,36,.94) 40%, rgba(47,28,106,.35) 62%, transparent 75%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 20% 80%, rgba(103,61,230,.55), transparent 50%)'}} />
    <div style={{position: 'absolute', left: 60, top: 70, padding: '10px 26px', background: COR.roxo, borderRadius: 40, fontFamily: FONTE.ui, fontWeight: 800, fontSize: 44, color: COR.branco, transform: 'rotate(-3deg)', boxShadow: '0 0 40px rgba(103,61,230,.8)'}}>
      OpenClaw
    </div>
    <div style={{position: 'absolute', left: 56, top: 190, fontFamily: FONTE.ui, fontWeight: 800, fontSize: 136, lineHeight: 0.92, letterSpacing: -5, color: COR.branco, textShadow: '0 8px 40px rgba(0,0,0,.6)'}}>
      SEM
      <br />
      <span style={{color: COR.lilas}}>TERMINAL</span>
    </div>
    <div style={{position: 'absolute', left: 62, top: 480, fontFamily: FONTE.serif, fontStyle: 'italic', fontSize: 62, color: COR.lavanda}}>seu agente de IA 24h</div>
    {/* Janela de terminal riscada, em leve 3D. */}
    {!ia && <div style={{position: 'absolute', left: 64, top: 575, perspective: 800}}>
      <div style={{width: 260, height: 110, borderRadius: 16, background: '#0B0B12', border: '2px solid rgba(140,133,255,.6)', transform: 'rotateY(18deg) rotateX(6deg)', padding: '38px 20px', fontFamily: FONTE.mono, fontSize: 30, color: COR.lavanda, position: 'relative'}}>
        <div style={{position: 'absolute', top: 12, left: 14, display: 'flex', gap: 8}}>
          {['#FC5185', '#FFB648', '#00B090'].map((c) => (
            <div key={c} style={{width: 11, height: 11, borderRadius: 6, background: c}} />
          ))}
        </div>
        $ sudo _
        <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 10, borderRadius: 5, background: COR.rosa, transform: 'rotate(-12deg)'}} />
      </div>
    </div>}
  </AbsoluteFill>
);
