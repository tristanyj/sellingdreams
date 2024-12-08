<script setup lang="ts">
const interactionStore = useInteractionStore();
const { performanceMode } = storeToRefs(interactionStore);
const { setPerformanceMode } = interactionStore;

interface Props {
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const lowPerformance = computed({
  get: () => performanceMode.value === 'low',
  set: (value) => {
    setPerformanceMode(value ? 'low' : 'high');
  },
});
</script>

<template>
  <div
    class="flex cursor-pointer"
    @click.prevent="lowPerformance = !lowPerformance"
  >
    <div
      class="grid grid-flow-col items-center"
      :class="{
        'gap-0.5 text-xs': size === 'sm',
        'gap-1 text-sm': size === 'md',
      }"
    >
      <div>Performance mode</div>
      <UToggle
        :model-value="lowPerformance"
        :size="size"
      />
    </div>
  </div>
</template>
