// Scene 6 — 00:36–00:45 — Watcher figure, half in shadow, watching
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene6Figure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.7], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 8, fps * 9], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Chest breath rise
  const breathY = Math.sin(frame / (fps * 2.2)) * 3;
  // Eye slow scan
  const eyeX = interpolate(frame, [fps * 3, fps * 7], [0, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        <defs>
          {/* Light / shadow split — hard vertical divide */}
          <linearGradient id="shadowSplit6" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PALETTE.nearBlack} stopOpacity="1" />
            <stop offset="38%" stopColor={PALETTE.nearBlack} stopOpacity="1" />
            <stop offset="52%" stopColor={PALETTE.nearBlack} stopOpacity="0.1" />
            <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="warmLight6" x1="0" y1="0" x2="1" y2="0">
            <stop offset="45%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={PALETTE.burntSienna} stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id="forestBg6" cx="60%" cy="40%" r="55%">
            <stop offset="0%" stopColor={PALETTE.rawUmber} stopOpacity="0.5" />
            <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="1920" height="1080" fill={PALETTE.nearBlack} />
        <rect width="1920" height="1080" fill="url(#forestBg6)" />

        {/* Distant bosveld background — hazy trees */}
        {[600, 750, 900, 1050, 1200, 1400, 1600, 1750].map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={600}
            rx={30 + (i % 3) * 10}
            ry={80 + (i % 4) * 20}
            fill={PALETTE.smokeBrown}
            opacity="0.15"
          />
        ))}

        {/* Tree trunk — figure stands behind it */}
        <rect x="370" y="0" width="160" height="1080" rx="12" fill={PALETTE.nearBlack} opacity="0.97" />
        {/* Bark texture lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${390 + i * 22},0 Q ${400 + i * 22},${300 + i * 50} ${392 + i * 22},1080`}
            fill="none"
            stroke={PALETTE.rawUmber}
            strokeWidth="2"
            opacity="0.3"
          />
        ))}

        {/* Ground */}
        <rect x="0" y="880" width="1920" height="200" fill={PALETTE.rawUmber} opacity="0.3" />

        {/* Figure — 60% of body hidden behind tree, only right side visible */}
        <g transform={`translate(530, 160) translateY(${breathY})`}>
          {/* Body silhouette — right half only */}
          {/* Right shoulder */}
          <path
            d="M 0,80 Q 80,60 120,120 Q 140,180 120,300 L 80,300 Q 60,180 40,120 Z"
            fill={PALETTE.smokeBrown}
            opacity="0.9"
          />
          {/* Right arm */}
          <path
            d="M 100,140 Q 130,220 120,340 Q 118,360 110,370"
            fill="none"
            stroke={PALETTE.smokeBrown}
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Clothing detail */}
          <path
            d="M 50,130 Q 90,150 110,200"
            fill="none"
            stroke={PALETTE.rawUmber}
            strokeWidth="3"
            opacity="0.4"
          />

          {/* Head — only right profile visible past tree edge */}
          <g transform="translate(-20, 0)">
            {/* Head shape */}
            <path
              d="M 20,-10 Q 80,0 90,60 Q 95,100 70,120 Q 50,130 30,120 Q 10,100 15,60 Q 15,20 20,-10 Z"
              fill={PALETTE.burntSienna}
              opacity="0.88"
            />
            {/* Jaw / neck */}
            <path
              d="M 30,120 Q 40,140 35,170 L 60,170 Q 70,140 70,120 Z"
              fill={PALETTE.burntSienna}
              opacity="0.8"
            />

            {/* One visible eye */}
            <ellipse cx={52 + eyeX * 0.3} cy="52" rx="10" ry="8" fill={PALETTE.nearBlack} opacity="1" />
            <ellipse cx={52 + eyeX * 0.3} cy="52" rx="4" ry="4" fill={PALETTE.coldShadow} opacity="0.5" />
            <circle cx={54 + eyeX * 0.3} cy="50" r="2" fill={PALETTE.moonSilver} opacity="0.9" />

            {/* Brow */}
            <path
              d="M 38,38 Q 52,32 66,36"
              fill="none"
              stroke={PALETTE.nearBlack}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Nose bridge visible */}
            <path
              d="M 45,55 Q 40,75 42,88"
              fill="none"
              stroke={PALETTE.rawUmber}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        </g>

        {/* Shadow split overlay */}
        <rect width="1920" height="1080" fill="url(#shadowSplit6)" />
        <rect width="1920" height="1080" fill="url(#warmLight6)" />

        {/* Vignette */}
        <radialGradient id="vig6" cx="48%" cy="45%" r="60%">
          <stop offset="10%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.9" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#vig6)" />
      </svg>

      <GrainOverlay opacity={0.22} />
    </div>
  );
};
