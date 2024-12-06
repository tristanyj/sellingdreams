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

    const fontSize = 15;
    const legendGroup = g.append('g').attr('class', 'legend-group');
    const totalItems = firstOfEach.length;
    const maxOffset = 50;

    firstOfEach.forEach((serie, index) => {
      const category = categories.value.find((c) => c.id === serie.id);
      if (!category) return;

      const x = (serie.point.x0 + serie.point.x1) / 2;
      const y2Mid = serie.point.y - 20;
      const y2 = serie.point.y - 30;

      // Calculate offsets
      const offsetFactor = (index / (totalItems - 0)) * 2 - 1;
      const offset = offsetFactor * maxOffset;

      const x2 = index === 0 ? x : x + offset;

      createLine(legendGroup, {
        className: 'legend-line',
        x1: x,
        x2: x2,
        y1: serie.point.y,
        y2: index === 0 ? y2 : y2Mid,
        opacity: opacity.line.legend,
        transform: '',
      });

      if (index) {
        createLine(legendGroup, {
          className: 'legend-line',
          x1: x2,
          x2: x2,
          y1: y2Mid,
          y2: y2,
          opacity: opacity.line.legend,
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

  const drawAreaLegend = (g: d3GSelection) => {
    const misc = series.value.find((s) => s.id === 'miscellaneous')?.areaPoints.slice(1, 3);

    if (!misc) return;

    console.log('misc', misc);

    const x0Mid = (misc[0].x0 + misc[1].x0) / 2;
    const x1Mid = (misc[0].x1 + misc[1].x1) / 2;
    const x01Mid = (x0Mid + x1Mid) / 2;

    const x0 = (x0Mid + x01Mid) / 2;
    const y0 = (misc[0].y + misc[1].y) / 2;

    const x1 = 400;
    const y1 = 150;

    createLine(g, {
      className: 'legend-line',
      x1: x0,
      x2: x1,
      y1: y0,
      y2: y1,
      opacity: opacity.line.legend,
      transform: '',
    });

    createLine(g, {
      className: 'legend-line',
      x1: x1,
      x2: x1,
      y1: y1,
      y2: y1 - 50,
      opacity: opacity.line.legend,
      transform: '',
    });
  };

  return {
    drawCategoryLegend,
    drawAreaLegend,
  };
}
