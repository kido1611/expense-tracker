<script setup lang="ts">
import { useWalletAdjustBalanceDialogStore } from "~/stores/wallet";

const { isLoading } = useLoading();

const walletAdjustBalanceStore = useWalletAdjustBalanceDialogStore();
const { isVisible, selectedWallet } = storeToRefs(walletAdjustBalanceStore);
const { close } = walletAdjustBalanceStore;
</script>

<template>
  <USlideover
    v-model:open="isVisible"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Adjust Balance"
  >
    <template #body>
      <LazyWalletAdjustBalanceForm
        hydrate-on-visible
        :wallet-id="selectedWallet ?? ''"
        @close="close"
      />
    </template>
  </USlideover>
</template>
