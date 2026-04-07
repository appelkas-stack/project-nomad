// Scene 4 — 00:20–00:27 — Footprints in dust, slow top-down track
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene4Footprints: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 6, fps * 7], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera pans forward along footprints (translate Y upward)
  const panY = interpolate(frame, [0, fps * 7], [0, -120], { extrapolateRight: 'clamp' });

  const footprint = (x: number, y: number, angle: number) => (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Heel */}
      <ellipse cx="0" cy="18" rx="14" ry="10" fill={PALETTE.nearBlack} opacity="0.65" />
      {/* Ball */}
      <ellipse cx="0" cy="-8" rx="13" ry="12" fill={PALETTE.nearBlack} opacity="0.65" />
      {/* Toes */}
      <ellipse cx="-9" cy="-22" rx="4" ry="3" fill={PALETTE.nearBlack} opacity="0.55" />
      <ellipse cx="-4" cy="-26" rx="4" ry="3" fill={PALETTE.nearBlack} opacity="0.55" />
      <ellipse cx="2" cy="-27" rx="4" ry="3" fill={PALETTE.nearBlack} opacity="0.55" />
      <ellipse cx="8" cy="-24" rx="4" ry="3" fill={PALETTE.nearBlack} opacity="0.55" />
      <ellipse cx="12" cy="-20" rx="3" ry="2.5" fill={PALETTE.nearBlack} opacity="0.5" />
      {/* Shadow cast by morning light */}
      <ellipse cx="4" cy="20" rx="16" ry="5" fill={PALETTE.nearBlack} opacity="0.2" transform="skewX(-15)" />
    </g>
  );

  const prints = [
    { x: 940, y: 1180, angle: -5 },
    { x: 980, y: 1060, angle: 4 },
    { x: 935, y: 940, angle: -3 },
    { x: 972, y: 820, angle: 5 },
    { x: 930, y: 700, angle: -2 },
    { x: 968, y: 580, angle: 3 },
    { x: 925, y: 460, angle: -4 },
    { x: 960, y: 340, angle: 2 },
    { x: 932, y: 220, angle: -3 },
    { x: 955, y: 100, angle: 1 },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: fadeIn * fadeOut,
        background: PALETTE.rawUmber,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${panY}px)`, transition: 'none' }}>
        <svg
          viewBox="0 0 1920 1200"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '111%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="ground4" cx="50%" cy="55%" r="60%">
              <stop offset="0%" stopColor={PALETTE.burntSienna} stopOpacity="1" />
              <stop offset="100%" stopColor={PALETTE.rawUmber} stopOpacity="1" />
            </radialGradient>
            <filter id="soft4">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Ground */}
          <rect width="1920" height="1200" fill="url(#ground4)" />

          {/* Subtle texture cracks */}
          {[200, 450, 700, 900, 1100, 1350, 1600].map((x, i) => (
            <path
              key={i}
              d={`M ${x},${200 + i * 80} Q ${x + 30},${400 + i * 60} ${x - 20},${700 + i * 50}`}
              fill="none"
              stroke={PALETTE.nearBlack}
              strokeWidth="1"
              opacity="0.25"
              filter="url(#soft4)"
            />
          ))}

          {/* Morning sidelight — casts shadows in footprints */}
          <linearGradient id="sideLight4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PALETTE.ochre} stopOpacity="0.12" />
            <stop offset="40%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <rect width="1920" height="1200" fill="url(#sideLight4)" />

          {/* Footprints */}
          {prints.map((p, i) => (
            <React.Fragment key={i}>{footprint(p.x, p.y, p.angle)}</React.Fragment>
          ))}

          {/* Dust scatter around prints */}
          {prints.map((p, i) =>
            [0, 1, 2, 3].map((j) => (
              <circle
                key={`dust-${i}-${j}`}
                cx={p.x + (j * 18 - 25)}
                cy={p.y + (j * 10 - 15)}
                r="2"
                fill={PALETTE.dustWhite}
                opacity="0.12"
              />
            ))
          )}

          {/* Vignette */}
          <radialGradient id="vig4" cx="50%" cy="50%" r="65%">
            <stop offset="30%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.7" />
          </radialGradient>
          <rect width="1920" height="1200" fill="url(#vig4)" />
        </svg>
      </div>

      <GrainOverlay opacity={0.24} />
    </div>
  );
};
