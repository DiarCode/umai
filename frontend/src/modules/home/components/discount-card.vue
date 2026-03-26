<template>
  <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
    <div
      v-for="i in 5"
      :key="i"
      class="min-w-[250px] discount-card bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white shadow"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-2xl font-bold mb-2">Скидка 20%</h3>
          <p class="text-sm opacity-90">На первый заказ</p>
        </div>
        <div class="text-4xl font-bold opacity-80">🎉</div>
      </div>
      <p class="text-xs mt-4 opacity-75">Код: WELCOME20</p>
    </div>
  </div>
</template>

<style scoped>
.discount-card {
  transition: transform 0.3s ease;
}

.discount-card:hover {
  transform: translateY(-4px);
}
</style>
