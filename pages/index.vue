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
  offset: number;
}

const imageAds: ImageAd[] = [
  {
    id: '1917-miscellaneous' as Id,
    url: 'ads/1917-miscellaneous-preview.webp',
    alt: '1917 - Lucky Strike',
    x: 550,
    y: -130,
    width: 130,
    opacity: 0.75,
  },
  {
    id: '1981-periodicals' as Id,
    url: 'ads/1981-periodicals-preview.webp',
    alt: '1981 - Absolut Vodka',
    x: 600,
    y: 290,
    width: 220,
    opacity: 0.85,
  },
  {
    id: '1960-periodicals' as Id,
    url: 'ads/1960-periodicals-preview.webp',
    alt: '1960 - Volkswagen',
    x: -680,
    y: -50,
    width: 250,
    opacity: 0.85,
  },
  {
    id: '1984-television' as Id,
    url: 'ads/1984-television-preview.webp',
    alt: '1984 - Apple',
    x: -500,
    y: 300,
    width: 150,
    opacity: 0.7,
  },
  {
    id: '1971-television' as Id,
    url: 'ads/1971-television-preview.webp',
    alt: '1971 - Coca-Cola',
    x: 0,
    y: -150,
    width: 265,
    opacity: 0.85,
  },
];

const bgAdsBottom: BgAd[] = [
  {
    id: '1911-miscellaneous' as Id,
    url: 'ads/1911-miscellaneous-preview.webp',
    alt: '1911 - ',
    offset: 0,
  },
  {
    id: '1931-periodicals' as Id,
    url: 'ads/1931-periodicals-preview.webp',
    alt: '1931 - ',
    offset: 1,
  },
  {
    id: '1947-periodicals' as Id,
    url: 'ads/1947-periodicals-preview.webp',
    alt: '1947 - ',
    offset: 2,
  },
  {
    id: '1955-miscellaneous' as Id,
    url: 'ads/1955-miscellaneous-preview.webp',
    alt: '1955 - ',
    offset: 2,
  },
  {
    id: '1958-television' as Id,
    url: 'ads/1958-television-preview.webp',
    alt: '1958 - ',
    offset: 1,
  },
  {
    id: '1968-periodicals' as Id,
    url: 'ads/1968-periodicals-preview.webp',
    alt: '1968 - ',
    offset: 0,
  },
];

const bgAdsTop: BgAd[] = [
  {
    id: '1922-periodicals' as Id,
    url: 'ads/1922-periodicals-preview.webp',
    alt: '1922 - ',
    offset: 0,
  },
  {
    id: '1933-radio' as Id,
    url: 'ads/1933-radio-preview.webp',
    alt: '1933 - ',
    offset: 1,
  },
  {
    id: '1966-television' as Id,
    url: 'ads/1966-television-preview.webp',
    alt: '1966 - ',
    offset: 2,
  },
  {
    id: '1975-direct_mail' as Id,
    url: 'ads/1975-direct_mail-preview.webp',
    alt: '1975 - ',
    offset: 2,
  },
  {
    id: '1979-television' as Id,
    url: 'ads/1979-television-preview.webp',
    alt: '1979 - ',
    offset: 1,
  },
  {
    id: '2005-out_of_home' as Id,
    url: 'ads/2005-out_of_home-preview.webp',
    alt: '2005 - ',
    offset: 0,
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
    <div class="absolute left-1/2 transform -translate-x-1/2 -top-20 opacity-[0.04]">
      <div class="relative grid grid-flow-col w-full">
        <NuxtImg
          v-for="ad in bgAdsTop"
          :key="`first-${ad.id}`"
          :src="ad.url"
          :alt="ad.alt"
          :style="{
            top: `-${ad.offset * 100}px`,
          }"
          class="relative block h-[400px] max-w-none w-auto rounded-md mr-10"
        />
      </div>
    </div>
    <div class="absolute -left-32 top-[600px] opacity-[0.04]">
      <div class="relative overflow-hidden whitespace-nowrap w-full">
        <div class="inline-block whitespace-nowrap will-change-transform">
          <NuxtImg
            v-for="ad in bgAdsBottom"
            :key="`first-${ad.id}`"
            :src="ad.url"
            :alt="ad.alt"
            :style="{
              bottom: `-${ad.offset * 50}px`,
            }"
            class="relative inline-block w-[320px] h-auto rounded-md mr-10"
          />
        </div>
      </div>
    </div>
    <UContainer>
      <div class="relative grid gap-5 pt-64 2xl:pt-80 mt-8 pb-20">
        <h1 class="flex justify-center font-josefin uppercase font-bold text-7xl text-center">
          <div class="bg-primary-100/20 px-2 py-1 rounded-sm leading-none">
            <span class="relative top-2">Selling Dreams</span>
          </div>
        </h1>
        <h1 class="font-crimson font-medium text-3xl text-center max-w-[654px] mx-auto">
          100 years of advertising evolution and iconic campaigns in the United States
        </h1>
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
      <p class="font-crimson max-w-[420px] mx-auto text-center mt-5 mb-40 opacity-80 rounded-xl">
        Advertising is more than just a way to sell products, it's a reflection of the society and
        culture of its time. In the heart of individuals, it creates long-lasting memories and
        emotions. This project showcases the evolution of advertising in the United States from 1910
        to 2007 and highlights iconic campaigns that shaped both the industry and cultural norms.
        <!-- The data used in this project is sourced from the
        <a
          href="https://www.purplemotes.net/2008/09/14/us-advertising-expenditure-data/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-800 transition-colors duration-50 underline"
          >Douglas Galbi blog</a
        >. -->
      </p>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
      <div class="relative py-16 text-center lowercase font-crimson">
        <p class="opacity-80">
          Created by Tristan Lanoye
          <span class="relative right-1 mx-3 opacity-60">|</span>
          <a
            href="https://tristanyj.com"
            class="underline"
            target="_blank"
            >tristanyj.com</a
          >
        </p>
        <div class="max-w-80 mx-auto h-px bg-gray-900 my-4 opacity-15" />
        <div class="text-gray-700 text-sm lowercase">
          Data from
          <a
            href="https://www.basketball-reference.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-800 transition-colors duration-50 underline"
            >Basketball Reference</a
          >
        </div>
        <div class="text-gray-700 text-sm lowercase">
          Data from
          <a
            href="https://www.basketball-reference.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-800 transition-colors duration-50 underline"
            >Basketball Reference</a
          >
        </div>
      </div>
    </UContainer>
  </div>
</template>
