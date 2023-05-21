import { createGlobalStyle, css } from 'styled-components';

type Props = {
  temperature?: number;
};

export const GlobalStyle = createGlobalStyle<Props>(({ temperature }) => {
  const hue = getHueForTemperature(temperature);

  return css`
    html,
    body {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #root {
      height: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Open Sans', Arial, sans-serif;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      background: linear-gradient(
        to bottom,
        hsl(210, 67%, 30%) 0%,
        hsl(210, 69%, 45%) 50%,
        hsl(210, 70%, 62%) 100%
      );
      background-color: hsl(${hue}, 67%, 30%);
      background-image: linear-gradient(
        to bottom,
        hsl(${hue}, 67%, 30%) 0%,
        hsl(${hue}, 69%, 45%) 50%,
        hsl(${hue}, 70%, 62%) 100%
      );
    }
  `;
});

const getHueForTemperature = (temperature?: number): number => {
  if (temperature === undefined) {
    return 210;
  }

  const minTemperature = -20;
  const maxTemperature = 40;

  const minHue = 270;
  const maxHue = 0;

  return (
    maxHue +
    ((minHue - maxHue) * (maxTemperature - temperature)) /
      (maxTemperature - minTemperature)
  );
};
