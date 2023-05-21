import React, { FC } from 'react';

import { ConnectingDot } from './ConnectingDot';

type Props = {
  active?: boolean;
  dotCount: number;
  speed: number;
  direction?: 'left' | 'right';
};

export const ConnectingLine: FC<Props> = ({
  active,
  dotCount,
  speed = 10,
  direction = 'right',
}) => {
  const delayFactor = 1 / speed;
  const duration = delayFactor * dotCount;

  const dots = Array(dotCount)
    .fill(null)
    .map((_, idx) => (
      <ConnectingDot
        key={idx}
        active={active}
        duration={duration}
        delay={delayFactor * (idx + 1) - duration}
      />
    ));

  if (direction === 'left') {
    dots.reverse();
  }

  return <>{dots}</>;
};
