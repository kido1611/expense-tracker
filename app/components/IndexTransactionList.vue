<script setup lang="ts">
const { data, status } = await useFetch("/api/transactions", {
  key: INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
  query: {
    limit: 7,
  },
  server: false,
  lazy: true,
  deep: false,
  dedupe: "cancel",
  transform: (value) => {
    return {
      data: value.data,
      fetched_at: new Date(),
    };
  },
  getCachedData(key, nuxtApp) {
    return getFetchCache(key, nuxtApp);
  },
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
    <h2 class="mb-4 text-lg font-medium">Transactions</h2>

    <template v-if="isSkeletonVisible">
      <div
        class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
      >
        <LazyTransactionItemSkeleton
          v-for="i in 5"
          :key="i"
        />
      </div>
    </template>

    <template v-else>
      <template v-if="data?.data && data.data?.length > 0">
        <div
          class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
        >
          <TransactionItem
            v-for="transaction in data.data"
            :key="transaction.id"
            :transaction="transaction"
            :show-note="false"
          />
        </div>
        <div class="mt-4 flex flex-row justify-end">
          <UButton
            to="/dashboard/transactions"
            size="md"
            variant="subtle"
            trailing-icon="i-tabler-arrow-right"
          >
            Others...
          </UButton>
        </div>
      </template>
      <div
        v-else
        class="py-16 text-center text-neutral-400"
      >
        Transaction is empty
      </div>
    </template>
  </div>
</template>
