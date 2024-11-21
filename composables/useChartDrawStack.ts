import type { d3GSelection } from '~/types';

export function useChartDrawStack() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const drawSteamGraph = (g: d3GSelection) => {
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', 'red');
  };

  return {
    drawSteamGraph,
  };
}
