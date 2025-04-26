<script setup lang="ts">
const { data, status } = await useFetch(
  "/api/transactions/stats/total-expense",
  {
    key: DASHBOARD_TOTAL_EXPENSE_TILE_THIS_MONTH_CACHE_KEY_NAME,
    server: false,
    lazy: true,
    transform: (data) => {
      return {
        data: data.data ?? 0,
        fetched_at: new Date(),
      };
    },
    getCachedData(key, nuxtApp) {
      return getFetchCache(key, nuxtApp);
    },
  },
);
</script>

<template>
  <DashboardTile
    title="Total Expense (This Month)"
    icon="i-tabler-currency-dollar"
    :value="idrFormatter(data?.data ?? 0)"
    :is-loading="status === 'pending'"
  />
</template>
