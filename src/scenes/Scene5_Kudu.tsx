// Scene 5 — 00:27–00:36 — Kudu bull between thorntrees, standing, watching
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../palette';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene5Kudu: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 8, fps * 9], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Ear rotation — subtle flick
  const earAngle = Math.sin(frame / (fps * 1.2)) * 8 + Math.sin(frame / (fps * 0.4)) * 3;
  // Nostril breath — exhale mist in cold air
  const breathOpacity = interpolate(
    frame % (fps * 2.5),
    [0, fps * 0.3, fps * 1.2, fps * 2.5],
    [0, 0.5, 0.1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const breathSize = interpolate(frame % (fps * 2.5), [0, fps * 1.2], [1, 2.2], {
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
          <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.coldShadow} stopOpacity="0.95" />
            <stop offset="50%" stopColor={PALETTE.paleSky} stopOpacity="0.3" />
            <stop offset="100%" stopColor={PALETTE.rawUmber} stopOpacity="0.8" />
          </linearGradient>
          {/* Dappled forest light */}
          <radialGradient id="forestLight5" cx="55%" cy="30%" r="40%">
            <stop offset="0%" stopColor={PALETTE.ochre} stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1920" height="1080" fill={PALETTE.nearBlack} />
        <rect width="1920" height="1080" fill="url(#sky5)" />
        <rect width="1920" height="1080" fill="url(#forestLight5)" />

        {/* Ground */}
        <rect x="0" y="820" width="1920" height="260" fill={PALETTE.rawUmber} opacity="0.5" />
        <rect x="0" y="860" width="1920" height="220" fill={PALETTE.nearBlack} opacity="0.5" />

        {/* Thorntree trunks — left and right */}
        {/* Left thorntree */}
        <g>
          <line x1="280" y1="1080" x2="320" y2="200" stroke={PALETTE.nearBlack} strokeWidth="28" strokeLinecap="round" />
          <line x1="310" y1="400" x2="120" y2="100" stroke={PALETTE.nearBlack} strokeWidth="14" strokeLinecap="round" />
          <line x1="120" y1="100" x2="40" y2="-40" stroke={PALETTE.nearBlack} strokeWidth="8" />
          <line x1="310" y1="500" x2="480" y2="300" stroke={PALETTE.nearBlack} strokeWidth="12" strokeLinecap="round" />
          {/* Thorns */}
          {[[120, 100], [200, 280], [310, 400], [40, -20]].map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x - 12} y2={y - 5} stroke={PALETTE.nearBlack} strokeWidth="3" />
              <line x1={x} y1={y} x2={x + 8} y2={y - 8} stroke={PALETTE.nearBlack} strokeWidth="3" />
            </g>
          ))}
        </g>

        {/* Right thorntree */}
        <g>
          <line x1="1600" y1="1080" x2="1560" y2="180" stroke={PALETTE.nearBlack} strokeWidth="24" strokeLinecap="round" />
          <line x1="1570" y1="380" x2="1760" y2="80" stroke={PALETTE.nearBlack} strokeWidth="12" strokeLinecap="round" />
          <line x1="1570" y1="500" x2="1400" y2="260" stroke={PALETTE.nearBlack} strokeWidth="10" strokeLinecap="round" />
          <line x1="1760" y1="80" x2="1820" y2="-20" stroke={PALETTE.nearBlack} strokeWidth="6" />
        </g>

        {/* Kudu body — centred, majestic */}
        <g transform="translate(960, 520)">
          {/* Body */}
          <ellipse cx="0" cy="80" rx="160" ry="100" fill={PALETTE.burntSienna} opacity="0.85" />

          {/* Neck */}
          <path
            d="M -40,20 Q -20,-80 0,-160 Q 20,-80 40,20 Z"
            fill={PALETTE.burntSienna}
            opacity="0.9"
          />

          {/* Head */}
          <ellipse cx="0" cy="-175" rx="42" ry="52" fill={PALETTE.burntSienna} opacity="0.9" />

          {/* Nose */}
          <ellipse cx="0" cy="-135" rx="22" ry="14" fill={PALETTE.smokeBrown} opacity="0.8" />
          <ellipse cx="-7" cy="-133" rx="4" ry="5" fill={PALETTE.nearBlack} opacity="0.9" />
          <ellipse cx="7" cy="-133" rx="4" ry="5" fill={PALETTE.nearBlack} opacity="0.9" />

          {/* Breath mist */}
          <ellipse
            cx="0"
            cy="-118"
            rx={18 * breathSize}
            ry={8 * breathSize}
            fill={PALETTE.moonSilver}
            opacity={breathOpacity}
          />

          {/* Eye — dark, knowing */}
          <ellipse cx="-22" cy="-185" rx="10" ry="9" fill={PALETTE.nearBlack} opacity="1" />
          <ellipse cx="-22" cy="-185" rx="4" ry="4" fill={PALETTE.coldShadow} opacity="0.4" />
          {/* Eye light catch */}
          <circle cx="-20" cy="-187" r="2" fill={PALETTE.moonSilver} opacity="0.8" />

          {/* White stripe markings */}
          {[-60, -30, 0, 30, 60].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1="20"
              x2={x + 5}
              y2="140"
              stroke={PALETTE.dustWhite}
              strokeWidth="2.5"
              opacity="0.2"
            />
          ))}

          {/* Ears — rotate with earAngle */}
          <g transform={`translate(-42,-168) rotate(${earAngle}, 0, 0)`}>
            <ellipse cx="0" cy="-20" rx="10" ry="22" fill={PALETTE.burntSienna} opacity="0.9" />
            <ellipse cx="0" cy="-16" rx="5" ry="14" fill={PALETTE.rawUmber} opacity="0.5" />
          </g>
          <g transform={`translate(42,-168) rotate(${-earAngle * 0.6}, 0, 0)`}>
            <ellipse cx="0" cy="-20" rx="10" ry="22" fill={PALETTE.burntSienna} opacity="0.9" />
            <ellipse cx="0" cy="-16" rx="5" ry="14" fill={PALETTE.rawUmber} opacity="0.5" />
          </g>

          {/* Horns — spiral */}
          <path
            d="M -18,-220 C -30,-290 -70,-330 -80,-390 C -85,-430 -60,-450 -30,-440 C 0,-430 10,-400 5,-360 C -5,-310 -20,-280 -15,-240"
            fill="none"
            stroke={PALETTE.smokeBrown}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 18,-220 C 30,-290 70,-330 80,-390 C 85,-430 60,-450 30,-440 C 0,-430 -10,-400 -5,-360 C 5,-310 20,-280 15,-240"
            fill="none"
            stroke={PALETTE.smokeBrown}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Legs */}
          {[[-80, 130], [-30, 130], [30, 130], [80, 130]].map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x + (i < 2 ? -5 : 5)} y2={y + 160} stroke={PALETTE.smokeBrown} strokeWidth="14" strokeLinecap="round" opacity="0.85" />
              <line x1={x + (i < 2 ? -5 : 5)} y1={y + 160} x2={x + (i < 2 ? -8 : 8)} y2={y + 200} stroke={PALETTE.smokeBrown} strokeWidth="10" strokeLinecap="round" opacity="0.8" />
            </g>
          ))}

          {/* Tail */}
          <path d="M 130,80 Q 180,60 170,30" fill="none" stroke={PALETTE.smokeBrown} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Cathedral light beams through trees */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${800 + i * 180},0 L ${780 + i * 180},1080`}
            fill="none"
            stroke={PALETTE.ochre}
            strokeWidth={20 + i * 10}
            opacity="0.04"
          />
        ))}

        {/* Vignette */}
        <radialGradient id="vig5" cx="50%" cy="48%" r="62%">
          <stop offset="20%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.nearBlack} stopOpacity="0.85" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#vig5)" />
      </svg>

      <GrainOverlay opacity={0.2} />
    </div>
  );
};
