<script setup lang="ts">
const { isLoading } = useLoading();

const store = useTransactionDialogStore();
const { isVisible } = storeToRefs(store);
const { close } = store;
</script>

<template>
  <USlideover
    v-model:open="isVisible"
    :dismissible="!isLoading"
    :close="!isLoading"
    title="Add Transaction"
  >
    <template #body>
      <LazyTransactionForm
        hydrate-on-visible
        @close="close"
      />
    </template>
  </USlideover>
</template>
