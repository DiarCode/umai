<script setup lang="ts">
import { computed, onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import ButtonAdd from "../components/btn-add-cart.vue";
import { Box, Sparkles } from "lucide-vue-next";
import BtnBack from "../components/btn-back.vue";
import ActionButton from "../components/action-button.vue";
import ARViewer from "../components/ARViewer.vue";
import { useRestaurantContext } from "@/modules/entry/composables/useRestaurantContext";
import { isValidImageUrl } from "../../../core/utils/url-validator";

const route = useRoute();
const dishId = computed(() => route.params.id as string);

const { data, isLoading, code, router } = useRestaurantContext("dish");

const dishes = computed(() => {
  if (!data.value) return [];
  return data.value.categories.flatMap((category) => category.products);
});

const showAI = ref(false);
const show3D = ref(false);

onMounted(() => {
  window.scrollTo(0, 0);
});

const dish = computed(() => {
  return dishes.value.find((d) => d.id === dishId.value);
});

const safePhoto = computed(() => {
  const url = dish.value?.assets.photo;

  return isValidImageUrl(url) ? url : null;
});

const safeModel = computed(() => {
  const url = dish.value?.assets.model3d;
  return isValidImageUrl(url) ? url : null;
});

watch([isLoading, data, dish], ([loading, dataValue, dishValue]) => {
  if (!loading && dataValue && !dishValue) {
    router.replace({
      name: "not-found",
      params: { code: code.value },
      query: { type: "dish" },
    });
  }
});

const open3D = () => {
  if (!safeModel.value) {
    console.warn("3D model not available or invalid URL");
    return;
  }
  show3D.value = true;
};

const close3D = () => {
  show3D.value = false;
};

const onAIHelp = () => {
  showAI.value = true;
  alert("AI помощник пока не реализован");
};
</script>

<template>
  <div class="p-4">
    <BtnBack />
    <div v-if="isLoading" class="text-center py-20">Загрузка...</div>
    <div
      v-else-if="dish"
      class="relative h-60 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-4"
    >
      <img v-if="safePhoto" :src="safePhoto" :alt="dish?.name" class="w-full h-full object-cover" />

      <span v-else class="text-4xl">🍽️</span>
    </div>

    <h1 class="text-xl font-bold mb-1 min-[425px]:text-2xl">
      {{ dish?.name || "Название блюда" }}
    </h1>
    <!-- <h3 class="text-l font-bold mb-4">{{ dish?.weight || 'Грамовка' }} гр</h3> -->

    <div class="flex gap-4 mb-4">
      <ActionButton label="AI помощник" :icon="Sparkles" bgColor="bg-blue-500" @action="onAIHelp" />

      <ActionButton
        label="3D Model"
        :icon="Box"
        :bgColor="safeModel ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'"
        @action="open3D"
      />
    </div>

    <p class="text-gray-500 mb-15 min-[425px]:text-lg">
      {{ dish?.description || "Описание блюда" }}
    </p>

    <ButtonAdd v-if="dish" :dish="dish" />

    <ARViewer
      v-if="show3D && safeModel"
      :glb="safeModel"
      :poster="safePhoto || undefined"
      @close="close3D"
    />
  </div>
</template>
