export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 5000;
  const width = 1400;
  const margin = {
    top: 50,
    right: 400,
    bottom: 50,
    left: 400,
  };

  const spacing = 10;

  const palette = [
    '#03071e',
    '#0a9396',
    '#94d2bd',
    '#e9d8a6',
    '#ee9b00',
    '#ca6702',
    '#bb3e03',
    '#ae2012',
  ];

  return {
    width,
    height,
    margin,
    palette,
    spacing,
  };
}
