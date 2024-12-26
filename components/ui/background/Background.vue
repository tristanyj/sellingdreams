<script setup lang="ts">
import type { AdId, BgAd } from '~/types';

const imageLoaderStore = useImageLoaderStore();
const { allImagesLoaded } = storeToRefs(imageLoaderStore);
const { registerImages } = imageLoaderStore;

const bgAdsTop: BgAd[] = [
  {
    id: '1922-periodicals' as AdId,
    url: 'ads/1922-periodicals-preview.webp',
    alt: '1922 - ',
    offset: 0,
    width: 400,
    height: 515,
  },
  {
    id: '1933-radio' as AdId,
    url: 'ads/1933-radio-preview.webp',
    alt: '1933 - ',
    offset: -1,
    width: 400,
    height: 511,
  },
  {
    id: '1966-television' as AdId,
    url: 'ads/1966-television-preview.webp',
    alt: '1966 - ',
    offset: -2,
    width: 400,
    height: 522,
  },
  {
    id: '1975-direct_mail' as AdId,
    url: 'ads/1975-direct_mail-preview.webp',
    alt: '1975 - ',
    offset: -2,
    width: 400,
    height: 578,
  },
  {
    id: '1979-television' as AdId,
    url: 'ads/1979-television-preview.webp',
    alt: '1979 - ',
    offset: -1,
    width: 400,
    height: 533,
  },
  {
    id: '2005-out_of_home' as AdId,
    url: 'ads/2005-out_of_home-preview.webp',
    alt: '2005 - ',
    offset: 0,
    width: 400,
    height: 519,
  },
];

const bgAdsBottom: BgAd[] = [
  {
    id: '1911-miscellaneous' as AdId,
    url: 'ads/1911-miscellaneous-preview.webp',
    alt: '1911 - ',
    offset: 0,
    width: 418,
    height: 540,
  },
  {
    id: '1931-periodicals' as AdId,
    url: 'ads/1931-periodicals-preview.webp',
    alt: '1931 - ',
    offset: 1,
    width: 400,
    height: 513,
  },
  {
    id: '1947-periodicals' as AdId,
    url: 'ads/1947-periodicals-preview.webp',
    alt: '1947 - ',
    offset: 2,
    width: 400,
    height: 468,
  },
  {
    id: '1955-miscellaneous' as AdId,
    url: 'ads/1955-miscellaneous-preview.webp',
    alt: '1955 - ',
    offset: 2,
    width: 369,
    height: 500,
  },
  {
    id: '1958-television' as AdId,
    url: 'ads/1958-television-preview.webp',
    alt: '1958 - ',
    offset: 1,
    width: 400,
    height: 527,
  },
  {
    id: '1968-periodicals' as AdId,
    url: 'ads/1968-periodicals-preview.webp',
    alt: '1968 - ',
    offset: 0,
    width: 400,
    height: 540,
  },
];

const checkImagesLoaded = (ads: BgAd[]) => {
  ads.forEach((ad) => {
    const img = new Image();
    img.src = ad.url;
    img.onload = () => imageLoaderStore.imageLoaded();
    img.onerror = () => imageLoaderStore.imageLoaded();
  });
};

registerImages(bgAdsTop.concat(bgAdsBottom).length);

onMounted(() => {
  checkImagesLoaded(bgAdsTop);
  checkImagesLoaded(bgAdsBottom);
});
</script>

<template>
  <div>
    <Transition>
      <div v-if="allImagesLoaded">
        <UiBackgroundAds :ads="bgAdsTop" />
        <UiBackgroundAds
          :ads="bgAdsBottom"
          :top="500"
        />
      </div>
    </Transition>
  </div>
</template>
