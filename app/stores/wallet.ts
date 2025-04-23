export const useWalletAdjustBalanceDialogStore = defineStore(
  "wallet-adjust-balance",
  () => {
    const isVisible = ref<boolean>(false);
    const selectedWallet = ref<string | undefined | null>(null);

    const open = (walletId: string) => {
      selectedWallet.value = walletId;
      isVisible.value = true;
    };
    const close = () => {
      isVisible.value = false;
      selectedWallet.value = null;
    };

    return {
      isVisible,
      selectedWallet,
      open,
      close,
    };
  },
);
