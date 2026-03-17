import { createRouter, createWebHistory } from "vue-router"
import { restaurants } from "./modules/entry/services/entry-service"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/restaurant/:code",
      name: "entry",
      component: () => import("@/modules/entry/pages/entry-page.vue"),
    },
    {
      path: "/restaurant/:code/menu",
      component: () => import("@/core/components/layout/main-layout.vue"),
      children: [
        {
          path: "",
          name: "menu",
          component: () => import("@/modules/home/pages/home-page.vue"),
        },
      ],
    },
    {
      path: "/restaurant/:code/dish/:id",
      component: () => import("@/core/components/layout/main-layout.vue"),
      children: [
        {
          path: "",
          name: "dish",
          component: () => import("@/modules/dish/pages/dish-page.vue"),
        },
      ],
    },
    {
      path: "/not-found/:code",
      name: "not-found",
      component: () => import("@/modules/entry/pages/not-found.vue"), // проверь, что файл тут
    },
  ],
})
router.beforeEach((to, from, next) => {
  const code = to.params.code as string | undefined

  if (to.name === 'not-found') {
    return next()
  }

  if (!code) return next()

  const restaurant = restaurants.find(r => String(r.code).toLowerCase() === code.toLowerCase())

  if (!restaurant) {
    return next({ name: 'not-found', params: { code } })
  }

  if (restaurant.status === 'closed' && (to.name === 'menu' || to.name === 'dish')) {
    return next(`/restaurant/${code}`)
  }

  next()
})
export default router