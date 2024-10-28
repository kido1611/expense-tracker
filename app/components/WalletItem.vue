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
    await refreshNuxtData("latest-transactions");
    await refreshNuxtData("wallets");
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
      click: () => {
        emits("transfer", props.wallet.nanoid);
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-tabler-trash",
      click: () => {
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

      <UDropdown :items="dropdownItems" class="flex-none">
        <UButton
          color="white"
          square
          trailing-icon="i-tabler-dots-vertical"
          size="sm"
        />
      </UDropdown>
    </div>
  </div>
</template>
