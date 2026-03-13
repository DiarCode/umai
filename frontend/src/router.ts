import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/restaurant/:code',
      name: 'entry',
      component: () => import('@/modules/entry/pages/entry-page.vue')
    },
    {
      path: '/restaurant/:code/menu',
      component: () => import('@/core/components/layout/main-layout.vue'),
      children: [
        {
          path: '',             
          name: 'menu',
          component: () => import('@/modules/home/pages/home-page.vue')
        }
      ]
    },
    {
      path: '/restaurant/:code/dish/:id',
      component: () => import('@/core/components/layout/main-layout.vue'),
      children: [
        {
          path: '',              
          name: 'dish',
          component: () => import('@/modules/dish/pages/dish-page.vue')
        }
      ]
    }
  ],
})

export default router