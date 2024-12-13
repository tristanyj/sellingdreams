<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';
import { formatNumber } from '~/assets/scripts/utils';

const { height } = useWindowSize();

interface Props {
  offset: number;
}

const props = defineProps<Props>();

const interactionStore = useInteractionStore();
const { updateMousePosition } = interactionStore;
const { mousePosition, isTooltipCategoryVisible, tooltipCategory, tooltipFigure, figureMode } =
  storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value) return {};

  const isCenter = tooltipCategory.value?.center ? true : false;

  const offsetX = isCenter ? 0 : tooltipSize.value.width;

  const posX = mousePosition.value.x - offsetX - props.offset - 30;
  const posY = mousePosition.value.y - tooltipSize.value.height / 2;

  const clampedPosY = Math.max(45, Math.min(posY, height.value - tooltipSize.value.height - 35));

  return {
    transform: `translate(${posX}px, ${clampedPosY}px)`,
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

useEventListener(window, 'mousemove', (event) => {
  updateMousePosition(event);
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
    class="fixed tooltip bg-gray-50 rounded-md z-100 text-sm font-inter p-3 w-56 shadow-md"
    :style="tooltipStyle"
  >
    <template v-if="tooltipCategory">
      <div
        class="grid gap-1"
        :class="{ 'mb-3': tooltipFigure }"
      >
        <div class="grid grid-flow-col gap-1 justify-start items-center">
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: tooltipCategory.color }"
          />
          <div class="font-medium">{{ tooltipCategory.name }}</div>
        </div>
        <p class="">{{ tooltipCategory.description }}</p>
      </div>
    </template>
    <template v-if="tooltipFigure">
      <div class="grid gap-0.5 pt-3 border-t">
        <div class="">
          <span class="font-semibold text-lg leading-tight">{{ tooltipFigure.year }}</span>
        </div>
        <div class="">
          <span class="underline">Expenditure</span> : ${{
            formatNumber(tooltipFigure[figureMode])
          }}
        </div>
        <div class="">
          <span class="underline">% of ads</span> :
          {{ (tooltipFigure.proportion_of_ads * 100).toFixed(2) }}%
        </div>
      </div>
    </template>
  </div>
</template>
