import * as d3 from 'd3';
import type { d3GSelection, Line } from '~/types';
import { formatNumber, calcTextLength } from '~/assets/scripts/utils';

export const createLine = (g: d3GSelection, params: Line, color = '#000') => {
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
  const { selectArea } = figureStore;
  const { figures, series } = storeToRefs(figureStore);

  const interactionStore = useInteractionStore();
  const { figureMode } = storeToRefs(interactionStore);

  const dataStore = useDataStore();
  const { categories, events } = storeToRefs(dataStore);

  const drawYearLegend = (g: d3GSelection, yScale: d3.ScalePoint<string>) => {
    const lineGroup = g
      .append('g')
      .attr('class', 'year-legend-group')
      .on('click', () => {
        selectArea(null);
      });

    for (const figure of figures.value) {
      const yearGroup = lineGroup
        .append('g')
        .attr('class', 'year-group')
        .attr('id', `year-group-${figure.year}`);

      const y = yScale(figure.year.toString()) ?? 0;
      const padding = 10;
      const textOffset = 4;
      const subTextOffset = 22;
      const fontSizeYear = 16;
      const fontSize = 16;

      const event = events.value.find((e) => e.year === figure.year);
      let leftSubText = '';
      if (event) {
        leftSubText = event.name;
      }

      const leftText = figure.year.toString();
      const rightSubText = `${(figure.total.proportion_of_gdp * 100).toFixed(2)}% of GDP`;
      const rightText = `$${formatNumber(figure.total[figureMode.value])}`;

      const leftTextLength = calcTextLength(lineGroup, leftText, fontSizeYear);
      const rightTextLength = calcTextLength(lineGroup, rightText, fontSize);

      createLine(yearGroup, {
        id: `year-line-${figure.year}`,
        className: 'year-line',
        x1: leftTextLength + padding,
        x2: width - rightTextLength - padding,
        y1: y,
        y2: y,
        opacity: opacity.line.enabled,
        transform: '',
      });

      yearGroup
        .append('text')
        .attr('class', `year year-text year-${figure.year} year-main-text`)
        .attr('x', 0)
        .attr('y', y + textOffset)
        .attr('text-anchor', 'start')
        .attr('font-size', `${fontSizeYear}px`)
        .text(leftText);

      yearGroup
        .append('text')
        .attr('class', `year year-text year-${figure.year} year-main-text`)
        .attr('x', width)
        .attr('y', y + textOffset)
        .attr('text-anchor', 'end')
        .attr('font-size', `${fontSize}px`)
        .text(rightText);

      if (leftSubText) {
        const cats =
          event?.categories
            .map((c) => categories.value.find((cat) => cat.id === c))
            .filter(Boolean) ?? [];

        const circleSize = 10;
        const padding = 4;

        const subCubeOffset = cats.length > 0 ? cats.length * (circleSize + padding) + 1 : 0;

        cats.forEach((cat, i) => {
          yearGroup
            .append('circle')
            .attr('cx', 6 + i * (circleSize + padding))
            .attr('cy', 6 + y + subTextOffset - circleSize)
            .attr('r', circleSize / 2)
            .attr('fill', cat?.color ?? 'black')
            .append('title')
            .text(cat?.name ?? '');
        });

        yearGroup
          .append('text')
          .attr('class', `year year-text year-${figure.year} year-sub-text`)
          .attr('x', subCubeOffset)
          .attr('y', y + subTextOffset)
          .attr('text-anchor', 'start')
          .attr('font-size', `${fontSize}px`)
          .text(leftSubText);
      }

      yearGroup
        .append('text')
        .attr('class', `year year-text year-${figure.year} year-sub-text`)
        .attr('x', width)
        .attr('y', y + subTextOffset)
        .attr('text-anchor', 'end')
        .attr('font-size', `${fontSize}px`)
        .text(rightSubText);
    }
  };

  const drawCategoryLines = (g: d3GSelection) => {
    const line = d3
      .line<{ y: number; x: number }>()
      .y((d) => d.y)
      .x((d) => d.x)
      .curve(d3.curveLinear);

    g.selectAll('.category-line')
      .data(series.value)
      .join('path')
      .attr('class', 'category-line')
      .attr('d', (d) => line(d.areaPoints.map((p) => ({ y: p.y, x: (p.x0 + p.x1) / 2 }))))
      .attr('fill', 'none')
      .attr('stroke', (_) => 'white')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.1);

    series.value.forEach((serie) => {
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
