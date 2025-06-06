<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Transactions",
});
useHead({
  title: "Transactions",
});

const currentPage = useState("transactions-page", () => 1);
const openNextPage = () => {
  currentPage.value = currentPage.value + 1;
};
const openPrevPage = () => {
  let newPage = currentPage.value - 1;
  if (newPage < 1) {
    newPage = 1;
  }
  currentPage.value = newPage;
};

const { data } = await useFetch("/api/transactions", {
  query: {
    page: currentPage,
  },
  transform: (data) => {
    return data.data;
  },
});
</script>
<template>
  <UContainer class="py-8">
    <div>Search / filter</div>
    <!-- tabel  -->
    <!-- spend date // wallet // category // amount // node // created_at // action -->
    <!-- action: (see image if exist // edit // delete ) -->

    <div
      class="grid grid-cols-1 divide-y divide-neutral-700 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900"
    >
      <TransactionItem
        v-for="transaction in data"
        :key="transaction.id"
        :transaction="transaction"
        :show-note="true"
      />
    </div>

    <div class="mt-6 flex flex-row items-center justify-between gap-4">
      <UButton
        :disabled="currentPage === 1"
        leading-icon="i-tabler-arrow-left"
        @click="openPrevPage"
      >
        Prev
      </UButton>
      <p class="text-sm text-gray-400">Page {{ currentPage }}</p>
      <UButton
        :disabled="(data?.length ?? 0) < 20"
        trailing-icon="i-tabler-arrow-right"
        @click="openNextPage"
      >
        Next
      </UButton>
    </div>
  </UContainer>
</template>
