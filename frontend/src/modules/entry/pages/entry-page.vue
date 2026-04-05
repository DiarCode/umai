<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRestaurantQuery } from '../composables/use-restaurant-query'
import RestaurantInfo from '../components/restaurant-info.vue'

const route = useRoute()
const router = useRouter()
const code = String(route.params.code || '')

const { data, isLoading, isOpen } = useRestaurantQuery(code)


const openMenu = () => {
  if (!isOpen.value) return
  router.push({ name: 'menu', params: { code: code } })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <p class="text-gray-600 text-lg font-semibold">⏳ Загрузка...</p>
    </div>
    <div v-else-if="data" class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <RestaurantInfo :restaurantData="data" />

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
