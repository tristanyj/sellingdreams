<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';

const { width, height } = useWindowSize();

const interactionStore = useInteractionStore();
const { mousePosition, isTooltipCategoryVisible, tooltipCategory, tooltipFigure } =
  storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value) return {};

  const paddingX = 25;
  const paddingY = 25;

  const isPastHalfWidth = mousePosition.value.x > width.value * 0.65;
  const isPastHalfHeight = mousePosition.value.y > height.value * 0.65;

  const posX = mousePosition.value.x - tooltipSize.value.width - paddingX;
  const posY =
    isPastHalfWidth && isPastHalfHeight
      ? mousePosition.value.y - tooltipSize.value.height - paddingY
      : mousePosition.value.y + paddingY;

  const clampedPosX = Math.max(
    paddingX,
    Math.min(posX, width.value - tooltipSize.value.width - paddingX)
  );
  const clampedPosY = Math.max(
    paddingY,
    Math.min(posY, height.value - tooltipSize.value.height - paddingY)
  );

  return {
    transform: `translate(${clampedPosX}px, ${clampedPosY}px)`,
    visibility: isTooltipCategoryVisible.value ? 'visible' : 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
  };
});

const tooltipSize = ref({ width: 0, height: 0 });
const tooltip = ref<HTMLElement | null>(null);

watch(
  [tooltipCategory, tooltipFigure, isTooltipCategoryVisible],
  async () => {
    if (!tooltip.value) return;

    await nextTick();

    const rect = tooltip.value.getBoundingClientRect();
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  },
  { immediate: true }
);

useEventListener(window, 'resize', () => {
  if (!tooltip.value || !isTooltipCategoryVisible.value) return;

  const rect = tooltip.value.getBoundingClientRect();
  tooltipSize.value = {
    width: rect.width,
    height: rect.height,
  };
});

onMounted(() => {
  if (!tooltip.value) return;

  const resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  });

  resizeObserver.observe(tooltip.value);

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});
</script>

<template>
  <div
    v-show="isTooltipCategoryVisible"
    ref="tooltip"
    class="fixed stat-tooltip bg-gray-50 border rounded-md z-100 text-sm font-host"
    :style="tooltipStyle"
  >
    <template v-if="tooltipCategory">
      <div class="w-64">
        {{ tooltipCategory.id }}, {{ tooltipCategory.name }},
        {{ tooltipCategory.description }}
      </div>
    </template>
    <template v-if="tooltipFigure">
      <div class="w-64">
        {{ tooltipFigure.nominal }}
      </div>
    </template>
  </div>
</template>
