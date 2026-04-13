<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBasketStore } from "@/core/store/basket-store";
import { isValidImageUrl } from "../../../core/utils/url-validator";

const props = defineProps<{
  dish: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    assets: {
      photo: string | null;
      model3d: string | null;
    };
  };
}>();

const router = useRouter();
const route = useRoute();
const basketStore = useBasketStore();

// Use safe image URL after validation
const imageSrc = computed(() => {
  const url = props.dish.assets.photo;
  return isValidImageUrl(url) ? url : null;
});

const navigateToDish = () => {
  try {
    sessionStorage.setItem("menuScroll", String(window.scrollY));
  } catch (e) {
    console.warn("Scroll save failed:", e);
  }

  router.push({
    name: "dish",
    params: {
      code: route.params.code,
      id: props.dish.id,
    },
  });
};

const itemQuantityInCart = computed(() => {
  const item = basketStore.items.find((i) => String(i.id) === props.dish.id);
  return item?.quantity || 0;
});

const isInCart = computed(() => itemQuantityInCart.value > 0);

const imageLoadError = ref(false);

const handleAddToCart = (e: Event) => {
  e.stopPropagation();
  basketStore.addToCart(props.dish);
};

const handleImageError = () => {
  imageLoadError.value = true;
};
</script>

<template>
  <div
    class="dish-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    :class="{ 'ring-2 ring-orange-500 ring-offset-2': isInCart }"
    @click="navigateToDish"
  >
    <div class="relative overflow-hidden bg-gray-200 h-40">
      <div
        v-if="!imageSrc || imageLoadError"
        class="w-full h-full from-blue-200 to-purple-200 flex items-center justify-center"
      >
        <span class="text-4xl">🍽️</span>
      </div>
      <img
        v-else
        :src="imageSrc"
        :alt="props.dish.name"
        @error="handleImageError"
        class="w-full h-full object-cover"
      />

      <div
        v-if="isInCart"
        class="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
      >
        {{ itemQuantityInCart }}
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-bold text-lg truncate">{{ props.dish.name }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ props.dish.description }}
      </p>

      <div class="flex justify-between items-center">
        <span class="text-xl font-bold">{{ props.dish.price }} ₸</span>
        <button
          class="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600 transition font-bold text-lg"
          @click="handleAddToCart"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
