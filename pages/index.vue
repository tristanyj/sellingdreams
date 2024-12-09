<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);

const dataStore = useDataStore();
const { isLoaded: isDataLoaded } = storeToRefs(dataStore);
</script>

<template>
  <div class="relative grid overflow-hidden">
    <UiGuide />
    <div>
      <UiBackground v-if="isDataLoaded" />
    </div>
    <UContainer>
      <UiHero />
      <UiChart v-if="isFiguresLoaded && isDataLoaded" />
      <div
        v-else
        class="relative max-w-[1400px] w-full mx-auto"
      >
        <div class="pb-[100%]" />
        <div class="absolute inset-0 animate-pulse rounded-lg bg-gray-100 opacity-20" />
      </div>
      <UiFooter />
    </UContainer>
  </div>
</template>
