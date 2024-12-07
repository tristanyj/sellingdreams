<script setup lang="ts">
const interactionStore = useInteractionStore();
const { figureMode } = storeToRefs(interactionStore);
const { setFigureMode } = interactionStore;

interface Props {
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const adjustedForInflation = computed({
  get: () => figureMode.value === 'real',
  set: (value) => {
    setFigureMode(value ? 'real' : 'nominal');
  },
});
</script>

<template>
  <div
    class="flex cursor-pointer"
    @click.prevent="adjustedForInflation = !adjustedForInflation"
  >
    <div
      class="grid grid-flow-col items-center"
      :class="{
        'gap-0.5 text-xs': size === 'sm',
        'gap-2 text-sm': size === 'md',
      }"
    >
      <div>Adjusted for inflation</div>
      <UToggle
        :model-value="adjustedForInflation"
        :size="size"
      />
    </div>
  </div>
</template>
