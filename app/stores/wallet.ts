export const useWalletAdjustBalanceDialogStore = defineStore(
  "wallet-adjust-balance-dialog",
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

export const useWalletTransferDialogStore = defineStore(
  "wallet-transfer-dialog",
  () => {
    const isVisible = ref<boolean>(false);
    const selectedWallet = ref<string | undefined | null>(null);

    const open = (walletId: string | undefined | null) => {
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

export const useWalletDialogStore = defineStore("wallet-dialog", () => {
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
});
