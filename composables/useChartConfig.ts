export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 6000;
  const width = 1400;
  const margin = {
    top: 50,
    right: 400,
    bottom: 50,
    left: 400,
  };

  const spacing = 20;

  const palette = [
    '#03071e',
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
