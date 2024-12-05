<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);
const dataStore = useDataStore();
const { isLoaded: isAdsLoaded } = storeToRefs(dataStore);
</script>

<template>
  <div class="grid">
    <UContainer>
      <div class="py-20">
        <!-- <h1 class="font-lexend font-bold text-6xl capitalize text-center">
          A century of advertising <br />
          in the United States
        </h1> -->
      </div>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
    </UContainer>

    <!-- <div class="relative mb-20 px-5">
    </div> -->
  </div>
</template>
