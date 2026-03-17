<script setup lang="ts">
import { computed } from "vue";
import { useBasketStore } from "@/core/store/basket-store";

const props = defineProps<{
  dish: {
    id: number
    name: string
    price: number
  }
}>()

const basketStore = useBasketStore()

const quantity = computed(() => {
  const item = basketStore.items.find((i) => i.id === props.dish.id)
  return item?.quantity || 0
})
</script>

<template>
  <div class="fixed bottom-4 left-4 right-4 min-[425px]:left-6 min-[425px]:right-6">
    
    <div v-if="quantity === 0">
      <button
        class="w-full bg-black text-white 
               py-3 px-3 text-sm 
               min-[425px]:py-4 min-[425px]:px-6 min-[425px]:text-base
               rounded-2xl"
        @click="basketStore.addToCart(props.dish)"
      >
        Добавить {{ props.dish.price }} ₸
      </button>
    </div>

    <div
      v-else
      class="flex items-center justify-between 
             bg-orange-600 text-white 
             py-3 px-3 text-sm
             min-[425px]:py-4 min-[425px]:px-6 min-[425px]:text-base
             rounded-2xl"
    >
      <button
        @click="basketStore.decrease(props.dish.id)"
        class="text-lg px-2 min-[425px]:text-xl min-[425px]:px-4"
      >
        -
      </button>

      <div class="flex items-center">
        <span>{{ quantity }}</span>
        <span class="mx-2 min-[425px]:mx-4">x</span>
        <span>{{ props.dish.price }} ₸</span>
      </div>

      <button
        @click="basketStore.increase(props.dish.id)"
        class="text-lg px-2 min-[425px]:text-xl min-[425px]:px-4"
      >
        +
      </button>
    </div>

  </div>
</template>