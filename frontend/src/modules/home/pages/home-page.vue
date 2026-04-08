<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DiscountCard from '../components/discount-card.vue'
import DishCard from '../components/dish-card.vue'
import CategoriesSlider from '../components/categories-slider.vue'
import BtnScroll from '../components/btn-scroll.vue'
import { Flame } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRestaurantQuery } from '@/modules/entry/composables/use-restaurant-query'
import {watchEffect} from 'vue'


const route = useRoute()
const code = String(route.params.code)
const {data} = useRestaurantQuery(code || '')


onMounted(() => {
  const savedScroll = sessionStorage.getItem('menuScroll')

  if (savedScroll) {
    window.scrollTo(0, Number(savedScroll))
    sessionStorage.removeItem('menuScroll')
  }
})

const activeCategory = ref('all')

const categories = computed(() => data.value?.categories || [])
watchEffect(() => {
  console.log("Категории из запроса :", categories.value)
})      

const dishes = computed(() => {
  return categories.value.flatMap(category =>
    (category.products || []).map(product => ({
      ...product,
      categorySlug: category.slug 
    }))
  )
})

watchEffect(() => {
  console.log("Все блюда :", dishes.value)
})

const filteredDishes = computed(() => {
  if (activeCategory.value === 'all') {
    return dishes.value
  }

  return dishes.value.filter(
    dish => dish.categorySlug === activeCategory.value
  )
})

</script>

<template>
  <div class="space-y-8 bg-gray-50">
    <section>
      <h1 class="text-4xl font-bold">Привет! 👋</h1>
      <p class="text-lg mt-1.5">Что желаете заказать сегодня?</p>
    </section>

    <section>
      <div class="flex items-center mr-3">
        <Flame class="w-5 h-5 inline-block mr-1" />
        <h2 class="text-lg font-bold bg-gray-50">Специальные предложения</h2>
      </div>
      <DiscountCard />
    </section>

    <section>
      <h2 class="text-lg font-bold mb-3">Категории</h2>
      <CategoriesSlider v-model="activeCategory" :categories="categories" />
    </section>

    <section>
      <div class="grid grid-cols-2 gap-4">
        <DishCard v-for="dish in filteredDishes" :key="dish.id" :dish="dish" />
      </div>
    </section>
    <BtnScroll />
  </div>
</template>
