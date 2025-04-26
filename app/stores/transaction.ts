export const useTransactionDialogStore = defineStore(
  "transaction-dialog",
  () => {
    const isVisible = ref<boolean>(false);

    const open = () => {
      isVisible.value = true;
    };

    const close = () => {
      isVisible.value = false;
    };

    return {
      isVisible,
      open,
      close,
    };
  },
);
