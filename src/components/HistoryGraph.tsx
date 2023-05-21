import { scaleLinear } from 'd3-scale';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

const Graph = styled.div`
  margin: 30px;
  position: relative;
`;

const Svg = styled.svg`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: visible;
`;

const MainGraph = styled.g<{ offsetY: number }>(
  ({ offsetY }) => css`
    transform: translate(0, ${offsetY}px);
  `,
);

const Tick = styled(MainGraph)`
  font-size: 0.725em;
  font-weight: 200;
`;

const TickLine = styled.line`
  stroke: rgba(255, 255, 255, 0.5);
  stroke-dasharray: 2;
`;

const TickText = styled.text`
  fill: #fff;
  text-anchor: start;
`;

const PathLine = styled.path`
  fill: none;
  stroke: rgba(255, 255, 255, 0.75);
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 2;
`;

const padding = { top: 20, right: 15, bottom: 20, left: 25 };
const yTicks = [-20, 0, 20, 40];
const width = 300;
const height = 200;

export type HistoryValue = {
  x: number;
  y: number;
};

type Props = {
  points: HistoryValue[];
};

export const HistoryGraph: FC<Props> = ({ points }) => {
  const minX = points.length > 0 ? points[0].x : 0;
  const maxX = points.length > 0 ? points[points.length - 1].x : 0;

  const yScale = scaleLinear()
    .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
    .range([height - padding.bottom, padding.top]);

  const xScale = scaleLinear()
    .domain([minX, maxX])
    .range([padding.left, width - padding.right]);

  const path = `M${points
    .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
    .join('L')}`;

  return (
    <Graph>
      <Svg>
        <MainGraph offsetY={padding.top}>
          {yTicks.map((tick) => (
            <Tick offsetY={yScale(tick) - padding.bottom} key={tick}>
              <TickLine x2="100%" />
              <TickText y="-4">
                {tick}
                {tick === 0 ? ' °C' : ''}
              </TickText>
            </Tick>
          ))}
        </MainGraph>
        {points.length > 0 && <PathLine d={path} />}
      </Svg>
    </Graph>
  );
};
