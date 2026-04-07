import React from 'react';
import { Composition } from 'remotion';
import { StilWagter } from './StilWagter';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StilWagter"
        component={StilWagter}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
