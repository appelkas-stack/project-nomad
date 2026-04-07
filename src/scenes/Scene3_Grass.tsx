// Scene 3 — 00:14–00:20 — Wind through long dead winter grass
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene3Grass: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 5, fps * 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wind wave — travels left to right
  const windPhase = frame / (fps * 0.9);

  const grassBlade = (x: number, yBase: number, height: number, phase: number, thickness: number, color: string) => {
    const bend = Math.sin(windPhase + phase) * 28 + Math.sin(windPhase * 1.7 + phase) * 12;
    const cp1x = x + bend * 0.4;
    const cp1y = yBase - height * 0.5;
    const tipX = x + bend;
    const tipY = yBase - height;
    return (
      <path
        d={`M ${x},${yBase} Q ${cp1x},${cp1y} ${tipX},${tipY}`}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        opacity="0.85"
      />
    );
  };

  const blades: Array<{ x: number; y: number; h: number; phase: number; thick: number; color: string }> = [];
  // Generate dense grass field
  for (let i = 0; i < 120; i++) {
    const x = (i / 120) * 1980 - 30;
    const y = 680 + ((i * 37) % 120);
    const h = 180 + ((i * 53) % 200);
    const phase = (i * 0.42) % (Math.PI * 2);
    const thick = 1.2 + (i % 5) * 0.4;
    const colors = [PALETTE.deadGrass, PALETTE.ochre, PALETTE.smokeBrown, PALETTE.dustWhite];
    const color = colors[i % 4];
    blades.push({ x, y, h, phase, thick, color });
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: fadeIn * fadeOut,
        background: PALETTE.nearBlack,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky — eye level */}
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="0.9" />
            <stop offset="60%" stopColor={PALETTE.paleSky} stopOpacity="0.4" />
            <stop offset="100%" stopColor={PALETTE.rawUmber} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="groundFog3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.dustWhite} stopOpacity="0" />
            <stop offset="100%" stopColor={PALETTE.dustWhite} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill={PALETTE.nearBlack} />
        <rect width="1920" height="1080" fill="url(#sky3)" />

        {/* Ground plane */}
        <rect x="0" y="680" width="1920" height="400" fill={PALETTE.rawUmber} opacity="0.4" />
        <rect x="0" y="780" width="1920" height="300" fill={PALETTE.nearBlack} opacity="0.6" />

        {/* Grass blades — back layer (smaller, dimmer) */}
        {blades.slice(0, 60).map((b, i) => (
          <React.Fragment key={`back-${i}`}>
            {grassBlade(b.x, b.y - 30, b.h * 0.65, b.phase + 1, b.thick * 0.7, PALETTE.smokeBrown)}
          </React.Fragment>
        ))}

        {/* Grass blades — front layer */}
        {blades.map((b, i) => (
          <React.Fragment key={`front-${i}`}>
            {grassBlade(b.x, b.y, b.h, b.phase, b.thick, b.color)}
          </React.Fragment>
        ))}

        {/* Silver tips catch light */}
        {blades.filter((_, i) => i % 4 === 0).map((b, i) => {
          const bend = Math.sin(windPhase + b.phase) * 28 + Math.sin(windPhase * 1.7 + b.phase) * 12;
          return (
            <circle
              key={`tip-${i}`}
              cx={b.x + bend}
              cy={b.y - b.h}
              r="1.8"
              fill={PALETTE.moonSilver}
              opacity="0.5"
            />
          );
        })}

        {/* Vignette */}
        <radialGradient id="vig3" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.75" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#vig3)" />
      </svg>

      <GrainOverlay opacity={0.2} />
    </div>
  );
};
