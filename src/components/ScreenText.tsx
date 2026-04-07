import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../palette';

interface ScreenTextProps {
  text: string;
  size?: number;
  bottom?: number;
  top?: number;
  fadeInStart?: number;
  fadeInEnd?: number;
  fadeOutStart?: number;
  fadeOutEnd?: number;
  center?: boolean;
  letterSpacing?: number;
}

export const ScreenText: React.FC<ScreenTextProps> = ({
  text,
  size = 38,
  bottom,
  top,
  fadeInStart = 0,
  fadeInEnd = 20,
  fadeOutStart = 9999,
  fadeOutEnd = 9999,
  center = false,
  letterSpacing = 6,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const posStyle: React.CSSProperties = {};
  if (bottom !== undefined) posStyle.bottom = bottom;
  if (top !== undefined) posStyle.top = top;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: center ? 'center' : 'flex-start',
        paddingLeft: center ? 0 : 80,
        opacity,
        ...posStyle,
      }}
    >
      <span
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: size,
          fontStyle: 'italic',
          fontWeight: 400,
          color: PALETTE.dustWhite,
          letterSpacing,
          textShadow: `2px 2px 0px rgba(0,0,0,0.9), 4px 4px 12px rgba(0,0,0,0.7), -1px -1px 0px rgba(0,0,0,0.8)`,
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const TitleCard: React.FC<{
  fadeInStart: number;
  fadeInEnd: number;
}> = ({ fadeInStart, fadeInEnd }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineScale = interpolate(frame, [fadeInStart, fadeInEnd], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity,
        transform: `scale(${lineScale})`,
      }}
    >
      <div
        style={{
          width: 120,
          height: 1,
          background: PALETTE.dustWhite,
          opacity: 0.5,
          marginBottom: 28,
        }}
      />
      <span
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: 72,
          fontWeight: 700,
          fontStyle: 'normal',
          color: PALETTE.dustWhite,
          letterSpacing: 18,
          textTransform: 'uppercase',
          textShadow: `3px 3px 0px rgba(0,0,0,1), 6px 6px 20px rgba(0,0,0,0.9)`,
          textAlign: 'center',
        }}
      >
        DIE STIL WAGTER
      </span>
      <div
        style={{
          width: 120,
          height: 1,
          background: PALETTE.dustWhite,
          opacity: 0.5,
          marginTop: 28,
        }}
      />
    </div>
  );
};
