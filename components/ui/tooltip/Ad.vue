<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';

const { height } = useWindowSize();

const interactionStore = useInteractionStore();
const { mousePosition, isTooltipAdVisible, tooltipAd } = storeToRefs(interactionStore);

interface Props {
  offset: number;
}

const props = defineProps<Props>();

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value) return {};

  const posX = mousePosition.value.x + props.offset;
  const posY = mousePosition.value.y - tooltipSize.value.height / 2;

  const clampedPosY = Math.max(45, Math.min(posY, height.value - tooltipSize.value.height - 35));

  return {
    transform: `translate(${posX}px, ${clampedPosY}px)`,
    visibility: isTooltipAdVisible.value ? 'visible' : 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
  };
});

const tooltipSize = ref({ width: 0, height: 0 });
const tooltip = ref<HTMLElement | null>(null);

watch(
  [tooltipAd, isTooltipAdVisible],
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
  if (!tooltip.value || !isTooltipAdVisible.value) return;

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
    ref="tooltip"
    class="fixed tooltip bg-gray-50 rounded-md z-100 text-sm font-inter p-3 w-72 shadow-md"
    :style="tooltipStyle"
  >
    <template v-if="tooltipAd">
      <div class="grid gap-2">
        <div class="grid gap-0.5 text-center">
          <div class="grid grid-flow-col justify-center text-center items-center gap-2">
            <div class="">{{ tooltipAd.year }}</div>
            <div class="w-1 h-1 rounded-full bg-black" />
            <div class="">{{ tooltipAd.client }}</div>
          </div>
          <div class="grid grid-flow-col justify-center items-center gap-2 text-lg leading-tight">
            <div class="font-semibold px-2">{{ tooltipAd.name }}</div>
          </div>
        </div>
        <div>
          <NuxtImg
            v-if="tooltipAd.id"
            :src="`ads/${tooltipAd.id}-preview.webp`"
            class="w-full min-h-48 object-contain rounded-sm"
            :alt="tooltipAd.id"
          />
        </div>
        <div
          v-if="tooltipAd.agency"
          class="text-gray-600 text-center text-xs pt-px"
        >
          Agency : {{ tooltipAd.agency }}
        </div>
      </div>
    </template>
  </div>
</template>
