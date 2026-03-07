<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleNavigation = async (path: string) => {
  await router.push(path)
  emit('close')
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
          @click="handleNavigation('/')"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium"
        >
          Главная страница
        </button>
        <button
          @click="handleNavigation('/contacts')"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium"
        >
          Наши контакты
        </button>
      </div>
    </nav>
  </div>
</template>