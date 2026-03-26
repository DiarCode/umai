<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const code = String(route.params.code || '')
const type = String(route.query.type || 'restaurant')
const dishId = String(route.query.id || '')

const title = type === 'dish' ? 'Блюдо не найдено' : 'Ресторан не найден'
const message =
  type === 'dish'
    ? `Блюдо с ID ${dishId} не существует в этом ресторане.`
    : `Ресторан с кодом ${code} не существует.`
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ title }}</h2>

      <p class="text-slate-600 mb-4">
        {{ message }}
      </p>

      <button
        v-if="type === 'dish'"
        @click="$router.push({ name: 'menu', params: { code } })"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Вернуться в меню
      </button>
    </div>
  </div>
</template>
