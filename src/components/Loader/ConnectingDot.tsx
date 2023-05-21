import styled, { css, keyframes } from 'styled-components';

const fade = keyframes`
  0% {
    transform: scale(0.3);
  }
  30% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(1);
  }
  70% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(0.3);
  }
`;

type Props = {
  active?: boolean;
  delay?: number;
  duration?: number;
};

export const ConnectingDot = styled.div<Props>(
  ({ active, delay = 0, duration = 1 }) => css`
    width: 3px;
    height: 3px;
    background-color: white;
    margin: 4px;
    transform: scale(0.3);
    animation: ${fade} ${duration}s linear infinite;
    animation-delay: ${delay}s;
    ${!active && 'animation: none'};
  `,
);
