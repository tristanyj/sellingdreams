<script setup lang="ts">
import type { CategoryKey } from '~/types';

useHead({ title: 'Madison | Description' });

const interactionStore = useInteractionStore();
const { setSelectedAd } = interactionStore;

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);

const dataStore = useDataStore();
const { isLoaded: isAdsLoaded, ads } = storeToRefs(dataStore);

type Id = `${number}-${CategoryKey}`;

interface ImageAd {
  id: Id;
  url: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  opacity: number;
}

interface BgAd {
  id: Id;
  url: string;
  alt: string;
}

const imageAds: ImageAd[] = [
  {
    id: '1917-miscellaneous' as Id,
    url: 'ads/1917-miscellaneous-preview.webp',
    alt: '1917 - Lucky Strike',
    x: 550,
    y: -180,
    width: 130,
    opacity: 0.75,
  },
  {
    id: '1981-periodicals' as Id,
    url: 'ads/1981-periodicals-preview.webp',
    alt: '1981 - Absolut Vodka',
    x: 600,
    y: 240,
    width: 220,
    opacity: 0.85,
  },
  {
    id: '1960-periodicals' as Id,
    url: 'ads/1960-periodicals-preview.webp',
    alt: '1960 - Volkswagen',
    x: -680,
    y: -100,
    width: 250,
    opacity: 0.85,
  },
  {
    id: '1984-television' as Id,
    url: 'ads/1984-television-preview.webp',
    alt: '1984 - Apple',
    x: -500,
    y: 250,
    width: 150,
    opacity: 0.7,
  },
  {
    id: '1971-television' as Id,
    url: 'ads/1971-television-preview.webp',
    alt: '1971 - Coca-Cola',
    x: 0,
    y: -200,
    width: 265,
    opacity: 0.85,
  },
];

const bgAds: BgAd[] = [
  {
    id: '1911-miscellaneous' as Id,
    url: 'ads/1911-miscellaneous-preview.webp',
    alt: '1911 - ',
  },
  {
    id: '1931-periodicals' as Id,
    url: 'ads/1931-periodicals-preview.webp',
    alt: '1931 - ',
  },
  {
    id: '1947-periodicals' as Id,
    url: 'ads/1947-periodicals-preview.webp',
    alt: '1947 - ',
  },
  {
    id: '1955-miscellaneous' as Id,
    url: 'ads/1955-miscellaneous-preview.webp',
    alt: '1955 - ',
  },
  {
    id: '1958-television' as Id,
    url: 'ads/1958-television-preview.webp',
    alt: '1958 - ',
  },
  {
    id: '1968-periodicals' as Id,
    url: 'ads/1968-periodicals-preview.webp',
    alt: '1968 - ',
  },
];

const selectAd = (imageAd: ImageAd) => {
  const ad = ads.value.find((ad) => ad.id === imageAd.id);
  if (!ad) return;

  setSelectedAd(ad);
};
</script>

<template>
  <div class="relative grid">
    <UiGuide />
    <div class="absolute -left-32 top-[600px] opacity-[0.04]">
      <div class="relative overflow-hidden whitespace-nowrap w-full">
        <div class="inline-block whitespace-nowrap will-change-transform">
          <NuxtImg
            v-for="ad in bgAds"
            :key="`first-${ad.id}`"
            :src="ad.url"
            :alt="ad.alt"
            class="inline-block w-[320px] h-auto rounded-md mr-10"
          />
        </div>
      </div>
    </div>
    <UContainer>
      <div class="relative grid gap-5 pt-60 2xl:pt-72 pb-20">
        <h1 class="font-crimson font-bold text-7xl text-center">
          A century of advertising <br />
          in the United States
        </h1>
        <p class="max-w-[584px] mx-auto text-center opacity-75">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sed provident dolores
          atque, eaque itaque cupiditate aut ea sequi omnis esse quis numquam minima iusto facilis
          rem saepe ullam blanditiis!
        </p>
        <div class="h-[80px]"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              :style="{
                width: `${ad.width}px`,
              }"
            />
          </div>
        </div>
      </div>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
      <div class="relative py-16 text-center lowercase">
        <p class="opacity-80">
          Created by Tristan Lanoye
          <span class="relative right-1 mx-3 opacity-50">|</span>
          <a
            href="https://tristanyj.com"
            class="underline"
            target="_blank"
            >tristanyj.com</a
          >
        </p>
        <div class="max-w-80 mx-auto h-px bg-gray-700 my-4 opacity-25" />
        <div class="text-gray-700 text-sm lowercase">
          Data from
          <a
            href="https://www.basketball-reference.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-800 transition-colors duration-50 underline"
            >Basketball Reference</a
          >; <br />
          up to date as of november 2024.
        </div>
      </div>
    </UContainer>
  </div>
</template>
