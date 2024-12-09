<script setup lang="ts">
import type { AdId } from '~/types';

interface BgAd {
  id: AdId;
  url: string;
  alt: string;
  offset: number;
}

interface Props {
  ads: BgAd[];
  top?: number;
}

withDefaults(defineProps<Props>(), {
  top: 0,
});
</script>

<template>
  <div
    class="absolute left-1/2 transform -translate-x-1/2 -top-20 opacity-[0.04]"
    :style="{ top: `${top}px` }"
  >
    <div class="relative grid grid-flow-col w-full">
      <NuxtImg
        v-for="ad in ads"
        :key="`first-${ad.id}`"
        :src="ad.url"
        :alt="ad.alt"
        :style="{
          top: `${ad.offset * 50}px`,
        }"
        class="relative block h-[400px] max-w-none w-auto rounded-md mr-10"
      />
    </div>
  </div>
</template>
