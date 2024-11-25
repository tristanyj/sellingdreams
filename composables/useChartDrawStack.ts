import * as d3 from 'd3';
import type { d3GSelection, Figure } from '~/types';

const categories = [
  'internet',
  'radio',
  'yellow_pages',
  'out_of_home',
  'periodicals',
  'direct_mail',
  'miscellaneous',
  'television',
];

const spacing = 10;
const align = 'start';

export function useChartDrawStack() {
  const { width, height, margin } = useChartConfig();

  const drawAreaBump = (g: d3GSelection, figures: Figure[]) => {
    // First compute total values and positions for each slice (year)
    const slices = new Map();
    figures.forEach((year) => {
      const slice = {
        id: year.year,
        total: 0,
        x: 0,
        values: new Map(),
      };

      // Calculate total and store values
      categories.forEach((cat) => {
        const value = year.categories[cat].proportion_of_ads;
        slice.total += value;
        slice.values.set(cat, {
          serieId: cat,
          value,
          position: 0,
          height: 0,
          beforeHeight: 0,
        });
      });
      slices.set(year.year, slice);
    });

    // Setup scales
    const xScale = d3
      .scalePoint()
      .domain(figures.map((f) => f.year))
      .range([margin.left, width - margin.right]);

    const heightScale = d3
      .scaleLinear()
      .domain([0, d3.max(Array.from(slices.values()), (d) => d.total)!])
      .range([0, height - categories.length * spacing]);

    // Calculate positions for each slice
    slices.forEach((slice, x) => {
      slice.x = xScale(x);
      const sliceHeight = heightScale(slice.total) + slice.values.size * spacing;

      // Calculate offset based on alignment
      let offset = 0;
      if (align === 'middle') {
        offset = (height - sliceHeight) / 2;
      } else if (align === 'end') {
        offset = height - sliceHeight;
      }

      // Sort and position values within slice
      Array.from(slice.values.values())
        .sort((a, b) => b.value - a.value)
        .forEach((value, position, all) => {
          const previousValues = all.filter((_, pos) => pos < position);
          const beforeValue = previousValues.reduce((t, v) => t + v.value, 0);

          const sliceValue = slice.values.get(value.serieId)!;
          sliceValue.position = position;
          sliceValue.height = heightScale(value.value);
          sliceValue.beforeHeight =
            heightScale(beforeValue) + offset + spacing * (previousValues.length + 0.5);
        });
    });

    // Calculate area points with padding for smooth transitions
    const areaPointPadding = xScale.step() * Math.min(0.6 * 0.5, 0.5);

    // Create series data
    const series = categories.map((category) => {
      const points = [];
      const areaPoints = [];

      figures.forEach((year, i) => {
        const slice = slices.get(year.year);
        const position = slice.values.get(category);
        const x = slice.x;
        const { beforeHeight, height } = position;

        // Center point
        points.push({
          x,
          y: beforeHeight + height / 2,
          height,
          data: year.categories[category],
        });

        // Area points with padding for smooth transitions
        if (i > 0) {
          areaPoints.push({ x: x - areaPointPadding, y0: beforeHeight, y1: beforeHeight + height });
        }
        areaPoints.push({ x, y0: beforeHeight, y1: beforeHeight + height });
        if (i < figures.length - 1) {
          areaPoints.push({ x: x + areaPointPadding, y0: beforeHeight, y1: beforeHeight + height });
        }
      });

      return { id: category, points, areaPoints };
    });

    // Create area generator
    const area = d3
      .area()
      .x((d) => d.x)
      .y0((d) => d.y0)
      .y1((d) => d.y1)
      .curve(d3.curveBasis);

    // Draw areas
    g.selectAll('.area')
      .data(series)
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => area(d.areaPoints))
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8);
  };

  return {
    drawStreamGraph: drawAreaBump,
  };
}
