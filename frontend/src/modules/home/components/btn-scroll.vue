<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ArrowUp } from "lucide-vue-next";

const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <button
    v-if="showButton"
    @click="scrollToTop"
    class="fixed bottom-6 left-4 z-50 flex items-center justify-center
           w-15 h-15 bg-black text-white rounded-full shadow-lg
           border-4 border-white"
  >
    <ArrowUp class="w-6 h-6" />
  </button>
</template>