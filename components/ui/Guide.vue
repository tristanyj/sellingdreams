<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core';
import { AD_CATEGORIES } from '~/assets/scripts/constants';
import type { CategoryKey } from '~/types';

const { y } = useWindowScroll();

const figureStore = useFigureStore();
const { selectedArea } = storeToRefs(figureStore);
const { selectArea } = figureStore;

const interactionStore = useInteractionStore();
const { selectedAd } = storeToRefs(interactionStore);
const { setTooltipCategory } = interactionStore;

const dataStore = useDataStore();
const { categories } = storeToRefs(dataStore);

const onMouseEnter = (id: CategoryKey) => {
  const category = categories.value.find((cat) => cat.id === id);
  if (!category) return;

  setTooltipCategory({
    id: id,
    name: category.name,
    description: category.description,
    color: category.color,
    center: true,
  });

  if (selectedArea.value) return;
  const ids = AD_CATEGORIES.filter((cat) => cat !== id);
  ids.forEach((id) => document.querySelector(`#category-area-${id}`)?.classList.add('muted'));
};

const onMouseLeave = () => {
  setTooltipCategory(null);

  if (selectedArea.value) return;
  document.querySelectorAll('.category-area').forEach((el) => el.classList.remove('muted'));
};

const isOpen = computed(() => !selectedAd.value && y.value > 750);
</script>

<template>
  <div id="guide">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed z-20 top-1 left-0 w-full grid justify-center"
      >
        <div class="bg-[#E7DECC]/95 border border-black/25 rounded-md px-1 py-1">
          <div class="grid grid-flow-col items-center text-xs text-gray-800">
            <div class="hidden lg:grid grid-flow-col items-center">
              <button
                v-for="category in categories"
                :key="`category-${category.id}`"
                class="grid grid-flow-col gap-0.5 items-center cursor-pointer hover:bg-gray-100/30 rounded-md px-1.5 py-0.5"
                :class="{ 'bg-gray-100/40': category.id === selectedArea }"
                @click="selectArea(selectedArea === category.id ? null : category.id)"
                @mouseenter="onMouseEnter(category.id)"
                @mouseleave="onMouseLeave"
              >
                <div
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ backgroundColor: category.color }"
                />
                <div class="">
                  {{ category.name }}
                </div>
              </button>
            </div>
            <div class="hidden lg:grid opacity-20 mx-1">|</div>
            <div class="grid grid-flow-col gap-0.5 items-center">
              <UiToggleFigureMode
                size="sm"
                class="hover:bg-gray-100/35 rounded-md px-1 py-0.5"
              />
              <UiTogglePerformanceMode
                size="sm"
                class="hover:bg-gray-100/35 rounded-md px-1 py-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
