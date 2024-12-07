import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { CategoryKey, Figure, FigureSlice, FigureSliceCategory } from '~/types';

export const useFigureStore = defineStore('figure', () => {
  const { width, margin, spacing } = useChartConfig();

  const dataStore = useDataStore();
  const { categories } = storeToRefs(dataStore);

  const figures = ref<Figure[]>([]);
  const isLoaded = ref<boolean>(false);
  const selectedArea = ref<CategoryKey | null>(null);
  const series = ref<
    {
      id: CategoryKey;
      color: `#${string}`;
      areaPoints: {
        y: number;
        x0: number;
        x1: number;
        year: number;
      }[];
    }[]
  >([]);

  const setFigures = (newFigures: Figure[]) => {
    figures.value = [...newFigures].filter((f) => f.year >= 1910 && f.year <= 2007);
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

  const calcSeries = (xScale: d3.ScaleLinear<number, number>, yScale: d3.ScalePoint<string>) => {
    figureSlices.value.forEach((slice, year) => {
      slice.y = yScale(slice.year.toString())!;

      const yearFigure = figures.value.find((f) => f.year === year)!;
      const totalWidth = xScale(yearFigure.total.proportion_of_gdp);

      const remainingSpace = width - totalWidth - margin.x;
      let currentWidth = margin.x / 2 + remainingSpace / 2 + margin.offset;

      const sortedCategories = Array.from(slice.values.entries()).sort(
        ([, a], [, b]) => b.value - a.value
      );

      sortedCategories.forEach(([_, value]) => {
        value.width = totalWidth * value.value;
        value.beforeWidth = currentWidth;
        currentWidth += value.width + spacing;
      });
    });

    series.value = AD_CATEGORIES.map((category) => {
      const cat = categories.value.find((c) => c.id === category);
      if (!cat) return null;

      return {
        id: category,
        color: cat.color,
        areaPoints: figures.value.map((yearData) => {
          const slice = figureSlices.value.get(yearData.year)!;
          const value = slice.values.get(category)!;
          const x0 = value.beforeWidth;
          const x1 = x0 + value.width;
          return { y: slice.y, x0, x1, year: slice.year };
        }),
      };
    }).filter((s) => s !== null);
  };

  const selectArea = (areaId: CategoryKey | null) => {
    selectedArea.value = areaId;
    console.log('selectedArea', areaId);
  };

  return {
    figures,
    series,
    figureSlices,
    maxGDPProportion,
    isLoaded,
    selectedArea,
    setFigures,
    calcSeries,
    selectArea,
  };
});
