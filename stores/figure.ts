import type { Figure } from '~/types';

export const useFigureStore = defineStore('figure', () => {
  const figures = ref<Figure[]>([]);
  const isLoaded = ref<boolean>(false);

  const setFigures = (newFigures: Figure[]) => {
    figures.value = newFigures;
    isLoaded.value = true;
  };

  return {
    figures,
    isLoaded,
    setFigures,
  };
});
