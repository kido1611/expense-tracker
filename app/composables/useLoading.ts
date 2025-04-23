import { useLoadingStore } from "~/stores/loading";

export const useLoading = () => {
  const store = useLoadingStore();
  const { isLoading } = storeToRefs(store);
  const readonlyLoading = readonly(isLoading);
  const { setLoading } = store;

  return {
    isLoading: readonlyLoading,
    mutableIsLoading: isLoading,
    setLoading,
  };
};
