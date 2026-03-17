<script setup lang="ts">
import { computed} from 'vue'
import { useRouter, useRoute } from "vue-router";
import { useBasketStore } from "@/core/store/basket-store";

const props = defineProps<{
  dish: {
    id: number
    name: string
    description: string
    price: number
    image?: string
    model3d?: string
    categoryId: string
  }
}>()

const router = useRouter()
const route = useRoute()
const basketStore = useBasketStore()

const navigateToDish = () => {
  sessionStorage.setItem("menuScroll", String(window.scrollY))

  router.push({
    name: "dish",
    params: {
      code: route.params.code,
      id: props.dish.id
    }
  })
}

const itemQuantityInCart = computed(() => {
  const item = basketStore.items.find(i => i.id === props.dish.id)
  return item?.quantity || 0
})

const isInCart = computed(() => itemQuantityInCart.value > 0)

const handleAddToCart = (e: Event) => {
  e.stopPropagation()
  basketStore.addToCart(props.dish)
}

</script>

<template>
  <div
    class="dish-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    :class="{ 'ring-2 ring-orange-500 ring-offset-2': isInCart }"
    @click="navigateToDish"
  >
    <div class="relative overflow-hidden bg-gray-200 h-40">
      <div
        v-if="!props.dish.image"
        class="w-full h-full from-blue-200 to-purple-200 flex items-center justify-center"
      >
        <span class="text-4xl">🍽️</span>
      </div>
      <img
        v-else
        :src="props.dish.image"
        :alt="props.dish.name"
        @error="props.dish.image = undefined"
        class="w-full h-full object-cover"
      />
      
      <div
        v-if="isInCart"
        class="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
      >
        {{ itemQuantityInCart }}
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-bold text-lg truncate">{{ dish.name }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ dish.description }}
      </p>

      <div class="flex justify-between items-center">
        <span class="text-xl font-bold">{{ dish.price }} ₸</span>
        <button
          class="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600 transition font-bold text-lg"
          @click="handleAddToCart"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
