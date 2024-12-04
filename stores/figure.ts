import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { Figure, FigureSlice, FigureSliceCategory } from '~/types';

export const useFigureStore = defineStore('figure', () => {
  const { width, margin, spacing } = useChartConfig();

  const figures = ref<Figure[]>([]);
  const isLoaded = ref<boolean>(false);

  const setFigures = (newFigures: Figure[]) => {
    figures.value = [...newFigures].filter((f) => f.year >= 1908 && f.year <= 2007);
    isLoaded.value = true;
  };

  const figureSlices = computed(() => {
    const slices = new Map<number, FigureSlice>();

    figures.value.forEach((yearData) => {
      const slice: FigureSlice = {
        year: yearData.year,
        total: 0,
        y: 0,
        values: new Map<string, FigureSliceCategory>(),
      };

      AD_CATEGORIES.forEach((cat) => {
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

    return slices;
  });

  const maxGDPProportion = computed(() => {
    return Math.max(...figures.value.map((f) => f.total.proportion_of_gdp));
  });

  const getSeries = (xScale: d3.ScaleLinear<number, number>, yScale: d3.ScalePoint<string>) => {
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
        return { y: slice.y, x0, x1, year: slice.year };
      }),
    }));

    return series;
  };

  return {
    figures,
    figureSlices,
    maxGDPProportion,
    isLoaded,
    setFigures,
    getSeries,
  };
});
