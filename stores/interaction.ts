import type { TooltipCategory, TooltipFigure, TooltipAd, Ad } from '~/types';

export const useInteractionStore = defineStore('interaction', () => {
  // --------------------------------
  // State
  // --------------------------------

  const mousePosition = ref({ x: 0, y: 0 });

  const tooltipCategory = ref<TooltipCategory | null>(null);
  const tooltipFigure = ref<TooltipFigure | null>(null);
  const tooltipAd = ref<TooltipAd | null>(null);

  const selectedAd = ref<Ad | null>(null);

  const figureMode = ref<'nominal' | 'real'>('nominal');
  const performanceMode = ref<'low' | 'high'>('high');

  // --------------------------------
  // Computed
  // --------------------------------

  const isTooltipCategoryVisible = computed(() => !!tooltipCategory.value || !!tooltipFigure.value);
  const isTooltipAdVisible = computed(() => !!tooltipAd.value);

  // --------------------------------
  // Methods
  // --------------------------------

  const updateMousePosition = (event: MouseEvent) => {
    mousePosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const updateMousePositionFromHook = (x: number, y: number) => {
    mousePosition.value = {
      x,
      y,
    };
  };

  const setTooltipCategory = (data: TooltipCategory | null) => {
    tooltipCategory.value = data;
  };

  const setTooltipFigure = (data: TooltipFigure | null) => {
    tooltipFigure.value = data;
  };

  const setTooltipAd = (data: TooltipAd | null) => {
    tooltipAd.value = data;
  };

  const setSelectedAd = (ad: Ad | null) => {
    selectedAd.value = ad;
  };

  const setFigureMode = (mode: 'nominal' | 'real') => {
    figureMode.value = mode;
  };

  const setPerformanceMode = (mode: 'low' | 'high') => {
    performanceMode.value = mode;
  };

  return {
    mousePosition,
    tooltipCategory,
    tooltipFigure,
    tooltipAd,
    isTooltipCategoryVisible,
    isTooltipAdVisible,
    selectedAd,
    figureMode,
    performanceMode,
    setFigureMode,
    setPerformanceMode,
    updateMousePosition,
    updateMousePositionFromHook,
    setTooltipCategory,
    setTooltipFigure,
    setTooltipAd,
    setSelectedAd,
  };
});
