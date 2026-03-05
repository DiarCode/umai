// import { createRouter, createWebHistory } from 'vue-router'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'menu',
//       component: () => import('@/modules/menu/pages/menu-page.vue'),
//     },
//   ],
// })

// export default router
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: () => import('@/core/components/layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'menu',
          component: () => import('@/modules/home/pages/HomePage.vue'),
        },
        {
          path: 'dish/:id',
          name: 'dish',
          component: () => import('@/modules/dish/pages/DishPage.vue'),
        }
      ]
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

export default router