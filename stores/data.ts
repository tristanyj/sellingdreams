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
    ads.value = [...newAds].map((e) => ({
      ...e,
      description: typeof e.description === 'string' ? [e.description] : e.description,
    }));

    events.value = [...newEvents].map((e) => ({
      ...e,
      categories: typeof e.categories === 'string' ? [e.categories] : e.categories,
    }));
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
