<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps<{
  show: boolean
}>()
const router = useRouter()
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-1/2 bg-white z-40 transform transition-transform duration-300"
    :class="show ? 'translate-x-0' : '-translate-x-full'"
  >
      <div class="mt-6 space-y-4 p-4">
        <p @click="router.push('/')">Home</p>
        <p>Contacts</p>
      </div>
  </aside>
</template>