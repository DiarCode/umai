<script setup lang="ts">
defineProps<{
  show: boolean
}>()

</script>

<template>
  <aside
    class="fixed top-0 right-0 h-full w-1/2 bg-white z-40 transform transition-transform duration-300"
    :class="show ? 'translate-x-0' : 'translate-x-full'"
  >
      <div class="mt-6 p-4">
        <p>Cart is empty</p>
      </div>
  </aside>
</template>