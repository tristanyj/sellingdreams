import type { Ad, Event, Category } from '~/types';

export const useDataStore = defineStore('data', () => {
  const ads = ref<Ad[]>([]);
  const events = ref<Event[]>([]);
  const categories = ref<Category[]>([]);

  const isLoaded = ref<boolean>(false);

  const setData = ({
    ads: newAds,
    events: newEvents,
    categories: newCategories,
  }: {
    ads: Ad[];
    events: Event[];
    categories: Category[];
  }) => {
    ads.value = newAds;
    events.value = newEvents;
    categories.value = newCategories;

    isLoaded.value = true;
  };

  return {
    ads,
    events,
    categories,
    isLoaded,
    setData,
  };
});
