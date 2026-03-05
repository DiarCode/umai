<script setup lang="ts">
import { useBasketStore } from "@/core/store/basketStore";

defineProps<{
  show: boolean
}>()

const basket = useBasketStore()
</script>

<template>
  <aside
    class="fixed top-0 right-0 h-full w-1/2 bg-white z-40 transform transition-transform duration-300"
    :class="show ? 'translate-x-0' : 'translate-x-full'"
  >
     <div class="p-4">
  <div v-if="basket.items.length === 0">
    Cart is empty
  </div>

  <div v-else class="space-y-4">
    <div
      v-for="item in basket.items"
      :key="item.id"
      class="flex justify-between items-center"
    >
      <div>
        <p class="font-bold">{{ item.name }}</p>
        <p>{{ item.price * item.quantity }} ₸</p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="basket.decrease(item.id)">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="basket.increase(item.id)">+</button>
      </div>
    </div>

    <div class="pt-4 border-t font-bold">
      Итого: {{ basket.totalPrice }} ₸
    </div>
  </div>
</div>
  </aside>
</template>