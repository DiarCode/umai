<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  label: string
  icon: Component
  bgColor: string
}>()

const emit = defineEmits<{
  (e: "action"): void
}>()

function handleClick() {
  emit("action")}
</script>

<template>
  <button
    type="button"
    @click="handleClick"
    class="flex-1 text-white rounded-3xl flex items-center justify-center px-2 py-1"
    :class="bgColor"
  >
    <component :is="icon" class="w-4 h-4" />
    <span class="ml-1 truncate">
      {{ label }}
    </span>
  </button>
</template>
