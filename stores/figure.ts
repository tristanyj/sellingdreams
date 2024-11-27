import type { Figure } from '~/types';

export const useFigureStore = defineStore('figure', () => {
  const figures = ref<Figure[]>([]);
  const isLoaded = ref<boolean>(false);

  const setFigures = (newFigures: Figure[]) => {
    figures.value = [...newFigures].filter((f) => f.year >= 1908 && f.year <= 2007);
    isLoaded.value = true;
  };

  return {
    figures,
    isLoaded,
    setFigures,
  };
});
