export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 7000;
  const width = 1400;
  const margin = {
    x: 600,
    y: 800,
    offset: 0,
  };

  const spacing = 16;

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
      legend: 0.5,
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
