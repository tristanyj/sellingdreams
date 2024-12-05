<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Figure, Ad, Category, Event } from './types';

const figureStore = useFigureStore();
const { setFigures } = figureStore;

const dataStore = useDataStore();
const { setData } = dataStore;

onMounted(() => {
  setFigures(dataset.figures as unknown as Figure[]);
  setData({
    ads: dataset.ads as unknown as Ad[],
    events: dataset.events as unknown as Event[],
    categories: dataset.categories as unknown as Category[],
  });
});
</script>

<template>
  <main>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </main>
</template>
