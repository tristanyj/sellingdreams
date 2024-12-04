import * as d3 from 'd3';
import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { d3GSelection } from '~/types';

export function useChartDrawPoints() {
  // const { width, margin } = useChartConfig();

  const figureStore = useFigureStore();
  const { getSeries } = figureStore;

  const drawAreaPoints = (
    g: d3GSelection,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScalePoint<string>
  ) => {
    const series = getSeries(xScale, yScale);

    series.forEach((serie) => {
      g.selectAll(`.point point-${serie.id}`)
        .data(serie.areaPoints)
        .join('circle')
        .attr('class', `point point-${serie.id}`)
        .attr('id', (d) => `point-${serie.id}-${d.year}`)
        .attr('cx', (d) => (d.x0 + d.x1) / 2)
        .attr('cy', (d) => d.y)
        .attr('r', 3)
        .attr('fill', 'black')
        .attr('stroke', 'white');
    });

    series.forEach((serie) => {
      g.selectAll(`.point-overlay point-${serie.id}-overlay`)
        .data(serie.areaPoints)
        .join('circle')
        .attr('class', `point-overlay point-${serie.id}-overlay`)
        .attr('id', (d) => `point-${serie.id}-${d.year}-overlay`)
        .attr('cx', (d) => (d.x0 + d.x1) / 2)
        .attr('cy', (d) => d.y)
        .attr('r', 12)
        .attr('opacity', 0)
        .on('mouseover', function (_, d) {
          const points = d3.selectAll(`.point`);
          points.attr('opacity', 0.25);
          d3.select(`#point-${serie.id}-${d.year}`).attr('r', 6).attr('opacity', 1);

          const ids = AD_CATEGORIES.filter((cat) => cat !== serie.id);
          const areas = ids.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 0.75));
        })
        .on('mouseout', function (_, d) {
          const points = d3.selectAll(`.point`);
          points.attr('opacity', 1);
          d3.select(`#point-${serie.id}-${d.year}`).attr('r', 3);

          const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 1));
        });
    });
  };

  return {
    drawAreaPoints,
  };
}
