<script setup lang="ts">
const { data, status } = await useFetch(
  "/api/transactions/stats/total-balance",
  {
    key: DASHBOARD_TOTAL_BALANCE_TILE_CACHE_KEY_NAME,
    server: false,
    lazy: true,
    // transform: (data) => {
    //   return {
    //     data: data.data ?? 0,
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
  <DashboardTile
    title="Total Balance"
    icon="i-tabler-currency-dollar"
    :value="idrFormatter(data?.data ?? 0)"
    :is-loading="status === 'pending' && data === undefined"
  />
</template>
