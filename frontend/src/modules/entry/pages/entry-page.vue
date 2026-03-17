<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRestaurant } from '../composables/use-restaurant'
import RestaurantInfo from '../components/restaurant-info.vue'

const route = useRoute()
const router = useRouter()
const code = String(route.params.code || '')

const { restaurant, isFound, isOpen } = useRestaurant(code)

const openMenu = () => {
  if (!isFound.value || !isOpen.value) return
  router.push({ name: 'menu', params: { code } })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <RestaurantInfo :restaurantData="restaurant!" />

      <p v-if="isOpen" class="text-green-600 mt-4">Ресторан открыт</p>
      <p v-else class="text-red-600 mt-4">Ресторан закрыт</p>

      <button
        :disabled="!isOpen"
        @click="openMenu"
        class="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-black disabled:bg-gray-300"
      >
        Открыть меню
      </button>
    </div>
  </div>
</template>