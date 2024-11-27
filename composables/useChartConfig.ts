export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 6000;
  const width = 1600;
  const margin = {
    top: 50,
    right: 400,
    bottom: 50,
    left: 400,
  };

  return {
    width,
    height,
    margin,
  };
}
