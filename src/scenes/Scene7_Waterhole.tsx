// Scene 7 — 00:45–00:51 — Dark waterhole, moon reflection, cold silver light
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene7Waterhole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 5, fps * 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Water ripple — something moved nearby
  const rippleProgress = interpolate(frame, [fps * 1.5, fps * 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleRadius = rippleProgress * 180;
  const rippleOpacity = interpolate(rippleProgress, [0, 0.3, 1], [0, 0.4, 0]);

  // Moon shimmer
  const shimmer = Math.sin(frame / (fps * 0.6)) * 3;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: fadeIn * fadeOut,
        background: PALETTE.darkWater,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="1" />
            <stop offset="55%" stopColor={PALETTE.darkWater} stopOpacity="1" />
          </linearGradient>
          <radialGradient id="moonGlow7" cx="72%" cy="18%" r="20%">
            <stop offset="0%" stopColor={PALETTE.moonSilver} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="waterReflection7" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PALETTE.moonSilver} stopOpacity="0.08" />
            <stop offset="100%" stopColor={PALETTE.darkWater} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1920" height="1080" fill={PALETTE.darkWater} />
        <rect width="1920" height="600" fill="url(#sky7)" />
        <rect width="1920" height="1080" fill="url(#moonGlow7)" />

        {/* Stars */}
        {[
          [120, 80], [280, 120], [450, 60], [630, 100], [810, 45], [990, 90],
          [1150, 70], [1320, 110], [1500, 55], [1680, 85], [1800, 40],
          [200, 160], [550, 200], [900, 140], [1250, 180], [1600, 150],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={0.8 + (i % 3) * 0.5}
            fill={PALETTE.moonSilver}
            opacity={0.4 + (i % 4) * 0.1}
          />
        ))}

        {/* Moon */}
        <circle cx="1380" cy="130" r="28" fill={PALETTE.moonSilver} opacity="0.85" />
        <circle cx="1388" cy="126" r="22" fill={PALETTE.coldShadow} opacity="0.2" />

        {/* Horizon / bank */}
        <path
          d="M 0,520 Q 480,490 960,510 Q 1440,530 1920,500 L 1920,600 L 0,600 Z"
          fill={PALETTE.rawUmber}
          opacity="0.7"
        />

        {/* Dead reeds left */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(${80 + i * 60}, 480)`}>
            <line x1="0" y1="0" x2={-5 + i * 2} y2="-180" stroke={PALETTE.smokeBrown} strokeWidth="3" opacity="0.7" />
            <ellipse cx={-5 + i * 2} cy="-190" rx="4" ry="12" fill={PALETTE.rawUmber} opacity="0.6" />
          </g>
        ))}

        {/* Dead reeds right */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${1680 + i * 55}, 470)`}>
            <line x1="0" y1="0" x2={3 - i * 2} y2="-160" stroke={PALETTE.smokeBrown} strokeWidth="3" opacity="0.65" />
            <ellipse cx={3 - i * 2} cy="-170" rx="4" ry="10" fill={PALETTE.rawUmber} opacity="0.55" />
          </g>
        ))}

        {/* Dead tree silhouette right bank */}
        <g transform="translate(1700, 300)">
          <line x1="0" y1="200" x2="-10" y2="0" stroke={PALETTE.nearBlack} strokeWidth="14" strokeLinecap="round" />
          <line x1="-8" y1="80" x2="-80" y2="-40" stroke={PALETTE.nearBlack} strokeWidth="7" strokeLinecap="round" />
          <line x1="-8" y1="80" x2="60" y2="-30" stroke={PALETTE.nearBlack} strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Water body */}
        <path
          d="M 0,520 Q 480,510 960,520 Q 1440,530 1920,510 L 1920,1080 L 0,1080 Z"
          fill={PALETTE.darkWater}
          opacity="0.97"
        />

        {/* Water surface sheen */}
        <rect width="1920" height="560" y="520" fill="url(#waterReflection7)" />

        {/* Moon reflection in water */}
        <ellipse
          cx={1380 + shimmer}
          cy={780}
          rx={20}
          ry={35}
          fill={PALETTE.moonSilver}
          opacity="0.25"
        />
        {/* Reflection shimmer lines */}
        {[-1, 0, 1].map((i) => (
          <line
            key={i}
            x1={1330 + i * 30 + shimmer}
            y1={780 + i * 20}
            x2={1430 + i * 20 + shimmer}
            y2={780 + i * 20}
            stroke={PALETTE.moonSilver}
            strokeWidth="1.5"
            opacity="0.12"
          />
        ))}

        {/* Ripple from something near water */}
        {rippleRadius > 0 && (
          <>
            <ellipse cx="820" cy="640" rx={rippleRadius} ry={rippleRadius * 0.35} fill="none" stroke={PALETTE.moonSilver} strokeWidth="1.5" opacity={rippleOpacity} />
            <ellipse cx="820" cy="640" rx={rippleRadius * 0.6} ry={rippleRadius * 0.6 * 0.35} fill="none" stroke={PALETTE.moonSilver} strokeWidth="1" opacity={rippleOpacity * 0.7} />
          </>
        )}

        {/* Vignette */}
        <radialGradient id="vig7" cx="50%" cy="55%" r="65%">
          <stop offset="20%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.88" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#vig7)" />
      </svg>

      <GrainOverlay opacity={0.19} />
    </div>
  );
};
