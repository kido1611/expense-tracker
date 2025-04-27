export const useDashboardSidebarStore = defineStore("dashboard-sidebar", () => {
  const isVisible = ref<boolean>(false);

  const open = () => {
    isVisible.value = true;
  };

  const close = () => {
    isVisible.value = false;
  };

  const toggle = () => {
    isVisible.value = !isVisible.value;
  };

  return {
    isVisible,
    open,
    close,
    toggle,
  };
});
