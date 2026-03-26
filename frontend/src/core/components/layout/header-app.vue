<script setup lang="ts">
import { Menu, ShoppingCart } from 'lucide-vue-next'
import { useBasketStore } from '@/core/store/basket-store'

const basket = useBasketStore()

const emit = defineEmits<{
  (e: 'openMenu'): void
  (e: 'openBasket'): void
}>()
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white shadow-md z-40">
    <div class="flex justify-between items-center p-4">
      <button @click="emit('openMenu')" class="p-2 hover:bg-gray-100 rounded-lg transition">
        <Menu class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg">Restaurant</h1>
      <button
        @click="emit('openBasket')"
        class="p-2 hover:bg-gray-100 rounded-lg transition relative"
      >
        <ShoppingCart class="w-6 h-6" />
        <div
          v-if="basket.totalCount > 0"
          class="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
        >
          {{ basket.totalCount }}
        </div>
      </button>
    </div>
  </header>
</template>
