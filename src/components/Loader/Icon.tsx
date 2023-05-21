import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

type Props = {
  active?: boolean;
  icon: IconProp;
};

export const Icon: FC<Props> = ({ active, icon }) => (
  <FontAwesomeIcon
    icon={icon}
    size="3x"
    opacity={active ? 1 : 0.5}
    style={{
      transition: 'opacity 0.5s',
    }}
  />
);
