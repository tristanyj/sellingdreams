import type { Ad } from '~/types';

export const useAdStore = defineStore('ad', () => {
  const ads = ref<Ad[]>([]);

  const setAds = (newAds: Ad[]) => {
    ads.value = newAds;
  };

  return {
    ads,
    setAds,
  };
});
