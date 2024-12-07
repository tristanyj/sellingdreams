<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core';

const { y } = useWindowScroll();

const figureStore = useFigureStore();
const { selectArea } = figureStore;

const dataStore = useDataStore();
const { categories } = storeToRefs(dataStore);

const adjustedForInflation = ref(false);
</script>

<template>
  <div id="guide">
    <Transition name="modal">
      <div
        v-if="y > 550"
        class="fixed z-50 top-1 left-0 w-full grid justify-center"
      >
        <div class="bg-[#E7DECC]/95 border border-white rounded-md px-1 py-1">
          <div class="grid grid-flow-col items-center text-xs text-gray-800">
            <button
              v-for="category in categories"
              :key="`category-${category.id}`"
              class="grid grid-flow-col gap-0.5 items-center cursor-pointer hover:bg-gray-100/35 rounded-md px-1.5 py-0.5 transform active:scale-[0.99]"
              @click="selectArea(category.id)"
            >
              <div
                class="w-2.5 h-2.5 rounded-full"
                :style="{ backgroundColor: category.color }"
              />
              <div class="">
                {{ category.name }}
              </div>
            </button>
            <div class="opacity-20 mx-1">|</div>
            <div
              class="grid grid-flow-col gap-0.5 items-center cursor-pointer hover:bg-gray-100/35 rounded-md px-1.5 py-0.5"
            >
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
