import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Scene1Earth } from './scenes/Scene1_Earth';
import { Scene2Tree } from './scenes/Scene2_Tree';
import { Scene3Grass } from './scenes/Scene3_Grass';
import { Scene4Footprints } from './scenes/Scene4_Footprints';
import { Scene5Kudu } from './scenes/Scene5_Kudu';
import { Scene6Figure } from './scenes/Scene6_Figure';
import { Scene7Waterhole } from './scenes/Scene7_Waterhole';
import { Scene8Eyes } from './scenes/Scene8_Eyes';
import { Scene9Final } from './scenes/Scene9_Final';
import { ScreenText } from './components/ScreenText';

// Scene timing at 30fps
// Scene 1:  00:00–00:06  →  0–180
// Scene 2:  00:06–00:14  →  180–420
// Scene 3:  00:14–00:20  →  420–600
// Scene 4:  00:20–00:27  →  600–810
// Scene 5:  00:27–00:36  →  810–1080
// Scene 6:  00:36–00:45  →  1080–1350
// Scene 7:  00:45–00:51  →  1350–1530
// Scene 8:  00:51–00:55  →  1530–1650
// Scene 9:  00:55–01:00  →  1650–1800

const SCENES = [
  { from: 0,    duration: 200,  component: Scene1Earth },
  { from: 170,  duration: 270,  component: Scene2Tree },
  { from: 410,  duration: 210,  component: Scene3Grass },
  { from: 590,  duration: 240,  component: Scene4Footprints },
  { from: 800,  duration: 300,  component: Scene5Kudu },
  { from: 1060, duration: 320,  component: Scene6Figure },
  { from: 1330, duration: 230,  component: Scene7Waterhole },
  { from: 1520, duration: 150,  component: Scene8Eyes },
  { from: 1640, duration: 160,  component: Scene9Final },
] as const;

export const StilWagter: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: '#0A0806' }}>
      {/* Scene sequences with overlapping cross-dissolve */}
      {SCENES.map(({ from, duration, component: SceneComponent }) => (
        <Sequence key={from} from={from} durationInFrames={duration} layout="none">
          <AbsoluteFill>
            <SceneComponent />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* On-screen text overlays */}

      {/* "Die bosveld vergeet niks." — appears at 14s, gone by 19s */}
      <Sequence from={fps * 14} durationInFrames={fps * 6} layout="none">
        <AbsoluteFill>
          <ScreenText
            text="Die bosveld vergeet niks."
            size={42}
            bottom={160}
            fadeInStart={0}
            fadeInEnd={fps * 1.2}
            fadeOutStart={fps * 4}
            fadeOutEnd={fps * 6}
            letterSpacing={5}
          />
        </AbsoluteFill>
      </Sequence>

      {/* "Stilte is nie swakheid nie." — appears at 51s */}
      <Sequence from={fps * 51} durationInFrames={fps * 4} layout="none">
        <AbsoluteFill>
          <ScreenText
            text="Stilte is nie swakheid nie."
            size={36}
            bottom={80}
            fadeInStart={0}
            fadeInEnd={fps * 0.8}
            fadeOutStart={fps * 2.5}
            fadeOutEnd={fps * 4}
            letterSpacing={4}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
