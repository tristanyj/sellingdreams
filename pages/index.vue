<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);
const adStore = useAdStore();
const { isLoaded: isAdsLoaded } = storeToRefs(adStore);
</script>

<template>
  <div class="grid">
    <UContainer>
      <div class="py-20">
        <h1 class="font-lexend font-bold text-6xl capitalize text-center">
          A century of advertising <br />
          in the United States
        </h1>
      </div>
    </UContainer>

    <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
  </div>
</template>
