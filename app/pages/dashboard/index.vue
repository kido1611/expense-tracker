<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
</script>

<template>
  <UContainer>
    <div class="mt-8 flex flex-row flex-wrap gap-4">
      <WalletSlideover />
      <TransactionSlideover />
      <WalletTransferSlideover />
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 py-8">
      <IndexWalletList />
      <IndexTransactionList />
    </div>
  </UContainer>
</template>
