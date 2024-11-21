<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);
const adStore = useAdStore();
const { isLoaded: isAdsLoaded } = storeToRefs(adStore);
</script>

<template>
  <div class="grid">
    <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
  </div>
</template>
