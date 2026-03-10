<script setup lang="ts">
import { ref, computed } from "vue";
import DiscountCard from "../components/discount-card.vue";
import DishCard from "../components/dish-card.vue";
import CategoriesSlider from "../components/categories-slider.vue";
import { mockCategories } from "../services/categories.service";
import { mockMenu } from "../../dish/services/menu.service";
import {Flame} from 'lucide-vue-next'
import { onMounted } from "vue";

onMounted(() => {
  const savedScroll = sessionStorage.getItem("menuScroll");

  if (savedScroll) {
    window.scrollTo(0, Number(savedScroll));
    sessionStorage.removeItem("menuScroll");
  }
});

const activeCategory = ref("all");
const dishes = ref(mockMenu);

const filteredDishes = computed(() => {
  const allDishes = dishes.value ?? [];

  if (activeCategory.value === "all") {
    return allDishes;
  }

  return allDishes.filter((dish) => dish.categoryId === activeCategory.value);
});
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
        <h2 class="text-lg font-bold bg-gray-50 r">Специальные предложения</h2>
      </div>
      <DiscountCard />
    </section>

    <section>
      <h2 class="text-lg font-bold mb-3">Категории</h2>
      <CategoriesSlider v-model="activeCategory" :categories="mockCategories" />
    </section>

    <section>
      <div class="grid grid-cols-2 gap-4">
        <DishCard v-for="dish in filteredDishes" :key="dish.id" :dish="dish" />
      </div>
    </section>
  </div>
</template>
