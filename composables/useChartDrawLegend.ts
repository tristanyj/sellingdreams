import type { d3GSelection } from '~/types';

import { createLine } from './useChartDrawLines';

export function useChartDrawLegend() {
  const { opacity } = useChartConfig();

  const interactionStore = useInteractionStore();
  const { setTooltipCategory } = interactionStore;

  const figureStore = useFigureStore();
  const { selectedArea, series } = storeToRefs(figureStore);
  const { selectArea } = figureStore;

  const dataStore = useDataStore();
  const { categories } = storeToRefs(dataStore);

  const drawCategoryLegend = (g: d3GSelection) => {
    const firstOfEach = series.value.map((s) => ({
      id: s.id,
      color: s.color,
      point: s.areaPoints[0],
    }));

    const fontSize = 11;

    const legendGroup = g.append('g').attr('class', 'legend-group');

    firstOfEach.forEach((serie) => {
      const category = categories.value.find((c) => c.id === serie.id);
      if (!category) return;

      const x = (serie.point.x0 + serie.point.x1) / 2;
      const y2 = serie.point.y - 50;

      createLine(legendGroup, {
        className: 'legend-line',
        x1: x,
        x2: x,
        y1: serie.point.y,
        y2: y2,
        opacity: opacity.line.enabled,
        transform: '',
      });

      legendGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y2 - 10)
        .attr('r', 4)
        .attr('fill', serie.color);

      legendGroup
        .append('text')
        .attr('class', 'legend-text')
        .attr('x', x + 18)
        .attr('y', y2 - 12)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .attr('font-size', fontSize)
        .attr('transform', `rotate(300, ${x}, ${y2})`)
        .attr('cursor', 'pointer')
        .text(category.name);
    });
  };

  return {
    drawCategoryLegend,
  };
}
