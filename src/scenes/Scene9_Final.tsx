// Scene 9 — 00:55–01:00 — Final wide shot. Figure. Tree. Dawn. Title.
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';
import { TitleCard } from '../components/ScreenText';

export const Scene9Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], { extrapolateRight: 'clamp' });

  // Very slow camera pull-back
  const scale = interpolate(frame, [0, fps * 5], [1.04, 1.0], { extrapolateRight: 'clamp' });

  // Grass sway
  const windPhase = frame / (fps * 1.4);

  // Sun rises — warm light blooms on horizon
  const sunOpacity = interpolate(frame, [0, fps * 2.5], [0, 0.7], { extrapolateRight: 'clamp' });
  const sunGlow = interpolate(frame, [0, fps * 3], [0, 0.35], { extrapolateRight: 'clamp' });

  // Title card: fade in at 3.5s into scene (frame ~105)
  const titleFadeIn = fps * 3.5;
  const titleFadeEnd = fps * 4.5;

  // Long shadow from figure — lengthens over scene
  const shadowLength = interpolate(frame, [0, fps * 5], [200, 350], { extrapolateRight: 'clamp' });

  const grassBlade = (x: number, yBase: number, height: number, phase: number, thick: number, color: string) => {
    const bend = Math.sin(windPhase + phase) * 22 + Math.sin(windPhase * 1.8 + phase) * 8;
    const tipX = x + bend;
    const tipY = yBase - height;
    return (
      <path
        d={`M ${x},${yBase} Q ${x + bend * 0.4},${yBase - height * 0.5} ${tipX},${tipY}`}
        fill="none"
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="round"
        opacity="0.7"
      />
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: fadeIn,
        background: PALETTE.nearBlack,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 50%' }}>
        <svg
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sky9" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="0.95" />
              <stop offset="60%" stopColor={PALETTE.paleSky} stopOpacity="0.5" />
              <stop offset="100%" stopColor={PALETTE.rawUmber} stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="sunRise9" cx="50%" cy="78%" r="45%">
              <stop offset="0%" stopColor={PALETTE.goldHorizon} stopOpacity={sunGlow} />
              <stop offset="40%" stopColor={PALETTE.ochre} stopOpacity={sunGlow * 0.4} />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sunDisk9" cx="50%" cy="80%" r="8%">
              <stop offset="0%" stopColor={PALETTE.goldHorizon} stopOpacity={sunOpacity} />
              <stop offset="100%" stopColor={PALETTE.goldHorizon} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky */}
          <rect width="1920" height="1080" fill={PALETTE.nearBlack} />
          <rect width="1920" height="1080" fill="url(#sky9)" />
          <rect width="1920" height="1080" fill="url(#sunRise9)" />
          <rect width="1920" height="1080" fill="url(#sunDisk9)" />

          {/* Flat horizon — vast veld */}
          <rect x="0" y="720" width="1920" height="360" fill={PALETTE.rawUmber} opacity="0.4" />
          <rect x="0" y="800" width="1920" height="280" fill={PALETTE.nearBlack} opacity="0.5" />

          {/* Distant treeline silhouette */}
          {Array.from({ length: 40 }, (_, i) => (
            <ellipse
              key={i}
              cx={i * 50 - 20}
              cy={714}
              rx={18 + (i % 5) * 6}
              ry={30 + (i % 4) * 8}
              fill={PALETTE.nearBlack}
              opacity="0.7"
            />
          ))}

          {/* Grass field — wide */}
          {Array.from({ length: 90 }, (_, i) => {
            const x = (i / 90) * 1960 - 20;
            const y = 780 + ((i * 41) % 80);
            const h = 80 + ((i * 47) % 100);
            const phase = (i * 0.55) % (Math.PI * 2);
            const thick = 1 + (i % 4) * 0.3;
            const colors = [PALETTE.deadGrass, PALETTE.ochre, PALETTE.smokeBrown];
            return (
              <React.Fragment key={i}>
                {grassBlade(x, y, h, phase, thick, colors[i % 3])}
              </React.Fragment>
            );
          })}

          {/* Massive tree — slightly left, figure stands before it */}
          <g transform="translate(920, 60)">
            <path
              d="M -35,660 C -40,480 -42,320 -20,180 C -10,110 8,60 0,0 C 8,60 30,110 40,180 C 62,320 58,480 53,660 Z"
              fill={PALETTE.nearBlack}
            />
            {/* Branches — morning light catches tips */}
            {[
              { x1: 0, y1: 180, x2: -160, y2: -60, w: 20 },
              { x1: -160, y1: -60, x2: -290, y2: -200, w: 12 },
              { x1: -290, y1: -200, x2: -380, y2: -320, w: 8 },
              { x1: 0, y1: 180, x2: 150, y2: -50, w: 18 },
              { x1: 150, y1: -50, x2: 280, y2: -190, w: 11 },
              { x1: 280, y1: -190, x2: 370, y2: -310, w: 7 },
              { x1: 0, y1: 280, x2: -70, y2: 100, w: 14 },
              { x1: 0, y1: 280, x2: 55, y2: 80, w: 13 },
            ].map((b, i) => (
              <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={PALETTE.nearBlack} strokeWidth={b.w} strokeLinecap="round" />
            ))}
            {/* Gold light catch on highest branches */}
            {[[-380, -320], [-290, -200], [370, -310], [280, -190]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill={PALETTE.goldHorizon} opacity={sunOpacity * 0.4} />
            ))}
          </g>

          {/* Figure — small, standing, back to camera */}
          <g transform="translate(960, 600)">
            {/* Long shadow cast toward viewer */}
            <path
              d={`M -18,0 L -30,${shadowLength} L 30,${shadowLength} L 18,0 Z`}
              fill={PALETTE.nearBlack}
              opacity="0.35"
              transform="skewX(-8)"
            />
            {/* Legs */}
            <line x1="-12" y1="0" x2="-14" y2="100" stroke={PALETTE.smokeBrown} strokeWidth="16" strokeLinecap="round" opacity="0.9" />
            <line x1="12" y1="0" x2="14" y2="100" stroke={PALETTE.smokeBrown} strokeWidth="16" strokeLinecap="round" opacity="0.9" />
            {/* Body */}
            <rect x="-22" y="-80" width="44" height="90" rx="8" fill={PALETTE.smokeBrown} opacity="0.88" />
            {/* Gold rim-light on back from sunrise */}
            <rect x="18" y="-80" width="5" height="90" rx="2" fill={PALETTE.goldHorizon} opacity={sunOpacity * 0.5} />
            {/* Arms — hanging still */}
            <line x1="-22" y1="-60" x2="-34" y2="10" stroke={PALETTE.smokeBrown} strokeWidth="12" strokeLinecap="round" opacity="0.85" />
            <line x1="22" y1="-60" x2="34" y2="10" stroke={PALETTE.smokeBrown} strokeWidth="12" strokeLinecap="round" opacity="0.85" />
            {/* Head */}
            <ellipse cx="0" cy="-110" rx="22" ry="26" fill={PALETTE.burntSienna} opacity="0.85" />
            {/* Gold rim on head */}
            <path d="M 16,-125 Q 24,-105 20,-88" fill="none" stroke={PALETTE.goldHorizon} strokeWidth="3" opacity={sunOpacity * 0.55} />
          </g>

          {/* Vignette — heavy corners */}
          <radialGradient id="vig9" cx="50%" cy="55%" r="68%">
            <stop offset="15%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.9" />
          </radialGradient>
          <rect width="1920" height="1080" fill="url(#vig9)" />
        </svg>
      </div>

      {/* Title — fades in at 3.5s */}
      <TitleCard fadeInStart={titleFadeIn} fadeInEnd={titleFadeEnd} />

      <GrainOverlay opacity={0.18} />
    </div>
  );
};
