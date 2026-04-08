<script setup lang="ts">
const props = defineProps<{
  categories: {
    id: string
    name: string
     slug: string
  }[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectCategory = (slug: string) => {
  emit('update:modelValue', slug)
}
</script>

<template>
  <div class="flex gap-3 overflow-x-auto pb-2">
    <button
      v-for="category in props.categories"
      :key="category.id"
      @click="selectCategory(String(category.slug))"
      :class="[
        'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all',
        props.modelValue === String(category.slug)
          ? 'bg-orange-500 text-white'
          : 'bg-black text-white',
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>
