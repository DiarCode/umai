<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

</script>

<template>
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

    <h2 class="text-2xl font-bold text-slate-900 mb-2">
      Ресторан не найден
    </h2>

    <p class="text-slate-600 mb-4">
      Ресторан с кодом
      <span class="font-mono font-semibold text-orange-600">
        {{ props.code }}
      </span>
      не существует.
    </p>
  </div>
</template>