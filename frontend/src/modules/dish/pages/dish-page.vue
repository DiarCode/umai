<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { mockMenu } from "../services/menu.service";
import ButtonAdd from "../components/btn-add-page.vue";
import { Box, Sparkles} from 'lucide-vue-next'


const router = useRoute();
const dishId = router.params.id as string;

const dish = computed(() => {
  return mockMenu.find((d) => String(d.id) === dishId);
});
</script>

<template>
  <div class="p-4">
    <div
      class="relative h-60 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-4"
    >
      <img
        v-if="dish?.image"
        :src="dish.image"
        :alt="dish.name"
        class="w-full h-full object-cover"
      />
      <span v-else class="text-4xl">🍽️</span>
    </div>

    <h1 class="text-xl font-bold mb-1">{{ dish?.name || "Название блюда" }}</h1>
    <h3 class="text-l font-bold mb-4">{{ dish?.weight || "Грамовка" }} гр</h3>
    <div class="flex gap-4 mb-4">
      <button
        class="flex-1 bg-blue-500 text-white rounded-4xl px-4 py-2 flex items-center justify-center"
      >
        <Sparkles class="w-6 h-6" />
        <span class="ml-2">AI помощник</span>
      </button>

      <button
        class="flex-1 bg-black text-white rounded-4xl px-4 py-2 flex items-center justify-center"
      >
        <Box class="w-6 h-6" />
        <span class="ml-2">3D Model</span>
      </button>
    </div>
    <p class="text-gray-500 mb-15">{{ dish?.description || "Описание блюда" }}</p>

    <ButtonAdd v-if="dish" :dish="dish!" />
  </div>
</template>
