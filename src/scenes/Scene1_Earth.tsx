// Scene 1 — 00:00–00:06 — Cracked earth, dead wildflower, moving dust
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene1Earth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Dust particles drift slowly
  const dustX = interpolate(frame, [0, fps * 6], [0, 18], {
    extrapolateRight: 'clamp',
  });
  const dustOpacity = interpolate(frame, [fps * 1, fps * 2.5, fps * 5, fps * 6], [0, 0.6, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slow fade out at end
  const fadeOut = interpolate(frame, [fps * 5, fps * 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', opacity: fadeIn * fadeOut, background: PALETTE.nearBlack }}>
      {/* Ground base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 70%, ${PALETTE.rawUmber} 0%, ${PALETTE.nearBlack} 75%)`,
        }}
      />

      {/* Cracked clay SVG */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="roughen">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>
        </defs>
        {/* Cracked earth polygons */}
        {[
          'M 400,600 L 700,560 L 720,800 L 380,820 Z',
          'M 700,560 L 980,590 L 1000,750 L 720,800 Z',
          'M 980,590 L 1260,555 L 1280,790 L 1000,750 Z',
          'M 1260,555 L 1520,580 L 1510,810 L 1280,790 Z',
          'M 700,800 L 960,750 L 970,950 L 680,960 Z',
          'M 300,820 L 600,800 L 580,1000 L 280,1010 Z',
          'M 960,750 L 1230,790 L 1210,980 L 940,960 Z',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={PALETTE.smokeBrown}
            strokeWidth="1.5"
            opacity="0.6"
            filter="url(#roughen)"
          />
        ))}

        {/* Crack lines */}
        {[
          'M 500,580 Q 680,700 620,900',
          'M 850,560 Q 880,680 820,880',
          'M 1100,570 Q 1150,700 1080,900',
          'M 1380,565 Q 1340,690 1350,880',
          'M 700,560 Q 750,700 720,800',
          'M 980,590 Q 960,720 1000,750',
        ].map((d, i) => (
          <path key={`crack-${i}`} d={d} fill="none" stroke={PALETTE.nearBlack} strokeWidth="2" opacity="0.8" />
        ))}

        {/* Dead wildflower — centre frame, extreme closeup feel */}
        <g transform="translate(960, 380)">
          {/* Stem */}
          <line x1="0" y1="180" x2="-8" y2="0" stroke={PALETTE.smokeBrown} strokeWidth="3" opacity="0.7" />
          {/* Dead petals — drooped */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx={Math.cos((angle * Math.PI) / 180) * 22}
              cy={Math.sin((angle * Math.PI) / 180) * 22 + 20}
              rx="7"
              ry="12"
              fill={PALETTE.deadGrass}
              opacity="0.45"
              transform={`rotate(${angle + 90}, ${Math.cos((angle * Math.PI) / 180) * 22}, ${Math.sin((angle * Math.PI) / 180) * 22 + 20})`}
            />
          ))}
          {/* Centre */}
          <circle cx="-4" cy="14" r="10" fill={PALETTE.burntSienna} opacity="0.5" />
        </g>

        {/* Dust particles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={`dust-${i}`}
            cx={200 + i * 380 + dustX * (1 + i * 0.3)}
            cy={400 + i * 60}
            r={2 + i * 0.8}
            fill={PALETTE.dustWhite}
            opacity={dustOpacity * (0.3 + i * 0.1)}
          />
        ))}

        {/* Cold pre-dawn light from top — vignette */}
        <radialGradient id="vignette1" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.85" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#vignette1)" />

        {/* Top cold light strip */}
        <linearGradient id="topLight1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="0.2" />
          <stop offset="40%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
        <rect width="1920" height="1080" fill="url(#topLight1)" />
      </svg>

      <GrainOverlay opacity={0.22} />
    </div>
  );
};
