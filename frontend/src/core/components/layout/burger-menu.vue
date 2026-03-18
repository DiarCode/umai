<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const code = computed(() => route.params.code as string)

const handleNavigation = async (routeName: string) => {
try {
    await router.push({
      name: routeName,
      params: { code: code.value } 
    })
  } finally {
    emit('close')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="font-bold text-lg">Меню</h2>
    </div>

    <nav class="flex-1 overflow-y-auto">
      <div class="space-y-2 p-4">
        <button
          @click="handleNavigation('menu')"
          class="w-full text-left px-4 py-2 rounded-lg transition font-medium"
        >
          Главная страница
        </button>

        <h1 class="w-full text-left px-4 py-2 rounded-lg transition font-medium">
          Наши контакты
        </h1>
      </div>
    </nav>
  </div>
</template>
