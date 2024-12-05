export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 7000;
  const width = 1400;
  const margin = {
    x: 500,
    y: 100,
    offset: -50,
  };

  const spacing = 15;

  const palette = [
    '#797d62',
    '#0a9396',
    '#94d2bd',
    '#370617',
    '#ee9b00',
    '#ca6702',
    '#bb3e03',
    '#ae2012',
  ];

  const opacity = {
    area: {
      disabled: 0.25,
      muted: 0.65,
    },
    point: {
      muted: 0.25,
    },
    line: {
      enabled: 0.15,
      muted: 0.05,
    },
  };

  return {
    width,
    height,
    margin,
    palette,
    spacing,
    opacity,
  };
}
