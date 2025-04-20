<script setup lang="ts">
const props = defineProps<{
  wallet: WalletResponse;
}>();

const emits = defineEmits<{
  transfer: [walletNanoid: string];
}>();

const isDeleteLoading = ref<boolean>(false);
async function deleteWallet() {
  isDeleteLoading.value = true;
  try {
    await $fetch(`/api/wallets/${props.wallet.id}`, {
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
        emits("transfer", props.wallet.id);
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
    <div class="justify-betbween flex flex-row items-center space-x-4">
      <div
        class="flex size-9 flex-none items-center justify-center rounded-full bg-primary-400 text-gray-900"
      >
        <UIcon
          :name="wallet.icon ?? 'i-tabler-wallet'"
          class="size-5"
        />
      </div>
      <div class="flex flex-1 flex-col space-y-0.5">
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
