<script setup lang="ts">
import type { Wallet } from "~/types";

const props = defineProps<{
  wallet: Wallet;
}>();

const emits = defineEmits<{
  transfer: [walletNanoid: string];
}>();

const isDeleteLoading = ref<boolean>(false);
async function deleteWallet() {
  isDeleteLoading.value = true;
  try {
    await $fetch(`/api/wallets/${props.wallet.nanoid}`, {
      method: "DELETE",
    });

    // TODO: Toast
    await refreshNuxtData([
      INDEX_WALLETS_CACHE_KEY_NAME,
      INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
    ]);
  } catch (err) {
    console.log(err);
    // TODO: Toast
  } finally {
    isDeleteLoading.value = false;
  }
}

const dropdownItems = [
  [
    {
      label: "Transfer",
      icon: "i-tabler-transfer",
      onSelect() {
        emits("transfer", props.wallet.nanoid);
      },
    },
    {
      label: "Adjust Balance",
      icon: "i-tabler-cash-banknote-edit",
      onSelect() {
        // TODO
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-tabler-trash",
      color: "error",
      onSelect() {
        deleteWallet();
      },
    },
  ],
];
</script>

<template>
  <div class="px-4 py-3">
    <div class="flex flex-row items-center justify-betbween space-x-4">
      <div
        class="size-9 flex items-center justify-center bg-primary-400 text-gray-900 rounded-full flex-none"
      >
        <UIcon :name="wallet.icon ?? 'i-tabler-wallet'" class="size-5" />
      </div>
      <div class="flex flex-col space-y-0.5 flex-1">
        <p class="font-semibold">{{ wallet.name }}</p>
        <p
          class="text-sm"
          :class="{
            'text-gray-300': wallet.balance >= 0,
            'text-red-500': wallet.balance < 0,
          }"
        >
          {{ idrFormatter(wallet.balance) }}
        </p>
      </div>

      <UDropdownMenu
        :items="dropdownItems"
        class="flex-none"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
      >
        <UButton
          color="neutral"
          variant="outline"
          square
          trailing-icon="i-tabler-dots-vertical"
          size="md"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
