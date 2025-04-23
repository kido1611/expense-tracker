<script setup lang="ts">
const { data, status } = await useFetch("/api/transactions", {
  key: INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
  query: {
    limit: 5,
  },
  server: false,
  lazy: true,
  deep: false,
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
      <div
        v-if="data && data.length > 0"
        class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
      >
        <TransactionItem
          v-for="transaction in data"
          :key="transaction.id"
          :transaction="transaction"
        />
      </div>
      <div
        v-else
        class="py-16 text-center text-neutral-400"
      >
        Transaction is empty
      </div>
    </template>
  </div>
</template>
