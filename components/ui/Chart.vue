<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const figureStore = useFigureStore();
const { figures, maxGDPProportion } = storeToRefs(figureStore);

const { width, height, margin } = useChartConfig();
const { drawCategoryAreas } = useChartDrawAreas();
const { drawYearLegend } = useChartDrawLines();

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);
const isLoading = ref(true);

const yScale = d3
  .scalePoint()
  .domain(figures.value.map((f) => f.year.toString()))
  .range([margin.top, height - margin.bottom]);

const xScale = d3
  .scaleLinear()
  .domain([0, maxGDPProportion.value])
  .range([0, width - margin.left - margin.right]);

function createVisualization() {
  if (!g.value) return;

  g.value.selectAll('*').remove();

  // -----------------
  // Steam Graph
  // -----------------

  drawYearLegend(g.value, yScale);
  drawCategoryAreas(g.value, xScale, yScale);
  drawCategoryAreas(g.value, xScale, yScale, true);
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

  svg
    .append('defs')
    .append('pattern')
    .attr('id', 'noise-pattern')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 3)
    .attr('height', 3)
    .append('image')
    .attr(
      'xlink:href',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVQoU2NkYGBg+M+ABBgAAdwABkzD8aAAAAABJRU5ErkJggg=='
    )
    .attr('width', 3)
    .attr('height', 3);

  g.value = svg.append('g');

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
