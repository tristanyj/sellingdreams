<script setup lang="ts">
const interactionStore = useInteractionStore();
const { selectedAd } = storeToRefs(interactionStore);
const { setSelectedAd } = interactionStore;

const isOpen = computed({
  get: () => selectedAd.value !== null,
  set: (value) => {
    if (!value) {
      setSelectedAd(null);
    }
  },
});
</script>

<template>
  <div>
    <UButton
      label="Open"
      @click="isOpen = true"
    />

    <UModal v-model="isOpen">
      <div class="p-4">hello world</div>
    </UModal>
  </div>
</template>
