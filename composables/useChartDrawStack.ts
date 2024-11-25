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

    const spacing = 5; // Adjust this value to control space between categories
    const totalSpacing = (categories.length - 1) * spacing;

    // 1. Create slices for each year
    const slices = new Map<
      number,
      {
        year: number;
        total: number;
        x: number;
        values: Map<
          string,
          {
            serieId: string;
            value: number;
            position: number;
            height: number;
            beforeHeight: number;
          }
        >;
      }
    >();

    // Initialize slices
    figures.forEach((yearData) => {
      const slice = {
        year: yearData.year,
        total: 0,
        x: 0,
        values: new Map(),
      };

      // Calculate total and store category values
      categories.forEach((cat) => {
        const value = yearData.categories[cat].proportion_of_ads;
        slice.total += value;
        slice.values.set(cat, {
          serieId: cat,
          value,
          position: 0,
          height: 0,
          beforeHeight: 0,
        });
      });

      slices.set(yearData.year, slice);
    });

    // 2. Setup scales
    const xScale = d3
      .scalePoint()
      .domain(figures.map((f) => f.year))
      .range([margin.left, width - margin.right]);

    const heightScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, height - margin.bottom - margin.top - totalSpacing]); // Subtract total spacing

    // Calculate padding for smooth transitions
    const xStep = xScale.step();
    const areaPointPadding = xStep * 0.275; // Adjust this value to control curve smoothness

    // 3. Calculate positions within each slice
    slices.forEach((slice) => {
      slice.x = xScale(slice.year)!;

      const sortedValues = Array.from(slice.values.entries()).sort(
        ([, a], [, b]) => b.value - a.value
      );

      let currentHeight = margin.top;
      sortedValues.forEach(([, value], index) => {
        value.height = heightScale(value.value);
        value.beforeHeight = currentHeight;
        // Add spacing after each category except the last one
        currentHeight += value.height + (index < categories.length - 1 ? spacing : 0);
      });
    });
    // 4. Create series data with extra points for smooth transitions
    const series = categories.map((category) => {
      const areaPoints: Array<{ x: number; y0: number; y1: number }> = [];

      figures.forEach((yearData, i) => {
        const slice = slices.get(yearData.year)!;
        const value = slice.values.get(category)!;
        const x = slice.x;
        const y0 = value.beforeHeight;
        const y1 = y0 + value.height;

        // Add extra points for smooth transitions
        if (i > 0) {
          areaPoints.push({ x: x - areaPointPadding, y0, y1 });
        }
        areaPoints.push({ x, y0, y1 });
        if (i < figures.length - 1) {
          areaPoints.push({ x: x + areaPointPadding, y0, y1 });
          // areaPoints.push({ x: x + areaPointPadding * 2, y0, y1 });
        }
      });

      return {
        id: category,
        areaPoints,
      };
    });

    // 5. Create area generator
    const area = d3
      .area<{ x: number; y0: number; y1: number }>()
      .x((d) => d.x)
      .y0((d) => d.y0)
      .y1((d) => d.y1)
      .curve(d3.curveBasis);

    // 6. Draw the areas
    g.selectAll('.area')
      .data(series)
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => area(d.areaPoints))
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5) // Slightly thicker stroke
      .attr('stroke-linejoin', 'round') // Smoother corners
      .attr('opacity', 0.85); // Slightly adjusted opacity

    // 7. Add axis
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d.toString());

    g.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
  };

  return {
    drawStreamGraph: drawAreaBump,
  };
}
