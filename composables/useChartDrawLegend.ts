import * as d3 from 'd3';
import type { d3GSelection } from '~/types';

import { createLine } from './useChartDrawLines';

import { wrapText2 } from '~/assets/scripts/utils';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

export function useChartDrawLegend() {
  const { width, opacity } = useChartConfig();

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
    const misc = series.value.find((s) => s.id === 'miscellaneous')?.areaPoints[2];

    // TODO: refactor this function

    if (!misc) return;

    const x0Mid = misc.x0;
    const x1Mid = misc.x1;
    const yMid = misc.y;
    const x01Mid = (x0Mid + x1Mid) / 2;

    const x0 = (x0Mid + x01Mid) / 2;

    const x1 = x0 - 125;
    const y1 = yMid - 200;

    createLine(g, {
      className: 'legend-line',
      x1: x0Mid,
      x2: x1Mid,
      y1: yMid,
      y2: yMid,
      opacity: opacity.line.legend,
      transform: '',
    });

    createLine(g, {
      className: 'legend-line',
      x1: x0Mid,
      x2: x0Mid,
      y1: yMid - 10,
      y2: yMid + 10,
      strokeWidth: 2,
      opacity: opacity.line.legend,
      transform: '',
    });

    createLine(g, {
      className: 'legend-line',
      x1: x1Mid,
      x2: x1Mid,
      y1: yMid - 10,
      y2: yMid + 10,
      strokeWidth: 2,
      opacity: opacity.line.legend,
      transform: '',
    });

    createLine(g, {
      className: 'legend-line',
      x1: x0,
      x2: x1,
      y1: yMid,
      y2: y1,
      opacity: opacity.line.legend,
      transform: '',
    });

    const lineOffset = 70;

    createLine(g, {
      className: 'legend-line',
      x1: x1,
      x2: x1,
      y1: y1,
      y2: y1 - lineOffset,
      opacity: opacity.line.legend,
      transform: '',
    });

    const p1 = 70;
    const p2 = 90;

    const text = g
      .append('text')
      .attr('x', x1)
      .attr('y', y1 - lineOffset - p1 - p2)
      .attr('font-size', 15)
      .attr('font-family', 'Crimson Pro')
      .attr('class', 'label')
      .attr('stroke-width', 1)
      .text(
        () =>
          `Eight advertising categories are each represented with a column of a certain color. For a given year, the sum width of all columns represents the total amount of money spent on advertising in the US, as a percentage of the GDP.`
      )
      .call(wrapText2, 320);

    const bbox = text.node().getBBox();
    text.attr('transform', `translate(${x1 - bbox.width / 2})`);

    const text2 = g
      .append('text')
      .attr('x', x1)
      .attr('y', y1 - lineOffset - p1)
      .attr('font-size', 15)
      .attr('font-family', 'Crimson Pro')
      .attr('class', 'label')
      .attr('stroke-width', 1)
      .text(
        () =>
          `The width of a column represents, for a given year, the percentage of money spent on this category among advertising categories. Higher percentages are placed on the left, lower percentages on the right.`
      )
      .call(wrapText2, 320);

    const bbox2 = text2.node().getBBox();
    text2.attr('transform', `translate(${x1 - bbox2.width / 2})`);
  };

  const drawFigureLegend = (g: d3GSelection) => {
    const misc = series.value.find((s) => s.id === 'miscellaneous')?.areaPoints[0];
    if (!misc) return;

    const x = width - 8;
    const y = misc.y - 20;
    const y1 = y - 130;
    const y2 = y1 - 32;

    createLine(g, {
      className: 'legend-line',
      x1: width - 8,
      x2: width - 8,
      y1: y,
      y2: y1,
      opacity: opacity.line.legend,
      transform: '',
    });

    createLine(g, {
      className: 'legend-line',
      x1: width - 8,
      x2: width - 24,
      y1: y1,
      y2: y2,
      opacity: opacity.line.legend,
      transform: '',
    });

    const text = g
      .append('text')
      .attr('x', x)
      .attr('y', y2 - 35)
      .attr('class', 'right-text')
      .attr('font-size', 15)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Crimson Pro')
      .text(() => `Total amount of dollars spent on advertising (Not adjusted for inflation)`);

    const text2 = g
      .append('text')
      .attr('class', 'right-sub-text')
      .attr('x', x)
      .attr('y', y2 - 15)
      .attr('font-size', 15)
      .attr('text-anchor', 'end')
      .attr('opacity', 0.5)
      .text(() => `% of Gross Domestic Product (GDP)`);
  };

  return {
    drawCategoryLegend,
    drawAreaLegend,
    drawFigureLegend,
  };
}
