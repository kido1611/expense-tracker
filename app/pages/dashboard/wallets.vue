<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Wallets",
});
useHead({
  title: "Wallets",
});
</script>
<template>
  <div class="py-10">
    <h1>Wallets</h1>
    <WalletTransferForm :selected-wallet-id="null" />
  </div>
</template>
