import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useRestaurantQuery } from "./use-restaurant-query";
import { useRestaurantErrorRedirect } from "./use-restaurant-error-redirect";
import { useRestaurantAccessGuard } from "./use-restaurant-access-guard";

export function useRestaurantContext(type: "restaurant" | "dish" = "restaurant") {
  const route = useRoute();
  const router = useRouter();

  const code = computed(() => String(route.params.code || ""));

  const query = useRestaurantQuery(code.value);

  useRestaurantErrorRedirect(query.error, code.value, type);
  useRestaurantAccessGuard(query.isOpen, code.value, query.isLoading);

  return {
    ...query,
    code,
    router,
  };
}
