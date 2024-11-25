export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 5000;
  const height = 650;
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
