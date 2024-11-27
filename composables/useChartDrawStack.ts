import * as d3 from 'd3';
import type { d3GSelection, Figure, Line, CategoryKey } from '~/types';

const createLine = (g: d3GSelection, params: Line, color: string) => {
  g.append('line')
    .attr('class', params.className)
    .attr('x1', params.x1)
    .attr('y1', params.y1)
    .attr('x2', params.x2)
    .attr('y2', params.y2)
    .attr('stroke', params.stroke ?? color)
    .attr('opacity', params.opacity ?? 1)
    .attr('stroke-width', params.strokeWidth ?? 1)
    .attr('transform', params.transform);
};

type SliceValue = {
  serieId: string;
  value: number;
  position: number;
  width: number;
  beforeWidth: number;
};

type Slice = {
  year: number;
  total: number;
  y: number;
  values: Map<string, SliceValue>;
};

const categories: CategoryKey[] = [
  'radio',
  'television',
  'internet',
  'periodicals',
  'out_of_home',
  'direct_mail',
  'yellow_pages',
  'miscellaneous',
];

const palette = [
  '#03071e',
  '#0a9396',
  '#94d2bd',
  '#e9d8a6',
  '#ee9b00',
  '#ca6702',
  '#bb3e03',
  '#ae2012',
];

export function useChartDrawStack() {
  const { width, height, margin } = useChartConfig();

  const drawAreaBump = (g: d3GSelection, figures: Figure[]) => {
    const spacing = 5;
    const totalSpacing = (categories.length - 1) * spacing;

    // 1. Create slices
    const slices = new Map<number, Slice>();

    figures.forEach((yearData) => {
      const slice: Slice = {
        year: yearData.year,
        total: 0,
        y: 0,
        values: new Map<string, SliceValue>(),
      };

      categories.forEach((cat) => {
        const categoryData = yearData.categories[cat];
        if (categoryData) {
          const value = categoryData.proportion_of_ads;
          slice.total += value;
          slice.values.set(cat, {
            serieId: cat,
            value,
            position: 0,
            width: 0,
            beforeWidth: 0,
          });
        }
      });

      slices.set(yearData.year, slice);
    });

    // 2. Setup scales
    const yScale = d3
      .scalePoint()
      .domain(figures.map((f) => f.year.toString()))
      .range([margin.top, height - margin.bottom]);

    const maxGDPProportion = d3.max(figures, (f) => f.total.proportion_of_gdp)!;
    const widthScale = d3
      .scaleLinear()
      .domain([0, maxGDPProportion])
      .range([0, width - margin.left - margin.right - totalSpacing]);

    // 3. Calculate positions within each slice
    slices.forEach((slice, year) => {
      slice.y = yScale(slice.year.toString())!;

      const yearFigure = figures.find((f) => f.year === year)!;
      const totalWidth = widthScale(yearFigure.total.proportion_of_gdp);

      // Calculate initial start position for centering
      let currentWidth = (width - totalWidth) / 2 + margin.left;

      // Sort categories by value for proper ranking
      const sortedCategories = Array.from(slice.values.entries()).sort(
        ([, a], [, b]) => b.value - a.value
      );

      sortedCategories.forEach(([_, value]) => {
        value.width = totalWidth * value.value; // Scale by proportion of total ads
        value.beforeWidth = currentWidth;
        currentWidth += value.width + spacing;
      });
    });

    // const yStep = yScale.step();
    // const areaPointPadding = yStep * 0.15;

    // 4. Create series data with extra points
    const series = categories.map((category) => {
      const areaPoints: Array<{ y: number; x0: number; x1: number }> = [];

      figures.forEach((yearData, i) => {
        const slice = slices.get(yearData.year)!;
        const value = slice.values.get(category)!;
        const y = slice.y;
        const x0 = value.beforeWidth;
        const x1 = x0 + value.width;

        areaPoints.push({ y, x0, x1 });

        // if (i > 0) {
        //   areaPoints.push({ y: y - areaPointPadding, x0, x1 });
        // }
        // areaPoints.push({ y, x0, x1 });
        // if (i < figures.length - 1) {
        //   areaPoints.push({ y: y + areaPointPadding, x0, x1 });
        // }
      });

      return {
        id: category,
        areaPoints,
      };
    });

    // 5. Create area generator
    const area = d3
      .area<{ y: number; x0: number; x1: number }>()
      .y((d) => d.y)
      .x0((d) => d.x0)
      .x1((d) => d.x1)
      .curve(d3.curveBasis);

    // 6. Draw the areas
    g.selectAll('.area')
      .data(series.reverse())
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => area(d.areaPoints))
      .attr('fill', (d, i) => palette[i])
      .attr('stroke', (d, i) => palette[i])
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.9);
  };

  const drawYearLegend = (g: d3GSelection, figures: Figure[]) => {
    const yScale = d3
      .scalePoint()
      .domain(figures.map((f) => f.year.toString()))
      .range([margin.top, height - margin.bottom]);

    const linesGroup = g.append('g').attr('class', 'year-lines');

    for (const figure of figures) {
      const y = yScale(figure.year.toString()) ?? 0;

      createLine(
        linesGroup,
        {
          className: 'year-line',
          x1: 67,
          x2: width,
          y1: y,
          y2: y,
          opacity: 0.15,
          transform: '',
        },
        '#000'
      );

      createLine(
        linesGroup,
        {
          className: 'year-line',
          x1: 0,
          x2: 25,
          y1: y,
          y2: y,
          opacity: 0.15,
          transform: '',
        },
        '#000'
      );

      linesGroup
        .append('text')
        .attr('class', 'year-label')
        .attr('x', 30)
        .attr('y', y + 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '13px')
        .text(figure.year);
    }
  };

  return {
    drawStreamGraph: drawAreaBump,
    drawYearLegend,
  };
}
