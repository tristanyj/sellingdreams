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
    spacing,
    opacity,
  };
}
