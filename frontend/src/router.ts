import { createRouter, createWebHistory } from "vue-router"
import { fetchRestaurantBySlug } from "./modules/entry/services/entry-service"

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
      component: () => import("@/modules/entry/pages/not-found.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const code = to.params.code as string | undefined;

  if (!code) return next();

  if (to.name === "not-found") return next();

  try {
    const restaurant = await fetchRestaurantBySlug(code);

    if (!restaurant) {
      return next({ name: "not-found", params: { code, type: "restaurant" } });
    }

    if (restaurant.status !== "open" && (to.name === "menu" || to.name === "dish")) {
      return next({ name: "entry", params: { code } });
    }

    if (to.name === "dish") {
      const dishId = to.params.id as string | undefined

      if (!dishId) return next({ name: "not-found", params: { code } });

      const allProducts = restaurant.categories?.flatMap(cat => cat.products ?? []) ?? [];
      const productExists = allProducts.some(p => String(p.id) === dishId)

      if (!productExists) {
        return next({
          name: "not-found",
          params: { code },
          query: { type: "dish", id: dishId },
        })
      }
    }

    next();
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return next({ name: "not-found", params: { code, type: "restaurant" } })
  }
});

export default router;