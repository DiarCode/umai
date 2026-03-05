<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits(['click'])
</script>

<template>
  <div
    v-if="show"
    @click="$emit('click')"
    class="fixed inset-0 bg-black/30 z-30"
  />
</template>