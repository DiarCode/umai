<script setup lang="ts">
import Humburger from '../../../assets/BurgerMenu.svg'
import Basket from '../../../assets/Basket.svg'

defineEmits(['openMenu', 'openBasket'])
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white shadow-md z-20">
    <div class="flex justify-between items-center p-4">
      <button @click="$emit('openMenu')" class="text-2xl">
        <img :src="Humburger" alt="Menu" class="w-6 h-6"/>
      </button>
      <h1 class="font-bold text-lg">Restaurant</h1>
      <button @click="$emit('openBasket')" class="text-2xl">
        <img :src="Basket" alt="Basket" class="w-6 h-6"/>
      </button>
    </div>
  </header>
</template>