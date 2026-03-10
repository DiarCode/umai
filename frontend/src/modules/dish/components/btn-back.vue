<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

const router = useRouter();
const route = useRoute(); 

const code = route.params.code as string;

const goBack = () => {
  router.push({
    name: "menu",
    params: { code },
  });
};
</script>
<template>
    <button
      @click="goBack"
      class="fixed top-20 right-4 z-50 flex items-center justify-center w-11 h-11 bg-black rounded-full shadow-lg border-4 border-white text-white"
    >
      <ArrowLeft class="w-6 h-6" />
    </button>
</template>