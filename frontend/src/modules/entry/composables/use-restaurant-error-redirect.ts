import { watch, type Ref } from "vue";
import { useRouter } from "vue-router";
import { ApiError, isNotFoundError, isServerError } from "@/api/errorHandler";

type RedirectType = "restaurant" | "dish";

export function useRestaurantErrorRedirect(
  error: Ref<unknown>,
  code: string,
  type: RedirectType = "restaurant",
) {
  const router = useRouter();

  watch(
    error,
    (err) => {
      if (!err) return;

      const status = (err as ApiError).status;

      if (status === 404 || isNotFoundError(err)) {
        router.replace({
          name: "not-found",
          params: { code },
          query: { type },
        });
        return;
      }

      if (status === 500 || isServerError(err)) {
        router.replace({
          name: "server-error",
        });
        return;
      }

      router.replace({
        name: "server-error",
      });
    },
    { immediate: true },
  );
}
