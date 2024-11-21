<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Figure, Ad } from './types';

const figureStore = useFigureStore();
const { setFigures } = figureStore;

const adStore = useAdStore();
const { setAds } = adStore;

onMounted(() => {
  setFigures(dataset.figures as unknown as Figure[]);
  setAds(dataset.ads as unknown as Ad[]);
});
</script>

<template>
  <main>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </main>
</template>
