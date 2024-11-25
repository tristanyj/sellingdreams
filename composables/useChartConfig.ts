export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 600;
  const margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
  };

  return {
    width,
    height,
    margin,
  };
}
