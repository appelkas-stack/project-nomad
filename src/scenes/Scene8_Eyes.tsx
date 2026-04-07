// Scene 8 — 00:51–00:55 — Extreme close-up: two eyes in near darkness
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene8Eyes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 3.2, fps * 4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // No movement — absolute stillness
  // Only the light reflection in the eyes has a micro-pulse
  const lightPulse = 0.75 + Math.sin(frame / (fps * 3)) * 0.06;

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
        {/* Absolute darkness */}
        <rect width="1920" height="1080" fill={PALETTE.nearBlack} />

        {/* Faint skin texture — just barely visible in extreme dark */}
        <defs>
          <radialGradient id="skinGlow8L" cx="35%" cy="50%" r="25%">
            <stop offset="0%" stopColor={PALETTE.rawUmber} stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="skinGlow8R" cx="65%" cy="50%" r="25%">
            <stop offset="0%" stopColor={PALETTE.rawUmber} stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#skinGlow8L)" />
        <rect width="1920" height="1080" fill="url(#skinGlow8R)" />

        {/* LEFT EYE */}
        <g transform="translate(590, 540)">
          {/* Eye socket shadow */}
          <ellipse cx="0" cy="0" rx="130" ry="80" fill={PALETTE.nearBlack} opacity="0.9" />
          {/* Sclera — barely white in darkness */}
          <ellipse cx="0" cy="0" rx="110" ry="62" fill="#1A1410" opacity="0.9" />
          {/* Iris — dark brown */}
          <circle cx="0" cy="0" r="50" fill={PALETTE.rawUmber} opacity="0.95" />
          {/* Pupil — fully dilated in darkness */}
          <circle cx="0" cy="0" r="38" fill={PALETTE.nearBlack} opacity="1" />
          {/* Light catch — moonlight */}
          <circle cx="-12" cy="-14" r={9 * lightPulse} fill={PALETTE.moonSilver} opacity={0.85 * lightPulse} />
          <circle cx="-12" cy="-14" r={5 * lightPulse} fill={PALETTE.dustWhite} opacity={0.6 * lightPulse} />
          {/* Eyelid lines */}
          <path d="M -110,0 Q 0,-65 110,0" fill="none" stroke={PALETTE.smokeBrown} strokeWidth="4" opacity="0.6" />
          <path d="M -110,0 Q 0,55 110,0" fill="none" stroke={PALETTE.rawUmber} strokeWidth="3" opacity="0.5" />
          {/* Lashes — top */}
          {[-80, -50, -20, 10, 40, 70].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={-Math.sqrt(Math.max(0, 62 * 62 - x * x)) * 0.85}
              x2={x - 4 + i}
              y2={-Math.sqrt(Math.max(0, 62 * 62 - x * x)) * 0.85 - 12}
              stroke={PALETTE.nearBlack}
              strokeWidth="2.5"
              opacity="0.7"
            />
          ))}
        </g>

        {/* RIGHT EYE */}
        <g transform="translate(1330, 540)">
          <ellipse cx="0" cy="0" rx="130" ry="80" fill={PALETTE.nearBlack} opacity="0.9" />
          <ellipse cx="0" cy="0" rx="110" ry="62" fill="#1A1410" opacity="0.9" />
          <circle cx="0" cy="0" r="50" fill={PALETTE.rawUmber} opacity="0.95" />
          <circle cx="0" cy="0" r="38" fill={PALETTE.nearBlack} opacity="1" />
          <circle cx="-10" cy="-14" r={9 * lightPulse} fill={PALETTE.moonSilver} opacity={0.85 * lightPulse} />
          <circle cx="-10" cy="-14" r={5 * lightPulse} fill={PALETTE.dustWhite} opacity={0.6 * lightPulse} />
          <path d="M -110,0 Q 0,-65 110,0" fill="none" stroke={PALETTE.smokeBrown} strokeWidth="4" opacity="0.6" />
          <path d="M -110,0 Q 0,55 110,0" fill="none" stroke={PALETTE.rawUmber} strokeWidth="3" opacity="0.5" />
          {[-80, -50, -20, 10, 40, 70].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={-Math.sqrt(Math.max(0, 62 * 62 - x * x)) * 0.85}
              x2={x - 4 + i}
              y2={-Math.sqrt(Math.max(0, 62 * 62 - x * x)) * 0.85 - 12}
              stroke={PALETTE.nearBlack}
              strokeWidth="2.5"
              opacity="0.7"
            />
          ))}
        </g>

        {/* Bridge of nose — barely visible */}
        <rect x="930" y="490" width="60" height="100" rx="8" fill={PALETTE.rawUmber} opacity="0.08" />
      </svg>

      <GrainOverlay opacity={0.28} />
    </div>
  );
};
