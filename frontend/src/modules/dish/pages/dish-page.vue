<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mockMenu } from "../services/menu.service";
import ButtonAdd from "../components/btn-add-cart.vue";
import { Box, Sparkles } from "lucide-vue-next";
import BtnBack from "../components/btn-back.vue";
import ActionButton from "../components/action-button.vue";

const route = useRoute();

const dishId = route.params.id as string;

onMounted(() => {
  window.scrollTo(0, 0);
});

const dish = computed(() => {
  return mockMenu.find((d) => String(d.id) === dishId);
});
</script>

<template>
  <div class="p-4">
    <BtnBack />
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

    <h1 class="text-xl font-bold mb-1 min-[425px]:text-2xl">{{ dish?.name || "Название блюда" }}</h1>
    <h3 class="text-l font-bold mb-4">{{ dish?.weight || "Грамовка" }} гр</h3>
    <div class="flex gap-4 mb-4">
      <ActionButton label="AI помощник" :icon="Sparkles" bgColor="bg-blue-500" />
      <ActionButton label="3D Model" :icon="Box" bgColor="bg-black" />
    </div>
    <p class="text-gray-500 mb-15 min-[425px]:text-lg">{{ dish?.description || "Описание блюда" }}</p>

    <ButtonAdd v-if="dish" :dish="dish!" />
  </div>
</template>
