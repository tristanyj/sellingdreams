import * as d3 from 'd3';
import type { d3GSelection } from '~/types';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

export function useChartDrawAreas() {
  const figureStore = useFigureStore();
  const { selectedArea, series } = storeToRefs(figureStore);
  const { selectArea } = figureStore;

  const interactionStore = useInteractionStore();
  const { performanceMode } = storeToRefs(interactionStore);

  const drawCategoryAreas = (g: d3GSelection, isInteraction = false) => {
    const area = d3
      .area<{ y: number; x0: number; x1: number }>()
      .y((d) => d.y)
      .x0((d) => d.x0)
      .x1((d) => d.x1)
      .curve(d3.curveLinear);

    if (!isInteraction) {
      g.selectAll('.category-area')
        .data(series.value)
        .join('path')
        .attr('class', 'category-area')
        .attr('id', (d) => `category-area-${d.id}`)
        .attr('d', (d) => area(d.areaPoints))
        .attr('fill', (d) => d.color)
        .attr('stroke', (d) => d.color)
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .classed('disabled', (d) => selectedArea.value !== d.id && !!selectedArea.value);

      if (performanceMode.value === 'high') {
        g.selectAll('.category-area-overlay')
          .data(series.value)
          .join('path')
          .attr('class', 'category-area-overlay')
          .attr('fill', 'url(#noise-pattern)')
          .attr('id', (d) => `category-area-${d.id}-overlay`)
          .attr('d', (d) => area(d.areaPoints))
          .attr('opacity', 0.25);
      }
    } else {
      g.selectAll('.category-area-interaction')
        .data(series.value)
        .join('path')
        .attr('class', 'category-area-interaction')
        .attr('id', (d) => `category-area-${d.id}-interaction`)
        .attr('d', (d) => area(d.areaPoints))
        .attr('opacity', 0)
        .on('click', function (event, d) {
          event.stopPropagation();
          selectArea(selectedArea.value === d.id ? null : d.id);
        })
        .on('mouseenter', function (_, d) {
          if (selectedArea.value) return;

          const ids = AD_CATEGORIES.filter((cat) => cat !== d.id);
          ids.forEach((id) => d3.select(`#category-area-${id}`).classed('muted', true));
        })
        .on('mouseout', function () {
          if (selectedArea.value) return;

          d3.selectAll(`.category-area`).classed('muted', false);
        });
    }
  };

  return {
    drawCategoryAreas,
  };
}
