<script setup lang="ts">
const emit = defineEmits<{
  transfer: [walletNanoid: string];
}>();

const { data, status } = await useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
  deep: false,
  server: false,
  lazy: true,
  dedupe: "cancel",
  transform: (value) => {
    return value.data;
  },
});

const isSkeletonVisible = computed(() => {
  return (
    status.value === "pending" &&
    (!data.value || (data.value && data.value.length === 0))
  );
});

const openWalletTransfer = (walletId: string) => {
  emit("transfer", walletId);
};
</script>

<template>
  <div class="relative">
    <h2 class="mb-4 text-lg font-medium">Wallets</h2>

    <template v-if="isSkeletonVisible">
      <div
        class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
      >
        <LazyWalletItemSkeleton
          v-for="i in 5"
          :key="i"
        />
      </div>
    </template>

    <template v-else>
      <div
        v-if="data && data.length > 0"
        class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
      >
        <WalletItem
          v-for="wallet in data"
          :key="wallet.id"
          :wallet="wallet"
          @transfer="openWalletTransfer"
        />
      </div>

      <div
        v-else
        class="py-16 text-center text-neutral-400"
      >
        Wallet is empty
      </div>
    </template>
  </div>
</template>
