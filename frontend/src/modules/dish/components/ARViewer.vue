<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  glb?: string
  poster?: string
}>()

const modelViewerRef = ref<HTMLElement | null>(null)
const loading = ref(true)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <model-viewer
    ref="modelViewerRef"
    v-if="props.glb"
    :src="props.glb"
    :poster="props.poster"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    auto-rotate
    scale="0.5 0.5 0.5"
    style="
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      background: #000;
    "
    @load="loading = false"
    @click="loading = false"
    @ar-status-changed="loading = false"
  >
    <div
      v-if="loading"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black"
    >
      <span class="text-white text-lg">Loading 3D...</span>
    </div>
    <button
      @click="emit('close')"
      class="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 text-xl flex items-center justify-center z-50"
    >
      ✕
    </button>
  </model-viewer>
</template>
<style scoped>
model-viewer::part(default-ar-button) {
  width: 48px;
  height: 48px;
  background: #fff;
  color: #000;
  border-radius: 12px;
  padding: 8px 12px;
  position: absolute;
  right: 16px;
  bottom: 100px;
}
</style>
