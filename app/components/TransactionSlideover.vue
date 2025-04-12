<script setup lang="ts">
const isLoading = defineModel<boolean>("isLoading", {
  default: false,
});

const open = ref<boolean>(false);
</script>

<template>
  <USlideover
    v-model:open="open"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Add Transaction"
  >
    <UButton type="button" icon="i-tabler-plus">Add Transaction</UButton>
    <template #body>
      <LazyTransactionForm hydrate-on-visible @close="open = false" />
    </template>
  </USlideover>
</template>
