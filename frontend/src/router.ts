import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: () => import('@/core/components/layout/main-layout.vue'),
      children: [
        {
          path: '',
          name: 'menu',
          component: () => import('@/modules/home/pages/home-page.vue'),
        },
        {
          path: 'dish/:id',
          name: 'dish',
          component: () => import('@/modules/dish/pages/dish-page.vue'),
        }
      ]
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

export default router