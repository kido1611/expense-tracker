<script setup lang="ts">
import { useWalletTransferDialogStore } from "~/stores/wallet";

const { isLoading } = useLoading();

const store = useWalletTransferDialogStore();
const { isVisible, selectedWallet } = storeToRefs(store);
const { close } = store;
</script>

<template>
  <USlideover
    v-model:open="isVisible"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Transfer Wallet"
  >
    <template #body>
      <LazyWalletTransferForm
        hydrate-on-visible
        :selected-wallet-id="selectedWallet"
        @close="close"
      />
    </template>
  </USlideover>
</template>
