<script setup lang="ts">
const emit = defineEmits<{
  transfer: [walletNanoid: string];
}>();

const { data, status } = useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
});

const isSkeletonVisible = computed(() => {
  return (
    status.value === "pending" &&
    (!data.value || (data.value && data.value.length === 0))
  );
});

const openWalletTransfer = (walletNanoid: string) => {
  emit("transfer", walletNanoid);
};
</script>

<template>
  <div class="relative">
    <!-- <UProgress -->
    <!--   v-if="status == 'pending' && (!data || (data && data.length > 0))" -->
    <!--   animation="swing" -->
    <!--   size="xs" -->
    <!--   class="absolute top-0 w-full" -->
    <!-- /> -->
    <h2 class="text-lg font-medium mb-4">Wallets</h2>

    <template v-if="isSkeletonVisible">
      <div
        class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
      >
        <LazyWalletItemSkeleton v-for="i in 5" :key="i" />
      </div>
    </template>

    <template v-else>
      <div
        v-if="data ? data.length > 0 : false"
        class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
      >
        <WalletItem
          v-for="wallet in data"
          :key="wallet.nanoid"
          :wallet="wallet"
          @transfer="openWalletTransfer"
        />
      </div>

      <div v-else class="text-center py-16 text-neutral-400">
        Wallet is empty
      </div>
    </template>
  </div>
</template>
