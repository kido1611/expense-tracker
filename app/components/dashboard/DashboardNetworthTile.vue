<script setup lang="ts">
const { data: dataExpense } = useNuxtData<{ data: number; fetch_at: Date }>(
  DASHBOARD_TOTAL_EXPENSE_TILE_THIS_MONTH_CACHE_KEY_NAME,
);
const { data: dataIncome } = useNuxtData<{ data: number; fetch_at: Date }>(
  DASHBOARD_TOTAL_INCOME_TILE_THIS_MONTH_CACHE_KEY_NAME,
);

const netWorth = computed(() => {
  const expense = dataExpense?.value?.data ?? 0;
  const income = dataIncome?.value?.data ?? 0;

  return income - expense;
});
</script>

<template>
  <DashboardTile
    title="Net Worth (This Month)"
    icon="i-tabler-currency-dollar"
    :value="idrFormatter(netWorth)"
    :is-error="netWorth < 0"
  />
</template>
