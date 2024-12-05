import * as d3 from 'd3';
import type { d3GSelection } from '~/types';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

export function useChartDrawAreas() {
  const { opacity, palette } = useChartConfig();

  const interactionStore = useInteractionStore();
  const { setTooltipCategory, updateMousePosition } = interactionStore;

  const figureStore = useFigureStore();
  const { selectedArea } = storeToRefs(figureStore);
  const { getSeries, selectArea } = figureStore;

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

    if (!isOverlay) {
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
        .attr('opacity', (d) =>
          selectedArea.value === d.id || !selectedArea.value ? 1 : opacity.area.disabled
        );

      g.selectAll('.category-area-overlay')
        .data(series)
        .join('path')
        .attr('class', 'category-area-overlay')
        .attr('fill', 'url(#noise-pattern)')
        .attr('id', (d) => `category-area-${d.id}-overlay`)
        .attr('d', (d) => area(d.areaPoints))
        .attr('opacity', 0.25);
    } else {
      g.selectAll('.category-area-interaction')
        .data(series)
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
          setTooltipCategory({
            id: d.id,
            name: d.id,
          });

          if (selectedArea.value) return;

          const ids = AD_CATEGORIES.filter((cat) => cat !== d.id);
          const areas = ids.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', opacity.area.muted));
        })
        .on('mousemove', (event) => {
          updateMousePosition(event);
        })
        .on('mouseout', function () {
          setTooltipCategory(null);

          if (selectedArea.value) return;

          const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 1));
        });
    }
  };

  return {
    drawCategoryAreas,
  };
}
