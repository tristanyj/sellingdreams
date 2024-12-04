import * as d3 from 'd3';
import type { d3GSelection, Line } from '~/types';

const createLine = (g: d3GSelection, params: Line, color = '#000') => {
  g.append('line')
    .attr('class', params.className)
    .attr('x1', params.x1)
    .attr('y1', params.y1)
    .attr('x2', params.x2)
    .attr('y2', params.y2)
    .attr('stroke', params.stroke ?? color)
    .attr('opacity', params.opacity ?? 1)
    .attr('stroke-width', params.strokeWidth ?? 1)
    .attr('transform', params.transform);
};

export function useChartDrawLines() {
  const { width } = useChartConfig();

  const figureStore = useFigureStore();
  const { figures } = storeToRefs(figureStore);
  const { getSeries } = figureStore;

  const drawYearLegend = (g: d3GSelection, yScale: d3.ScalePoint<string>) => {
    const lineGroup = g.append('g').attr('class', 'year-legend-group');

    for (const figure of figures.value) {
      const y = yScale(figure.year.toString()) ?? 0;

      createLine(lineGroup, {
        className: 'year-line',
        x1: 67,
        x2: width,
        y1: y,
        y2: y,
        opacity: 0.15,
        transform: '',
      });

      createLine(lineGroup, {
        className: 'year-line',
        x1: 0,
        x2: 25,
        y1: y,
        y2: y,
        opacity: 0.15,
        transform: '',
      });

      lineGroup
        .append('text')
        .attr('class', 'year-label')
        .attr('x', 30)
        .attr('y', y + 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '13px')
        .text(figure.year);
    }
  };

  const drawCategoryLines = (
    g: d3GSelection,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScalePoint<string>
  ) => {
    const series = getSeries(xScale, yScale);

    const line = d3
      .line<{ y: number; x: number }>()
      .y((d) => d.y)
      .x((d) => d.x)
      .curve(d3.curveLinear);

    g.selectAll('.category-line')
      .data(series)
      .join('path')
      .attr('class', 'category-line')
      .attr('d', (d) => line(d.areaPoints.map((p) => ({ y: p.y, x: (p.x0 + p.x1) / 2 }))))
      .attr('fill', 'none')
      .attr('stroke', (_) => 'white')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.1);
  };

  return {
    drawYearLegend,
    drawCategoryLines,
  };
}
