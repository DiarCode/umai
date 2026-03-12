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
           px-2 py-1 text-xs
           min-[425px]:px-4 min-[425px]:py-2 min-[425px]:text-base"
    :class="bgColor"
  >
    <component
      :is="icon"
      class="w-4 h-4 min-[425px]:w-6 min-[425px]:h-6"
    />

    <span
      class="ml-1 truncate
             min-[425px]:ml-2"
    >
      {{ label }}
    </span>
  </button>
</template>