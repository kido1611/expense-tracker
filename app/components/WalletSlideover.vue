<script setup lang="ts">
import { useWalletDialogStore } from "~/stores/wallet";

const { isLoading } = useLoading();

const store = useWalletDialogStore();
const { isVisible } = storeToRefs(store);
const { close } = store;
</script>

<template>
  <USlideover
    v-model:open="isVisible"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Add Wallet"
  >
    <template #body>
      <LazyWalletForm
        hydrate-on-visible
        @close="close"
      />
    </template>
  </USlideover>
</template>
