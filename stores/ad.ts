import type { Ad } from '~/types';

export const useAdStore = defineStore('ad', () => {
  const ads = ref<Ad[]>([]);
  const isLoaded = ref<boolean>(false);

  const setAds = (newAds: Ad[]) => {
    ads.value = newAds;
    isLoaded.value = true;
  };

  return {
    ads,
    isLoaded,
    setAds,
  };
});
