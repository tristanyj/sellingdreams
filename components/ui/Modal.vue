<script setup lang="ts">
import { formatDescription } from '@/assets/scripts/utils';

const interactionStore = useInteractionStore();
const { selectedAd } = storeToRefs(interactionStore);
const { setSelectedAd } = interactionStore;

const getImageUrl = (id: string) => {
  return new URL(`../../assets/images/ads/${id}.webp`, import.meta.url).href;
};

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isModalOpen.value) {
    setSelectedAd(null);
  }
}

const isModalOpen = computed({
  get: () => selectedAd.value !== null,
  set: (value) => setSelectedAd(value ? selectedAd.value : null),
});

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

// block scroll when modal is open
watch(isModalOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-100"
        @click="setSelectedAd(null)"
      />

      <div class="flex justify-center items-center min-h-screen p-1">
        <div
          class="relative rounded-lg w-full max-w-[480px] max-h-[580px] overflow-y-scroll p-5 text-sm bg-gray-50 shadow-xl transition-all duration-50 will-change-transform transform translate-y-0"
        >
          <button
            type="button"
            class="absolute z-10 top-3 right-3 text-gray-400 hover:text-gray-500"
            @click="setSelectedAd(null)"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            v-if="selectedAd"
            class="grid gap-2"
          >
            <div class="grid gap-1 mb-2.5">
              <div class="grid grid-flow-col justify-center items-center gap-2">
                <div class="">{{ selectedAd.year }}</div>
                <div class="w-1 h-1 rounded-full bg-black" />
                <div class="">{{ selectedAd.client }}</div>
              </div>
              <div
                class="grid grid-flow-col items-center justify-center gap-2 text-2xl px-5 leading-tight"
              >
                <div class="font-semibold text-center">{{ selectedAd.name }}</div>
              </div>
            </div>
            <div v-if="['television', 'radio'].includes(selectedAd.category)">
              <iframe
                class="w-full h-64"
                :src="selectedAd.youtube_link"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
            <div v-else>
              <img
                :src="getImageUrl(selectedAd.id)"
                class="w-full object-contain rounded-sm"
                alt=""
              />
            </div>
            <div
              v-if="selectedAd.agency"
              class="text-gray-600 text-center text-xs mt-1"
            >
              Agency : {{ selectedAd.agency }}
            </div>
            <div
              v-if="selectedAd.description"
              class="grid gap-2 mt-2"
            >
              <p
                v-for="(paragraph, i) in formatDescription(selectedAd.description)"
                :key="`paragraph-${i}`"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
