import {
  faMobileAlt,
  faServer,
  faThermometerHalf,
} from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import styled from 'styled-components';

import { WebSocketsState } from '../../hooks';

import { ConnectingLine } from './ConnectingLine';
import { Icon } from './Icon';

const Wrapper = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
`;

type Props = {
  state: WebSocketsState;
};

export const Loader: FC<Props> = ({ state }) => (
  <Wrapper>
    <Icon icon={faMobileAlt} active={state !== 'error'} />
    <ConnectingLine dotCount={5} speed={10} active={state === 'connecting'} />
    <Icon icon={faServer} active={state === 'waiting'} />
    <ConnectingLine
      dotCount={5}
      speed={10}
      active={state === 'waiting'}
      direction="left"
    />
    <Icon icon={faThermometerHalf} />
  </Wrapper>
);
