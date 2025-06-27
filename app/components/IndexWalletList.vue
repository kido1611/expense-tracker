<script setup lang="ts">
import { useWalletTransferDialogStore } from "~/stores/wallet";

const walletTransferStore = useWalletTransferDialogStore();
const { open: openWalletTransfer } = walletTransferStore;

const walletAdjustBalanceStore = useWalletAdjustBalanceDialogStore();
const { open: openAdjustBalance } = walletAdjustBalanceStore;

const { data, status } = await useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
  server: false,
  lazy: true,
  dedupe: "cancel",
  // transform: (value) => {
  //   return {
  //     data: value.data,
  //     fetched_at: new Date(),
  //   };
  // },
  // getCachedData(key, nuxtApp) {
  //   return getFetchCache(key, nuxtApp);
  // },
});

const isSkeletonVisible = computed(() => {
  return (
    status.value === "pending" &&
    (!data.value || (data.value && data.value.data?.length === 0))
  );
});
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
      <template v-if="data && data.data && data.data.length > 0">
        <div
          class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
        >
          <WalletItem
            v-for="wallet in data.data"
            :key="wallet.id"
            :wallet="wallet"
            @transfer="openWalletTransfer"
            @adjust-balance="openAdjustBalance"
          />
        </div>
      </template>

      <div
        v-else
        class="py-16 text-center text-neutral-400"
      >
        Wallet is empty
      </div>
    </template>

    <LazyWalletAdjustBalanceSlideover hydrate-on-visible />
  </div>
</template>
