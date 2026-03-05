<script setup lang="ts">
import {ref} from 'vue'
import { RouterView } from 'vue-router'
import Header from './Header.vue'
import BurgerMenu from './BurgerMenu.vue'
import CartDrawer from './CartDrawer.vue'
import Overlay from './Overlay.vue'

const isOpenMenu = ref(false)
const isOpenBasket = ref(false)

const closeAll = () =>{
  isOpenMenu.value = false
  isOpenBasket.value = false
}
</script>

<template>
<div class="min-h-screen overflow-hidden">
  <Header @openMenu="isOpenMenu = true" @openBasket="isOpenBasket = true"/>
  <main class="pt-20 px-4">
     <RouterView />
  </main>
  <Overlay :show="isOpenMenu || isOpenBasket" @click="closeAll"/>
  <BurgerMenu :show="isOpenMenu"/>
  <CartDrawer :show="isOpenBasket"/>
</div>
</template>