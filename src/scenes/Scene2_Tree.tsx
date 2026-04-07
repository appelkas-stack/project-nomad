// Scene 2 — 00:06–00:14 — Massive marula tree silhouette, camera pulls back
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene2Tree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 7, fps * 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Camera pull-back: scale down very slightly over time
  const scale = interpolate(frame, [0, fps * 8], [1.06, 1.0], { extrapolateRight: 'clamp' });

  // Branch sway — sinusoidal
  const sway = Math.sin(frame / (fps * 1.8)) * 2.5;

  // Sky brightens slightly over scene
  const skyBrightness = interpolate(frame, [0, fps * 8], [0, 0.06], { extrapolateRight: 'clamp' });

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
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 60%' }}>
        <svg
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity={0.85 + skyBrightness} />
              <stop offset="45%" stopColor={PALETTE.paleSky} stopOpacity={0.35 + skyBrightness} />
              <stop offset="100%" stopColor={PALETTE.rawUmber} stopOpacity="1" />
            </linearGradient>
            <radialGradient id="horizonGlow2" cx="42%" cy="72%" r="40%">
              <stop offset="0%" stopColor={PALETTE.paleSky} stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky */}
          <rect width="1920" height="1080" fill={PALETTE.nearBlack} />
          <rect width="1920" height="1080" fill="url(#sky2)" />
          <rect width="1920" height="1080" fill="url(#horizonGlow2)" />

          {/* Ground */}
          <rect x="0" y="780" width="1920" height="300" fill={PALETTE.nearBlack} />
          <rect x="0" y="760" width="1920" height="60" fill={PALETTE.rawUmber} opacity="0.5" />

          {/* Distant treeline silhouette */}
          {[100, 220, 340, 480, 580, 680, 820, 950, 1050, 1150, 1280, 1400, 1520, 1650, 1780].map((x, i) => (
            <ellipse
              key={i}
              cx={x}
              cy={750}
              rx={25 + (i % 4) * 8}
              ry={40 + (i % 3) * 12}
              fill={PALETTE.nearBlack}
              opacity="0.9"
            />
          ))}

          {/* Main marula tree trunk — massive, off-center left */}
          <g transform={`translate(720, 80) rotate(${sway * 0.3}, 0, 700)`}>
            {/* Trunk */}
            <path
              d="M -45,700 C -50,500 -55,350 -30,200 C -20,130 10,80 0,0 C 10,80 40,130 50,200 C 75,350 70,500 65,700 Z"
              fill={PALETTE.nearBlack}
            />
            {/* Main branches */}
            <g transform={`rotate(${sway * 0.5}, 0, 200)`}>
              <line x1="0" y1="200" x2="-180" y2="-80" stroke={PALETTE.nearBlack} strokeWidth="22" strokeLinecap="round" />
              <line x1="-180" y1="-80" x2="-320" y2="-220" stroke={PALETTE.nearBlack} strokeWidth="14" strokeLinecap="round" />
              <line x1="-320" y1="-220" x2="-420" y2="-340" stroke={PALETTE.nearBlack} strokeWidth="9" strokeLinecap="round" />
              <line x1="-320" y1="-220" x2="-260" y2="-380" stroke={PALETTE.nearBlack} strokeWidth="7" strokeLinecap="round" />
              <line x1="-180" y1="-80" x2="-100" y2="-260" stroke={PALETTE.nearBlack} strokeWidth="10" strokeLinecap="round" />
            </g>
            <g transform={`rotate(${-sway * 0.4}, 0, 200)`}>
              <line x1="0" y1="200" x2="160" y2="-60" stroke={PALETTE.nearBlack} strokeWidth="20" strokeLinecap="round" />
              <line x1="160" y1="-60" x2="300" y2="-200" stroke={PALETTE.nearBlack} strokeWidth="13" strokeLinecap="round" />
              <line x1="300" y1="-200" x2="420" y2="-340" stroke={PALETTE.nearBlack} strokeWidth="8" strokeLinecap="round" />
              <line x1="300" y1="-200" x2="240" y2="-360" stroke={PALETTE.nearBlack} strokeWidth="6" strokeLinecap="round" />
              <line x1="160" y1="-60" x2="80" y2="-260" stroke={PALETTE.nearBlack} strokeWidth="9" strokeLinecap="round" />
            </g>
            {/* Sub branches */}
            <g transform={`rotate(${sway * 0.8}, 0, 300)`}>
              <line x1="0" y1="300" x2="-80" y2="100" stroke={PALETTE.nearBlack} strokeWidth="16" strokeLinecap="round" />
              <line x1="-80" y1="100" x2="-200" y2="-60" stroke={PALETTE.nearBlack} strokeWidth="10" strokeLinecap="round" />
              <line x1="0" y1="300" x2="60" y2="80" stroke={PALETTE.nearBlack} strokeWidth="14" strokeLinecap="round" />
              <line x1="60" y1="80" x2="180" y2="-80" stroke={PALETTE.nearBlack} strokeWidth="9" strokeLinecap="round" />
            </g>
            {/* Fine tip branches */}
            {[
              [-420, -340, -460, -400],
              [-420, -340, -390, -420],
              [-260, -380, -300, -440],
              [-100, -260, -130, -330],
              [240, -360, 270, -430],
              [420, -340, 460, -400],
              [80, -260, 100, -340],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2 + sway * 1.2}
                y2={y2}
                stroke={PALETTE.nearBlack}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
            ))}
          </g>

          {/* Vignette */}
          <radialGradient id="vig2" cx="42%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.8" />
          </radialGradient>
          <rect width="1920" height="1080" fill="url(#vig2)" />
        </svg>
      </div>

      <GrainOverlay opacity={0.2} />
    </div>
  );
};
