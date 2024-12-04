export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 5000;
  const width = 1400;
  const margin = {
    top: 50,
    right: 350,
    bottom: 50,
    left: 350,
  };

  const spacing = 15;

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

  return {
    width,
    height,
    margin,
    palette,
    spacing,
  };
}
