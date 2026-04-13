import { watch, type Ref } from "vue";
import { useRouter } from "vue-router";

export function useRestaurantAccessGuard(
  isOpen: Ref<boolean>,
  code: string,
  isLoading?: Ref<boolean>,
) {
  const router = useRouter();

  watch(
    [isOpen, isLoading ?? { value: false }],
    ([open, loading]) => {
      if (loading) return;

      if (open === false) {
        router.replace({
          name: "entry",
          params: { code },
        });
      }
    },
    { immediate: true },
  );
}