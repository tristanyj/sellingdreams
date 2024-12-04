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
          class="relative rounded-lg w-full max-w-96 bg-gray-50 overflow-hidden transition-all duration-50 will-change-transform transform translate-y-0"
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

          hello world
        </div>
      </div>
    </div>
  </Transition>
</template>
