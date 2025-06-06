<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
  title: "Home",
});
useHead({
  title: "Home",
});
</script>

<template>
  <UContainer class="py-8">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
      <LazyDashboardTotalBalanceTile hydrate-on-idle />
    </div>
    <div class="mt-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
      <LazyDashboardTotalIncomeTile hydrate-on-idle />
      <LazyDashboardTotalExpenseTile hydrate-on-idle />
      <LazyDashboardNetworthTile hydrate-on-idle />
    </div>

    <div
      class="mt-6 grid grid-cols-1 gap-6 *:h-[400px] *:rounded-lg *:border *:border-neutral-700 *:p-5 xl:grid-cols-[1fr_350px]"
    >
      <div>Chart in latest year</div>
      <LazyStatisticExpensePerTransaction hydrate-on-idle />
      <!-- <div> -->
      <!--   Expense per Cateogory in this month, show message when no expense -->
      <!-- </div> -->
    </div>
    <div class="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
      <IndexWalletList />
      <IndexTransactionList />
    </div>
  </UContainer>
</template>
