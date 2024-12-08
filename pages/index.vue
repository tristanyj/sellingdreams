<script setup lang="ts">
useHead({ title: 'Madison | Description' });

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);

const dataStore = useDataStore();
const { isLoaded: isAdsLoaded } = storeToRefs(dataStore);

const ads = [
  // { id: 'ads/1917-miscellaneous-preview.webp', alt: 'Ad 1', x: -500, y: 0, width: 150 },
  // { id: 'ads/1931-periodicals-preview.webp', alt: 'Ad 2', x: 0, y: 0, width: 150 },
  // { id: 'ads/1947-periodicals-preview.webp', alt: 'Ad 3', x: 0, y: 0, width: 150 },
  {
    id: 'ads/1955-miscellaneous-preview.webp',
    alt: 'Ad 4',
    x: -900,
    y: 300,
    width: 150,
    opacity: 0.75,
  },
  {
    id: 'ads/1959-periodicals-preview.webp',
    alt: 'Ad 6',
    x: -100,
    y: -250,
    width: 150,
    opacity: 0.75,
  },
  {
    id: 'ads/1960-periodicals-preview.webp',
    alt: 'Ad 5',
    x: -700,
    y: -100,
    width: 250,
    opacity: 0.75,
  },
  {
    id: 'ads/1968-periodicals-preview.webp',
    alt: 'Ad 7',
    x: 600,
    y: -100,
    width: 150,
    opacity: 0.75,
  },
  {
    id: 'ads/1979-television-preview.webp',
    alt: 'Ad 10',
    x: 400,
    y: 250,
    width: 150,
    opacity: 0.75,
  },
  {
    id: 'ads/1981-periodicals-preview.webp',
    alt: 'Ad 8',
    x: -400,
    y: 200,
    width: 150,
    opacity: 0.75,
  },
  {
    id: 'ads/1993-television-preview.webp',
    alt: 'Ad 9',
    x: 200,
    y: -250,
    width: 150,
    opacity: 0.75,
  },
];

// onMounted(() => {
//   const track = adTrack.value;

//   let scrollPosition = 0;
//   const scrollSpeed = 1; // Adjust scroll speed as needed

//   function animate() {
//     scrollPosition -= scrollSpeed;
//     if (track && scrollPosition <= -track.scrollWidth / 2) {
//       scrollPosition = 0;
//     }
//     if (track) {
//       track.style.transform = `translateX(${scrollPosition}px)`;
//     }
//     requestAnimationFrame(animate);
//   }

//   requestAnimationFrame(animate);
// });
</script>

<template>
  <div class="relative grid">
    <UiGuide />
    <!-- <div class="relative w-full">
      <div class="relative overflow-hidden whitespace-nowrap w-full">
        <div
          ref="adTrack"
          class="inline-block whitespace-nowrap will-change-transform"
        >
          <NuxtImg
            v-for="(ad, index) in ads"
            :key="`first-${index}`"
            :src="ad.id"
            :alt="ad.alt"
            class="inline-block w-[150px] rounded-md mr-10"
          />
          <NuxtImg
            v-for="(ad, index) in ads"
            :key="`second-${index}`"
            :src="ad.id"
            :alt="ad.alt"
            class="inline-block w-[150px] rounded-md mr-10"
          />
        </div>
      </div>
    </div> -->
    <UContainer>
      <div class="relative grid gap-6 pt-48 pb-20">
        <h1 class="font-crimson font-bold text-7xl text-center">
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
            class="grid grid-flow-col gap-3 justify-center border border-black/20 bg-black/[0.025] p-2 rounded-lg items-center"
          >
            <UiToggleFigureMode />
            <UiTogglePerformanceMode />
          </div>
        </div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NuxtImg
            v-for="(ad, index) in ads"
            :key="index"
            class="absolute h-auto opacity-75 max-w-none rounded-lg transform -translate-x-1/2 -translate-y-1/2"
            :style="{
              width: `${ad.width}px`,
              top: `${ad.y}px`,
              left: `${ad.x}px`,
              opacity: `${ad.opacity}`,
            }"
            :src="ad.id"
            :alt="ad.alt"
          />
        </div>
      </div>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
    </UContainer>
  </div>
</template>
