import type { Figure } from '~/types';

export const useFigureStore = defineStore('figure', () => {
  const figures = ref<Figure[]>([]);

  const setFigures = (newFigures: Figure[]) => {
    figures.value = newFigures;
  };

  return {
    figures,
    setFigures,
  };
});
