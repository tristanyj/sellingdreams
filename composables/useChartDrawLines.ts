import * as d3 from 'd3';
import type { d3GSelection, Line } from '~/types';
import { formatNumber, calcTextLength } from '~/assets/scripts/utils';

const createLine = (g: d3GSelection, params: Line, color = '#000') => {
  g.append('line')
    .attr('class', params.className)
    .attr('id', params?.id ?? `${params.className}${params.x1}-${params.y1}`)
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
  const { width, opacity } = useChartConfig();

  const figureStore = useFigureStore();
  const { figures } = storeToRefs(figureStore);
  const { getSeries } = figureStore;

  const drawYearLegend = (g: d3GSelection, yScale: d3.ScalePoint<string>) => {
    const lineGroup = g.append('g').attr('class', 'year-legend-group');

    for (const figure of figures.value) {
      const y = yScale(figure.year.toString()) ?? 0;
      const padding = 4;

      const leftText = figure.year.toString();
      const rightSubText = `${figure.total.proportion_of_gdp}% of GDP`;
      const rightText = `$${formatNumber(figure.total.nominal)}`;

      const leftTextLength = calcTextLength(lineGroup, leftText, 14);
      const rightTextLength = calcTextLength(lineGroup, rightText, 14);

      createLine(lineGroup, {
        id: `year-line-${figure.year}`,
        className: 'year-line',
        x1: leftTextLength + padding,
        x2: width - rightTextLength - padding,
        y1: y,
        y2: y,
        opacity: opacity.line.enabled,
        transform: '',
      });

      lineGroup
        .append('text')
        .attr('class', 'year-text left-text')
        .attr('id', `year-text-${figure.year}`)
        .attr('x', 0)
        .attr('y', y + 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text(leftText);

      lineGroup
        .append('text')
        .attr('class', 'year-sub-text right-sub-text')
        .attr('id', `year-sub-text-${figure.year}`)
        .attr('x', width)
        .attr('y', y + 21)
        .attr('text-anchor', 'end')
        .attr('font-size', '14px')
        .attr('opacity', 0.5)
        .text(rightSubText);

      lineGroup
        .append('text')
        .attr('class', 'year-text right-text')
        .attr('id', `year-text-${figure.year}`)
        .attr('x', width)
        .attr('y', y + 3)
        .attr('text-anchor', 'end')
        .attr('font-size', '14px')
        .text(rightText);
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

    series.forEach((serie) => {
      serie.areaPoints.forEach((point) => {
        const y = point.y;
        createLine(g, {
          className: 'year-category-line',
          x1: point.x0,
          x2: point.x1,
          y1: y,
          y2: y,
          opacity: 0.05,
          transform: '',
          stroke: 'white',
        });
      });
    });
  };

  return {
    drawYearLegend,
    drawCategoryLines,
  };
}
