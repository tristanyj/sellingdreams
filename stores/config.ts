export const useConfigStore = defineStore('config', () => {
  const searchInput = ref('');

  return {
    searchInput,
  };
});
