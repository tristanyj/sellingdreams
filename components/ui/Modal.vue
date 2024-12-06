<script setup lang="ts">
const interactionStore = useInteractionStore();
const { selectedAd } = storeToRefs(interactionStore);
const { setSelectedAd } = interactionStore;

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
          class="relative rounded-lg w-full max-w-[540px] max-h-[520px] overflow-y-scroll p-5 text-sm bg-gray-50 overflow-hidden transition-all duration-50 will-change-transform transform translate-y-0"
        >
          <button
            type="button"
            class="absolute z-10 top-4 right-4 text-gray-400 hover:text-gray-500"
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
            <div class="grid gap-1">
              <div class="grid grid-flow-col justify-start items-center gap-2">
                <div class="">{{ selectedAd.year }}</div>
                <div class="w-1 h-1 rounded-full bg-black" />
                <div class="">{{ selectedAd.client }}</div>
              </div>
              <div class="grid grid-flow-col items-center gap-2 text-2xl leading-tight">
                <div class="font-medium pr-8">{{ selectedAd.slogan }}</div>
              </div>
              <div class="text-gray-600 text-xs mt-0.5 mb-1">Agency : {{ selectedAd.agency }}</div>
            </div>
            <div>
              <iframe
                class="w-full h-56"
                src="https://www.youtube.com/embed/C2406n8_rUw?si=NnwXw3KJ6_h--jhZ"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
            <div class="grid gap-1 mt-2">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur porro iusto cum
                at tenetur nihil nesciunt libero dolores ipsam inventore nostrum molestias sapiente,
                sequi, vitae enim? A animi unde odio.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur porro iusto cum
                at tenetur nihil nesciunt libero dolores ipsam inventore nostrum molestias sapiente,
                sequi, vitae enim? A animi unde odio.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur porro iusto cum
                at tenetur nihil nesciunt libero dolores ipsam inventore nostrum molestias sapiente,
                sequi, vitae enim? A animi unde odio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
