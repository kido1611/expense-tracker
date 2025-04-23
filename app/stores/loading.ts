export const useLoadingStore = defineStore("global-loading", () => {
  const isLoading = ref<boolean>(false);

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    isLoading,
    setLoading,
  };
});
