<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const walletTransferStore = useWalletTransferDialogStore();
const { open: openWalletTransfer } = walletTransferStore;

const walletStore = useWalletDialogStore();
const { open: openWallet } = walletStore;

const transactionStore = useTransactionDialogStore();
const { open: openTransaction } = transactionStore;

const otherMenu: DropdownMenuItem[] = [
  {
    label: "Add Wallet",
    icon: "i-tabler-wallet",
    onSelect() {
      openWallet();
    },
  },
  {
    label: "Add Wallet Transfer",
    icon: "i-tabler-credit-card-pay",
    onSelect() {
      openWalletTransfer(null);
    },
  },
];
</script>

<template>
  <UButtonGroup>
    <UButton
      class="h-12 w-full justify-center"
      icon="i-tabler-plus"
      color="info"
      @click="openTransaction"
    >
      Transaction
    </UButton>
    <UDropdownMenu
      arrow
      :items="otherMenu"
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton
        class="size-12 items-center justify-center"
        icon="i-tabler-dots-vertical"
        variant="subtle"
        color="info"
      />
    </UDropdownMenu>
  </UButtonGroup>
</template>
