export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const height = 5000;
  const width = 1000;
  const margin = {
    top: 20,
    right: 100,
    bottom: 20,
    left: 100,
  };

  return {
    width,
    height,
    margin,
  };
}
