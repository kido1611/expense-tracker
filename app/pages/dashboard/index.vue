<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const {
  isSlideoverVisible: isWalletTransferSlideoverVisible,
  selectedWallet: selectedWalletTransfer,
  open: openWalletTransfer,
} = useWalletTransfer();

function useWalletTransfer() {
  const isSlideoverVisible = ref<boolean>(false);
  const selectedWallet = ref<string | null>(null);

  function open(walletId: string) {
    isSlideoverVisible.value = true;
    selectedWallet.value = walletId;
  }

  return {
    isSlideoverVisible,
    selectedWallet,
    open,
  };
}
</script>

<template>
  <UContainer>
    <div class="mt-8 flex flex-row flex-wrap gap-4">
      <WalletSlideover />
      <TransactionSlideover />
      <WalletTransferSlideover
        v-model:selected="selectedWalletTransfer"
        v-model:is-visible="isWalletTransferSlideoverVisible"
      />
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 py-8">
      <IndexWalletList @transfer="openWalletTransfer" />
      <IndexTransactionList />
    </div>
  </UContainer>
</template>
