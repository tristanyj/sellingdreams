import * as d3 from 'd3';
import type { d3GSelection } from '~/types';
import { AD_CATEGORIES } from '~/assets/scripts/constants';

export function useChartDrawAreas() {
  const { width, margin, palette, spacing } = useChartConfig();

  const figureStore = useFigureStore();
  const { figures, figureSlices } = storeToRefs(figureStore);

  const drawCategoryAreas = (
    g: d3GSelection,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScalePoint<string>
  ) => {
    figureSlices.value.forEach((slice, year) => {
      slice.y = yScale(slice.year.toString())!;

      const yearFigure = figures.value.find((f) => f.year === year)!;
      const totalWidth = xScale(yearFigure.total.proportion_of_gdp);

      const remainingSpace = width - totalWidth - margin.left - margin.right;
      let currentWidth = margin.left + remainingSpace / 2;

      const sortedCategories = Array.from(slice.values.entries()).sort(
        ([, a], [, b]) => b.value - a.value
      );

      sortedCategories.forEach(([_, value]) => {
        value.width = totalWidth * value.value;
        value.beforeWidth = currentWidth;
        currentWidth += value.width + spacing;
      });
    });

    const series = AD_CATEGORIES.map((category) => ({
      id: category,
      areaPoints: figures.value.map((yearData) => {
        const slice = figureSlices.value.get(yearData.year)!;
        const value = slice.values.get(category)!;
        const x0 = value.beforeWidth;
        const x1 = x0 + value.width;
        return { y: slice.y, x0, x1 };
      }),
    }));

    const area = d3
      .area<{ y: number; x0: number; x1: number }>()
      .y((d) => d.y)
      .x0((d) => d.x0)
      .x1((d) => d.x1)
      .curve(d3.curveBasis);

    g.selectAll('.category-area')
      .data(series.reverse())
      .join('path')
      .attr('class', 'category-area')
      .attr('id', (d) => `category-area-${d.id}`)
      .attr('d', (d) => area(d.areaPoints))
      .attr('fill', (_, i) => palette[i])
      .attr('stroke', (_, i) => palette[i])
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.9);
  };

  return {
    drawCategoryAreas,
  };
}
