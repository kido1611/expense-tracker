<script setup lang="ts">
import type { Transaction } from "~/types";

const { data, status } = useFetch<Transaction[]>("/api/transactions", {
  key: INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
  query: {
    limit: 5,
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
    <h2 class="text-lg font-medium mb-4">Transactions</h2>

    <template v-if="isSkeletonVisible">
      <div
        class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
      >
        <LazyTransactionItemSkeleton v-for="i in 5" :key="i" />
      </div>
    </template>

    <template v-else>
      <div
        v-if="data ? data.length > 0 : false"
        class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
      >
        <TransactionItem
          v-for="transaction in data"
          :key="transaction.nanoid"
          :transaction
        />
      </div>
      <div v-else class="text-neutral-400 text-center py-16">
        Transaction is empty
      </div>
    </template>
  </div>
</template>
