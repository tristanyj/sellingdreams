import * as d3 from 'd3';
import type { d3GSelection } from '~/types';

import { createLine } from './useChartDrawLines';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

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

    const fontSize = 14;
    const legendGroup = g.append('g').attr('class', 'legend-group');
    const totalItems = firstOfEach.length;
    const maxOffset = 30; // Maximum offset for edge items

    firstOfEach.forEach((serie, index) => {
      const category = categories.value.find((c) => c.id === serie.id);
      if (!category) return;

      const x = (serie.point.x0 + serie.point.x1) / 2;
      const y2Mid = serie.point.y - 20;
      const y2 = serie.point.y - 50;

      // Calculate offsets
      const offsetFactor = (index / (totalItems - 1)) * 2 - 1; // Scale between -1 and 1
      const offset = offsetFactor * maxOffset;

      const x2 = index === 0 ? x : x + offset;

      createLine(legendGroup, {
        className: 'legend-line',
        x1: x,
        x2: x2,
        y1: serie.point.y,
        y2: index === 0 ? y2 : y2Mid,
        opacity: opacity.line.enabled,
        transform: '',
      });

      if (index) {
        createLine(legendGroup, {
          className: 'legend-line',
          x1: x2,
          x2: x2,
          y1: y2Mid,
          y2: y2,
          opacity: opacity.line.enabled,
          transform: '',
        });
      }

      legendGroup
        .append('circle')
        .attr('cx', x2)
        .attr('cy', y2 - 8)
        .attr('r', 4)
        .attr('fill', serie.color);

      legendGroup
        .append('text')
        .attr('class', 'legend-text')
        .attr('x', x2)
        .attr('y', y2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .attr('font-size', fontSize)
        .attr('transform', `rotate(300, ${x2 - 17}, ${y2 - 7})`)
        .attr('cursor', 'pointer')
        .text(category.name)
        .on('click', function (event) {
          event.stopPropagation();
          selectArea(selectedArea.value === serie.id ? null : serie.id);
        })
        .on('mouseenter', function () {
          const category = categories.value.find((cat) => cat.id === serie.id);
          if (!category) return;

          setTooltipCategory({
            id: serie.id,
            name: category.name,
            description: category.description,
            color: category.color,
          });

          if (selectedArea.value) return;

          const ids = AD_CATEGORIES.filter((cat) => cat !== serie.id);
          const areas = ids.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', opacity.area.muted));
        })
        // .on('mousemove', (event) => {
        //   updateMousePosition(event);
        // })
        .on('mouseout', function () {
          setTooltipCategory(null);

          if (selectedArea.value) return;

          const areas = AD_CATEGORIES.map((id) => d3.select(`#category-area-${id}`));
          areas.forEach((area) => area.attr('opacity', 1));
        });
    });
  };

  return {
    drawCategoryLegend,
  };
}
