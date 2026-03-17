<script setup lang="ts">
import { useBasketStore } from "@/core/store/basket-store"

const basket = useBasketStore()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-4 border-b">
      <div>
        <h2 class="font-bold text-lg">Корзина</h2>
        <p class="text-sm text-gray-500">{{ basket.totalCount }} товар(ов)</p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="basket.items.length === 0" class="text-center text-gray-500 py-8">
        Корзина пуста
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in basket.items"
          :key="item.id"
          class="flex justify-between items-center p-3 border rounded-lg"
        >
          <div class="flex-1">
            <p class="font-bold">{{ item.name }}</p>
            <p class="text-sm text-gray-600">{{ item.price * item.quantity }} ₸</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="basket.decrease(item.id)"
              class="px-2 py-1 hover:bg-gray-200 rounded transition"
            >
              -
            </button>
            <span class="w-6 text-center font-bold">{{ item.quantity }}</span>
            <button
              @click="basket.increase(item.id)"
              class="px-2 py-1 hover:bg-gray-200 rounded transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="basket.items.length > 0" class="border-t p-4 space-y-3">
      <div class="flex justify-between text-sm text-gray-600">
        <span>Всего товаров:</span>
        <span class="font-bold">{{ basket.totalCount }}</span>
      </div>
      <div class="font-bold text-lg flex justify-between">
        <span>Итого:</span>
        <span class="text-orange-500">{{ basket.totalPrice }} ₸</span>
      </div>
      <button
        class="w-full bg-blue-500 text-white py-2 rounded-lg transition font-medium"
      >
        Заказать
      </button>
    </div>
  </div>
</template>