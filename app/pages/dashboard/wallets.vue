<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
</script>
<template>
  <div class="py-10">
    <h1>Wallets</h1>
    <WalletTransferForm :selected-wallet="null" />
  </div>
</template>
