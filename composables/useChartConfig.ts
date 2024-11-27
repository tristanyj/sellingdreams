export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 8000;
  const width = 1400;
  const margin = {
    top: 50,
    right: 500,
    bottom: 50,
    left: 0,
  };

  return {
    width,
    height,
    margin,
  };
}
