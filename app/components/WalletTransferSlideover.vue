<script setup lang="ts">
const isVisible = defineModel<boolean>("isVisible", {
  default: false,
});
const isLoading = defineModel<boolean>("isLoading", {
  default: false,
});
const selected = defineModel<string | null>("selected", {
  default: "",
});

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <USlideover
    v-model="isVisible"
    :prevent-close="isLoading"
    :ui="{
      base: 'h-[\'100vh\'] overflow-y-auto',
    }"
  >
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Transfer Wallet
          </h3>
          <UButton
            :loading="isLoading"
            color="gray"
            variant="ghost"
            icon="i-tabler-x"
            class="-my-1"
            @click="emit('close')"
          />
        </div>
      </template>

      <WalletTransferForm :selected-wallet="selected" @close="emit('close')" />
    </UCard>
  </USlideover>
</template>
