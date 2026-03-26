<script setup lang="ts">
import type { Restaurant } from '../types/entry.type'

defineProps<{
  restaurantData: Restaurant
}>()
</script>

<template>
  <div class="text-center">
    <div
      v-if="restaurantData.logo"
      class="w-24 h-24 bg-white rounded-full mx-auto mb-4 overflow-hidden border"
    >
      <img
        :src="restaurantData.logo"
        :alt="restaurantData.name"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      v-else
      class="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center shadow-md border-4 border-slate-100"
    >
      <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </svg>
    </div>
    <h1 class="text-3xl font-bold text-slate-900 mb-2">
      {{ restaurantData.name }}
    </h1>
    <p class="text-slate-600 text-sm">
      {{ restaurantData.description || 'Описание недоступно' }}
    </p>
  </div>
</template>
