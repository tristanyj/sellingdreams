<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const interactionStore = useInteractionStore();
const { updateMousePosition } = interactionStore;

const figureStore = useFigureStore();
const { selectArea } = figureStore;
const { figures, maxGDPProportion, selectedArea } = storeToRefs(figureStore);

const { width, height, margin } = useChartConfig();
const { drawCategoryAreas } = useChartDrawAreas();
const { drawYearLegend, drawCategoryLines } = useChartDrawLines();
const { drawAreaPoints } = useChartDrawPoints();

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);
const isLoading = ref(true);

const yScale = d3
  .scalePoint()
  .domain(figures.value.map((f) => f.year.toString()))
  .range([margin.y / 2, height - margin.y / 2]);

const xScale = d3
  .scaleLinear()
  .domain([0, maxGDPProportion.value])
  .range([0, width - margin.x]);

function createVisualization() {
  if (!g.value) return;

  g.value.selectAll('*').remove();

  // -----------------
  // Steam Graph
  // -----------------

  // Legend
  drawYearLegend(g.value, yScale);

  g.value
    .append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .on('click', () => {
      selectArea(null);
    })
    .on('mousemove', (event) => {
      updateMousePosition(event);
    });

  // Areas
  drawCategoryAreas(g.value, xScale, yScale);

  // Lines
  drawCategoryLines(g.value, xScale, yScale);

  // Hover Area
  drawCategoryAreas(g.value, xScale, yScale, true);

  // Points
  drawAreaPoints(g.value, xScale, yScale);
}

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
    .attr('width', 2.5)
    .attr('height', 2.5)
    .append('image')
    .attr(
      'xlink:href',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVQoU2NkYGBg+M+ABBgAAdwABkzD8aAAAAABJRU5ErkJggg=='
    )
    .attr('width', 2.5)
    .attr('height', 2.5);

  g.value = svg.append('g');

  createVisualization();

  isLoading.value = false;
};

onMounted(() => {
  mountToContainer();
});

function updateVisualization() {
  if (!container.value) return;
  createVisualization();
}

watch(selectedArea, () => {
  updateVisualization();
});

const handleOutsideClick = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    selectArea(null);
  }
};

onMounted(() => {
  mountToContainer();
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div class="relative z-10">
    <UiTooltipCategory />
    <UiTooltipAd />
    <UiModal />
    <div
      id="container"
      ref="container"
      @click.stop
    />
  </div>
</template>
