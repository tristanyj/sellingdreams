<script setup lang="ts">
useHead({ title: 'Madison | Description' });

import { useWindowScroll } from '@vueuse/core';

const { x, y } = useWindowScroll();

const figureStore = useFigureStore();
const { isLoaded: isFiguresLoaded } = storeToRefs(figureStore);
const dataStore = useDataStore();
const { isLoaded: isAdsLoaded, categories } = storeToRefs(dataStore);

const adjustedForInflation = ref(false);
</script>

<template>
  <div class="grid">
    <UContainer>
      <div class="py-20">
        <!-- <h1 class="font-lexend font-bold text-6xl capitalize text-center">
          A century of advertising <br />
          in the United States
        </h1> -->
      </div>
      <UiChart v-if="isAdsLoaded && isFiguresLoaded" />
    </UContainer>

    <Transition name="modal">
      <div
        v-if="y > 550"
        class="fixed z-50 top-1 left-0 w-full grid justify-center"
      >
        <div class="bg-[#E7DECC]/95 border border-white rounded-md px-2.5 py-1.5">
          <div class="grid grid-flow-col items-center gap-3 text-xs text-gray-800">
            <div
              v-for="category in categories"
              :key="`category-${category.id}`"
              class="grid grid-flow-col gap-0.5 items-center"
            >
              <div
                class="w-2.5 h-2.5 rounded-full"
                :style="{ backgroundColor: category.color }"
              />
              <div class="">
                {{ category.name }}
              </div>
            </div>
            <div class="opacity-20">|</div>
            <div class="grid grid-flow-col gap-2 items-center">
              <div class="">Adjusted for inflation</div>
              <UToggle
                v-model="adjustedForInflation"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
