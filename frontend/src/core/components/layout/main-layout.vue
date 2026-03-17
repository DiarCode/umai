<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import Header from "./header-app.vue";
import BurgerMenu from "./burger-menu.vue";
import CartDrawer from "./cart-drawer.vue";
import { Sheet, SheetContent } from "../ui/sheet";

const isOpenMenu = ref(false)
const isOpenBasket = ref(false)

const closeMenus = () => {
  isOpenMenu.value = false
  isOpenBasket.value = false
}
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-gray-50">
    <Header @openMenu="isOpenMenu = true" @openBasket="isOpenBasket = true" />

    <main class="pt-20 px-4">
      <RouterView />
    </main>

    <Sheet v-model:open="isOpenMenu">
      <SheetContent side="left" class="w-80 p-0">
        <BurgerMenu @close="closeMenus" />
      </SheetContent>
    </Sheet>

    <Sheet v-model:open="isOpenBasket">
      <SheetContent side="right" class="w-80 p-0">
        <CartDrawer @close="closeMenus" />
      </SheetContent>
    </Sheet>
  </div>
</template>
