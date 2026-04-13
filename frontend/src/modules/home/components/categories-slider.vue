<script setup lang="ts">
const props = defineProps<{
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  modelValue: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();
</script>

<template>
  <div class="flex gap-3 overflow-x-auto pb-2">
    <button
      @click="emit('update:modelValue', null)"
      :class="[
        'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all',
        props.modelValue === null ? 'bg-orange-500 text-white' : 'bg-black text-white',
      ]"
    >
      Все
    </button>
    <button
      v-for="category in props.categories"
      :key="category.id"
      @click="emit('update:modelValue', category.slug)"
      :class="[
        'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all',
        props.modelValue === category.slug ? 'bg-orange-500 text-white' : 'bg-black text-white',
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>
