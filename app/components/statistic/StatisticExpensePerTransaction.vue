<script setup lang="ts">
const { data, status, error, refresh } = await useFetch(
  "/api/categories/stats/transaction-expenses",
  {
    key: DASHBOARD_CATEGORIES_PER_TRANSACTIONS_CACHE_KEY_NAME,
    server: false,
    lazy: true,
    // transform: (data) => {
    //   return {
    //     data: data.data,
    //     fetched_at: new Date(),
    //   };
    // },
    // getCachedData(key, nuxtApp) {
    //   return getFetchCache(key, nuxtApp);
    // },
  },
);
</script>

<template>
  <div class="relative overflow-clip">
    <div class="mb-5 flex flex-col">
      <h2 class="text-lg font-semibold">Per Category</h2>
      <p class="text-xs text-neutral-400">
        Show total expense transactions per category on all wallets
      </p>
    </div>
    <div
      v-if="status === 'pending'"
      class="flex flex-col gap-2"
    >
      <USkeleton
        v-for="n in 10"
        :key="n"
        class="h-14"
      />
    </div>
    <template v-else>
      <div
        v-if="data && data.data && data.data.length > 0"
        class="-mt-2 divide-y divide-neutral-700 *:py-3"
      >
        <div
          v-for="category in data.data"
          :key="category.id"
          class="flex flex-row items-end"
        >
          <div class="flex flex-1 flex-col">
            <p class="text-sm font-semibold">
              {{ category.name }}
            </p>
            <p class="text-sm text-neutral-400">
              {{ category.transactions_count }} transactions
            </p>
          </div>
          <div class="flex-none">
            <p class="font-semibold">
              {{ idrFormatter(category.transactions_sum_amount) }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else-if="data && data.data && data.data.length === 0"
        class="flex h-[200px] items-center justify-center"
      >
        <p class="text-neutral-300">There is no expense yet.</p>
      </div>

      <div
        v-else-if="error"
        class="flex h-[200px] items-center justify-center"
      >
        <p class="font-medium text-red-400">
          Error: {{ error.data?.message ?? error.data?.statusMessage }}
        </p>
      </div>

      <!-- gradient -->
      <div
        class="absolute inset-x-0 bottom-0 h-24 w-full bg-linear-to-t/decreasing from-neutral-900"
      />
    </template>
  </div>
</template>
