export const useImageLoaderStore = defineStore('imageLoader', () => {
  const totalImages = ref<number>(0);
  const loadedImages = ref<number>(0);

  const registerImages = (count: number) => {
    totalImages.value += count;
  };

  const imageLoaded = () => {
    loadedImages.value++;
  };

  const allImagesLoaded = computed(() => {
    return loadedImages.value >= totalImages.value;
  });

  return {
    registerImages,
    imageLoaded,
    allImagesLoaded,
  };
});
