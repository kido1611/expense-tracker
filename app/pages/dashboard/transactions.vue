<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Transactions",
});
useHead({
  title: "Transactions",
});

</script>
<template>
  <h1>Transactions</h1>
</template>
