<script setup lang="ts">
import type { AdId, ImageAd } from '~/types';

const interactionStore = useInteractionStore();
const { setSelectedAd } = interactionStore;

const isLoaded = ref(false);

const dataStore = useDataStore();
const { ads } = storeToRefs(dataStore);

const imageAds: ImageAd[] = [
  {
    id: '1917-miscellaneous' as AdId,
    url: 'ads/1917-miscellaneous-preview.webp',
    alt: '1917 - Lucky Strike',
    x: 550,
    y: -130,
    width: 130,
    w: 300,
    h: 438,
    opacity: 0.75,
  },
  {
    id: '1981-periodicals' as AdId,
    url: 'ads/1981-periodicals-preview.webp',
    alt: '1981 - Absolut Vodka',
    x: 600,
    y: 290,
    width: 220,
    w: 400,
    h: 514,
    opacity: 0.85,
  },
  {
    id: '1960-periodicals' as AdId,
    url: 'ads/1960-periodicals-preview.webp',
    alt: '1960 - Volkswagen',
    x: -680,
    y: -50,
    width: 250,
    w: 400,
    h: 508,
    opacity: 0.85,
  },
  {
    id: '1984-television' as AdId,
    url: 'ads/1984-television-preview.webp',
    alt: '1984 - Apple',
    x: -500,
    y: 300,
    width: 150,
    w: 400,
    h: 266,
    opacity: 0.7,
  },
  {
    id: '1971-television' as AdId,
    url: 'ads/1971-television-preview.webp',
    alt: '1971 - Coca-Cola',
    x: 0,
    y: -150,
    width: 265,
    w: 400,
    h: 226,
    opacity: 0.85,
  },
];

const selectAd = (imageAd: ImageAd) => {
  const ad = ads.value.find((ad) => ad.id === imageAd.id);
  if (!ad) return;

  setSelectedAd(ad);
};

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 750);
});
</script>

<template>
  <div class="relative grid gap-5 pt-16 lg:pt-64 2xl:pt-80 mt-8 pb-8 lg:pb-20">
    <div
      class="flex justify-center font-josefin uppercase font-bold text-6xl lg:text-7xl text-center"
    >
      <h1 class="lg:bg-primary-100/20 px-2 py-1 rounded-sm leading-none">
        <span class="relative top-2">Selling Dreams</span>
      </h1>
    </div>
    <h1 class="font-crimson font-medium text-3xl text-center max-w-[654px] mx-auto px-2">
      100 years of advertising evolution and iconic campaigns in the United States
    </h1>
    <div>
      <Transition>
        <!-- <div v-if="isLoaded"> -->
        <div
          v-if="isLoaded"
          class="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div
            v-for="(ad, index) in imageAds"
            :key="`ad-${index}`"
            class="absolute transform -translate-x-1/2 -translate-y-1/2 border transition-opacity cursor-pointer hover-opacity"
            :style="{
              width: `${ad.width}px`,
              top: `${ad.y}px`,
              left: `${ad.x}px`,
              opacity: `${ad.opacity}`,
            }"
            @click="selectAd(ad)"
          >
            <NuxtImg
              class="h-auto max-w-none rounded-lg"
              :src="ad.url"
              :alt="ad.alt"
              :width="ad.w"
              :height="ad.h"
              :style="{
                width: `${ad.width}px`,
              }"
            />
            <!-- </div> -->
          </div>
        </div>
      </Transition>
    </div>
  </div>
  <p
    class="font-crimson max-w-[420px] mx-auto text-center mt-5 mb-20 lg:mb-40 opacity-90 rounded-xl text-lg"
  >
    Advertising is more than just a way to sell products, it's a reflection of the society and
    culture of its time. In the heart of individuals, it creates long-lasting memories and emotions.
    This project showcases the evolution of advertising in the United States from 1910 to 2007 and
    highlights iconic campaigns that shaped both the industry and cultural norms.
  </p>
</template>
