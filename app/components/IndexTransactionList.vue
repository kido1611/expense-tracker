<script setup lang="ts">
import type { Transaction } from "~/types";

const { data, status } = await useFetch<Transaction[]>("/api/transactions", {
  key: INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
  query: {
    limit: 5,
  },
});
</script>

<template>
  <div>
    <h2>Transactions</h2>
    <div>{{ status }}</div>

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
    <div v-else class="text-neutral-400 text-center py-8">
      Transaction is empty
    </div>
  </div>
</template>
