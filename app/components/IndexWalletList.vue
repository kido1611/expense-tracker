<script setup lang="ts">
const emit = defineEmits<{
  transfer: [walletNanoid: string];
}>();

const { data, status } = await useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
});

const openWalletTransfer = (walletNanoid: string) => {
  emit("transfer", walletNanoid);
};
</script>

<template>
  <div>
    <h2>Wallets</h2>

    <div>{{ status }}</div>
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
    <div v-else class="text-center py-8 text-neutral-400">Wallet is empty</div>
  </div>
</template>
