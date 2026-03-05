<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBasketStore } from "@/core/store/basketStore";

const props = defineProps<{
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    model3d?: string;
    categoryId: string;
  };
}>();

const router = useRouter()
const basketStore = useBasketStore();

const navigateToDish = () => {
  router.push(`/dish/${props.dish.id}`)
};

</script>

<template>
  <div
    class="dish-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    @click="navigateToDish"
  >
    <div class="relative overflow-hidden bg-gray-200 h-40">
      <div
        v-if="!props.dish.image"
        class="w-full h-full from-blue-200 to-purple-200 flex items-center justify-center"
      >
        <span class="text-4xl">🍽️</span>
      </div>
      <img
        v-else
        :src="props.dish.image"
        :alt="props.dish.name"
        @error="props.dish.image = undefined"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg truncate">{{ dish.name }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ dish.description }}
      </p>
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold">{{ dish.price }} ₸</span>
        
        <button
          class="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600"
          @click.stop ="basketStore.addToCart(props.dish)" 
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

