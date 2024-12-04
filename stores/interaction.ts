import type { TooltipArea, TooltipPoint, Ad } from '~/types';

export const useInteractionStore = defineStore('interaction', () => {
  // --------------------------------
  // State
  // --------------------------------

  const mousePosition = ref({ x: 0, y: 0 });

  const tooltipArea = ref<TooltipArea | null>(null);
  const tooltipPoint = ref<TooltipPoint | null>(null);

  const selectedAd = ref<Ad | null>(null);

  // --------------------------------
  // Computed
  // --------------------------------

  const isTooltipVisible = computed(() => !!tooltipArea.value || !!tooltipPoint.value);

  // --------------------------------
  // Methods
  // --------------------------------

  const updateMousePosition = (event: MouseEvent) => {
    mousePosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  };
  const setTooltipArea = (data: TooltipArea | null) => {
    tooltipArea.value = data;
  };

  const setTooltipPoint = (data: TooltipPoint | null) => {
    tooltipPoint.value = data;
  };

  const setSelectedAd = (ad: Ad | null) => {
    selectedAd.value = ad;
  };

  return {
    mousePosition,
    tooltipArea,
    tooltipPoint,
    isTooltipVisible,
    selectedAd,
    updateMousePosition,
    setTooltipArea,
    setTooltipPoint,
    setSelectedAd,
  };
});
