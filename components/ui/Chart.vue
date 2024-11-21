<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const { drawSteamGraph } = useChartDrawStack();

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);
const isLoading = ref(true);

function createVisualization() {
  if (!g.value) return;

  g.value.selectAll('*').remove();

  // -----------------
  // Steam Graph
  // -----------------

  drawSteamGraph(g.value);
}

// function updateVisualization() {
//   if (!container.value) return;
//   createVisualization();
// }

const mountToContainer = () => {
  if (!container.value) {
    return;
  }

  d3.select(container.value).selectAll('*').remove();
  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'mx-auto');
  g.value = svg.append('g');
  // .attr('transform', `translate(${width / 2},${height / 2})`);

  createVisualization();

  isLoading.value = false;
};

onMounted(() => {
  mountToContainer();
});
</script>

<template>
  <div class="relative z-10">
    <div
      id="container"
      ref="container"
      @click.stop
    />
  </div>
</template>
