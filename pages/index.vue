<script setup lang="ts">
useHead({
  title:
    'Selling dreams — 100 years of advertising evolution and iconic campaigns in the United States',
});

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);

const dataStore = useDataStore();
const { isLoaded: isDataLoaded } = storeToRefs(dataStore);
</script>

<template>
  <div class="relative grid overflow-hidden">
    <UiGuide />
    <UiBackground />
    <UContainer>
      <UiHero />
      <UiChart v-if="isFiguresLoaded && isDataLoaded" />
      <div
        v-else
        class="relative w-full mx-auto"
      >
        <div class="pb-[100%]" />
        <div class="absolute inset-0 animate-pulse rounded-lg bg-gray-100 opacity-20" />
      </div>
      <UiFooter />
    </UContainer>
  </div>
</template>
