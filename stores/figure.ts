import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { Figure, FigureSlice, FigureSliceCategory } from '~/types';

export const useFigureStore = defineStore('figure', () => {
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

  return {
    figures,
    figureSlices,
    maxGDPProportion,
    isLoaded,
    setFigures,
  };
});
