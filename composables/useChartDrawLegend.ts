import * as d3 from 'd3';
import type { d3GSelection } from '~/types';

import { wrapText2 } from '~/assets/scripts/utils';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

import { createLine } from './useChartDrawLines';

export function useChartDrawLegend() {
  const { width, opacity } = useChartConfig();

  const interactionStore = useInteractionStore();
  const { figureMode } = storeToRefs(interactionStore);
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

    const fontSize = 16;
    const legendGroup = g.append('g').attr('class', 'legend-group');
    const totalItems = firstOfEach.length;
    const maxOffset = 50;

    firstOfEach.forEach((serie, index) => {
      const category = categories.value.find((c) => c.id === serie.id);
      if (!category) return;

      const offsetFactor = (index / (totalItems - 0)) * 2 - 1;
      const offset = offsetFactor * maxOffset;

      const x1 = (serie.point.x0 + serie.point.x1) / 2;
      const x2 = index === 0 ? x1 : x1 + offset;

      const y2Mid = serie.point.y - 20;
      const y2 = serie.point.y - 30;

      createLine(legendGroup, {
        className: 'legend-line',
        x1: x1,
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
    if (!misc) return;

    const fontSize = 16;
    const lineOffset = 40;

    const miscMid = (misc.x0 + (misc.x0 + misc.x1) / 2) / 2;

    const x1 = miscMid - 120;
    const y1 = misc.y - 190;

    const lines = [
      {
        x1: misc.x0,
        x2: misc.x1,
        y1: misc.y,
        y2: misc.y,
      },
      {
        x1: misc.x0,
        x2: misc.x0,
        y1: misc.y - 10,
        y2: misc.y + 10,
      },
      {
        x1: misc.x1,
        x2: misc.x1,
        y1: misc.y - 10,
        y2: misc.y + 10,
      },
      {
        x1: miscMid,
        x2: x1,
        y1: misc.y,
        y2: y1,
      },
      {
        x1: x1,
        x2: x1,
        y1: y1,
        y2: y1 - lineOffset,
      },
    ];

    lines.forEach((line) => {
      createLine(g, {
        className: 'legend-line',
        x1: line.x1,
        x2: line.x2,
        y1: line.y1,
        y2: line.y2,
        opacity: opacity.line.legend,
        transform: '',
      });
    });

    const p1 = 70;
    const p2 = 94;

    const text = g
      .append('text')
      .attr('x', x1)
      .attr('y', y1 - lineOffset - p1 - p2)
      .attr('font-size', fontSize)
      .attr('font-family', 'Crimson Pro')
      .attr('class', 'label')
      .attr('stroke-width', 1)
      .text(
        () =>
          `Eight advertising categories are each represented with a column of a certain color. For a given year, the sum width of all columns represents the total amount of money spent on advertising in the US, as a percentage of the GDP.`
      )
      .call(wrapText2, 340);

    const bbox = text.node().getBBox();
    text.attr('transform', `translate(${x1 - bbox.width / 2})`);

    const text2 = g
      .append('text')
      .attr('x', x1)
      .attr('y', y1 - lineOffset - p1)
      .attr('font-size', fontSize)
      .attr('font-family', 'Crimson Pro')
      .attr('class', 'label')
      .attr('stroke-width', 1)
      .text(
        () =>
          `The width of a column represents, for a given year, the percentage of money spent on this category among advertising categories. Higher percentages are placed on the left, lower percentages on the right.`
      )
      .call(wrapText2, 340);

    const bbox2 = text2.node().getBBox();
    text2.attr('transform', `translate(${x1 - bbox2.width / 2})`);
  };

  const drawFigureLegend = (g: d3GSelection) => {
    const misc = series.value.find((s) => s.id === 'miscellaneous')?.areaPoints[0];
    if (!misc) return;

    const x = width - 8;
    const y = misc.y - 20;
    const y1 = y - 120;
    const y2 = y1 - 32;

    const fontSize = 16;

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
      .attr('font-size', fontSize)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Crimson Pro')
      .text(
        () =>
          `Total amount of dollars spent on advertising (${
            figureMode.value === 'nominal' ? 'Not adjusted' : 'Adjusted'
          } for inflation)`
      );

    const text2 = g
      .append('text')
      .attr('class', 'right-sub-text')
      .attr('x', x)
      .attr('y', y2 - 15)
      .attr('font-size', fontSize)
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
