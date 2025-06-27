<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  title: "Wallets",
});
useHead({
  title: "Wallets",
});

const { data } = await useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
});
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-8">
      <UButton
        to="/dashboard/wallets/create"
        aria-label="Create a new label"
      >
        Create
      </UButton>
    </div>

    <div
      v-if="data && data.data && data.data.length > 0"
      class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4"
    >
      <DashboardWalletItem
        v-for="wallet in data.data"
        :key="wallet.id"
        :wallet
      />
    </div>

    <div
      v-if="data && data.data && data.data.length === 0"
      class="flex min-h-[400px] items-center justify-center"
    >
      <p class="text-lg text-neutral-400">Wallet is empty.</p>
    </div>
  </UContainer>
</template>
