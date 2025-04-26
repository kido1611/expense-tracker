<script setup lang="ts">
const { wallet } = defineProps<{
  wallet: WalletResponse;
}>();

const emits = defineEmits<{
  transfer: [walletId: string];
  adjustBalance: [walletId: string];
}>();

const toast = useToast();

const isDeleteLoading = ref<boolean>(false);
async function deleteWallet() {
  isDeleteLoading.value = true;
  try {
    await $fetch(`/api/wallets/${wallet.id}`, {
      method: "DELETE",
    });

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    toast.add({
      title: "Success delete wallet",
      color: "success",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description: "Error when delete wallet",
      color: "error",
    });
  } finally {
    isDeleteLoading.value = false;
  }
}

const dropdownItems = [
  [
    {
      label: "Adjust Balance",
      icon: "i-tabler-cash-banknote-edit",
      onSelect() {
        emits("adjustBalance", wallet.id);
      },
    },
    {
      label: "Transfer",
      icon: "i-tabler-transfer",
      onSelect() {
        emits("transfer", wallet.id);
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
