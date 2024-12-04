import * as d3 from 'd3';
import type { d3GSelection } from '~/types';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

export function useChartDrawAreas() {
  const { palette } = useChartConfig();

  const figureStore = useFigureStore();
  const { getSeries } = figureStore;

  const drawCategoryAreas = (
    g: d3GSelection,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScalePoint<string>,
    isOverlay = false
  ) => {
    const series = getSeries(xScale, yScale);

    const area = d3
      .area<{ y: number; x0: number; x1: number }>()
      .y((d) => d.y)
      .x0((d) => d.x0)
      .x1((d) => d.x1)
      .curve(d3.curveLinear);

    if (isOverlay) {
      g.selectAll('.category-area-overlay')
        .data(series)
        .join('path')
        .attr('class', 'category-area-overlay')
        .attr('fill', 'url(#noise-pattern)')
        .attr('id', (d) => `category-area-${d.id}-overlay`)
        .attr('d', (d) => area(d.areaPoints))
        .attr('opacity', 0.2)
        .on('mouseover', function (event, d) {
          const ids = AD_CATEGORIES.filter((cat) => cat !== d.id);
          const areas = ids.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 0.75));
        })
        .on('mouseout', function () {
          const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 1));
        });
    } else {
      g.selectAll('.category-area')
        .data(series)
        .join('path')
        .attr('class', 'category-area')
        .attr('id', (d) => `category-area-${d.id}`)
        .attr('d', (d) => area(d.areaPoints))
        .attr('fill', (_, i) => palette[i])
        .attr('stroke', (_, i) => palette[i])
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .attr('opacity', 1);
    }
  };

  return {
    drawCategoryAreas,
  };
}
