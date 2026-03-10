<script setup lang="ts">
import { computed } from "vue";
import { useBasketStore } from "@/core/store/basket-store";

const props = defineProps<{
  dish: {
    id: number;
    name: string;
    price: number;
  };
}>();

const basketStore = useBasketStore();

const quantity = computed(() => {
  const item = basketStore.items.find((i) => i.id === props.dish.id);
  return item?.quantity || 0;
});
</script>

<template>
  <div class="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6">
    <div v-if="quantity === 0">
      <button
        class="w-full bg-black text-white py-3 px-3 sm:py-4 sm:px-6 rounded-2xl text-sm sm:text-base"
        @click="basketStore.addToCart(props.dish)"
      >
        Добавить {{ props.dish.price }} ₸
      </button>
    </div>

    <div
      v-else
      class="flex items-center justify-between bg-orange-600 text-white py-3 px-3 sm:py-4 sm:px-6 rounded-2xl text-sm sm:text-base"
    >
      <button @click="basketStore.decrease(props.dish.id)" class="text-lg sm:text-xl px-2 sm:px-4">-</button>
      
      <div class="flex items-center">
        <span>{{ quantity }}</span>
        <span class="mx-2 sm:mx-4">x</span>
        <span>{{ props.dish.price }} ₸</span>
      </div>
      
      <button @click="basketStore.increase(props.dish.id)" class="text-lg sm:text-xl px-2 sm:px-4">+</button>
    </div>
  </div>
</template>