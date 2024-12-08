<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);

const dataStore = useDataStore();
const { isLoaded: isAdsLoaded } = storeToRefs(dataStore);
</script>

<template>
  <div class="grid">
    <UiGuide />
    <UContainer>
      <div class="grid gap-5 pt-40 pb-20">
        <h1 class="font-crimson font-bold text-6xl text-center">
          A century of advertising <br />
          in the United States
        </h1>
        <p class="max-w-[584px] mx-auto text-center opacity-75">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sed provident dolores
          atque, eaque itaque cupiditate aut ea sequi omnis esse quis numquam minima iusto facilis
          rem saepe ullam blanditiis!
        </p>
        <div class="flex justify-center">
          <div
            class="grid grid-flow-col gap-4 justify-center border border-black/20 bg-black/5 p-2 rounded-lg items-center"
          >
            <UiToggleFigureMode />
            <UiTogglePerformanceMode />
          </div>
        </div>
      </div>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
    </UContainer>
  </div>
</template>
