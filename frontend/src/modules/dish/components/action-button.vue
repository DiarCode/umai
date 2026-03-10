<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  label: string;
  icon: Component;
  bgColor: string;
}>();
</script>

<template>
  <button
    class="flex-1 text-white rounded-3xl flex items-center justify-center
           px-2 py-1 sm:px-4 sm:py-2"
    :class="bgColor"
  >
    <component :is="icon" class="w-4 h-4 sm:w-6 sm:h-6" />
    <span class="ml-1 text-xs sm:ml-2 sm:text-base truncate">{{ label }}</span>
  </button>
</template>