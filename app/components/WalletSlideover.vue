<script setup lang="ts">
const { isLoading } = useLoading();

const open = ref(false);
</script>

<template>
  <USlideover
    v-model:open="open"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Add Wallet"
  >
    <UButton
      type="button"
      icon="i-tabler-plus"
      >Add Wallet</UButton
    >
    <template #body>
      <LazyWalletForm
        hydrate-on-visible
        @close="open = false"
      />
    </template>
  </USlideover>
</template>
