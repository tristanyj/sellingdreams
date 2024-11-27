import * as d3 from 'd3';
import type { d3GSelection, Figure } from '~/types';

export function useChartDrawStack() {
  const { width, height, margin } = useChartConfig();

  const drawAreaBump = (g: d3GSelection, figures: Figure[]) => {
    const categories = [
      'radio',
      'television',
      'internet',
      'periodicals',
      'out_of_home',
      'direct_mail',
      'yellow_pages',
      'miscellaneous',
    ];

    const spacing = 12;
    const totalSpacing = (categories.length - 1) * spacing;

    // 1. Create slices (same as before)
    const slices = new Map<
      number,
      {
        year: number;
        total: number;
        y: number; // Changed from x to y
        values: Map<
          string,
          {
            serieId: string;
            value: number;
            position: number;
            width: number; // Changed from height
            beforeWidth: number; // Changed from beforeHeight
          }
        >;
      }
    >();

    // Initialize slices
    figures.forEach((yearData) => {
      const slice = {
        year: yearData.year,
        total: 0,
        y: 0,
        values: new Map(),
      };

      categories.forEach((cat) => {
        const value = yearData.categories[cat].proportion_of_ads;
        slice.total += value;
        slice.values.set(cat, {
          serieId: cat,
          value,
          position: 0,
          width: 0,
          beforeWidth: 0,
        });
      });

      slices.set(yearData.year, slice);
    });

    // 2. Setup scales (swapped)
    const yScale = d3
      .scalePoint()
      .domain(figures.map((f) => f.year))
      .range([margin.top, height - margin.bottom]);

    const widthScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, width - margin.left - margin.right - totalSpacing]);

    // Calculate padding for smooth transitions
    const yStep = yScale.step();
    const areaPointPadding = yStep * 0.3;

    // 3. Calculate positions within each slice
    slices.forEach((slice) => {
      slice.y = yScale(slice.year)!;

      const sortedValues = Array.from(slice.values.entries()).sort(
        ([, a], [, b]) => b.value - a.value
      );

      let currentWidth = margin.left;
      sortedValues.forEach(([, value], index) => {
        value.width = widthScale(value.value);
        value.beforeWidth = currentWidth;
        currentWidth += value.width + (index < categories.length - 1 ? spacing : 0);
      });
    });

    // 4. Create series data with extra points
    const series = categories.map((category) => {
      const areaPoints: Array<{ y: number; x0: number; x1: number }> = [];

      figures.forEach((yearData, i) => {
        const slice = slices.get(yearData.year)!;
        const value = slice.values.get(category)!;
        const y = slice.y;
        const x0 = value.beforeWidth;
        const x1 = x0 + value.width;

        if (i > 0) {
          areaPoints.push({ y: y - areaPointPadding, x0, x1 });
        }
        areaPoints.push({ y, x0, x1 });
        if (i < figures.length - 1) {
          areaPoints.push({ y: y + areaPointPadding, x0, x1 });
        }
      });

      return {
        id: category,
        areaPoints,
      };
    });

    // 5. Create area generator (swapped x and y)
    const area = d3
      .area<{ y: number; x0: number; x1: number }>()
      .y((d) => d.y)
      .x0((d) => d.x0)
      .x1((d) => d.x1)
      .curve(d3.curveBasis);

    // 6. Draw the areas
    g.selectAll('.area')
      .data(series)
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => area(d.areaPoints))
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .attr('stroke', (d, i) => d3.schemeCategory10[i])
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.85);

    // 7. Add axis (now on the left)
    // const yAxis = d3.axisLeft(yScale).tickFormat((d) => d.toString());
  };

  return {
    drawStreamGraph: drawAreaBump,
  };
}
