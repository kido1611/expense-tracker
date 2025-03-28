<script setup lang="ts">
const isLoading = defineModel<boolean>("isLoading", {
    default: false,
});
const selected = defineModel<string | null>("selected", {
    default: "",
});
const open = defineModel<boolean>("isVisible", {
    default: false,
});
</script>

<template>
    <USlideover
        v-model:open="open"
        :dismissible="!isLoading"
        :close="!isLoading"
        title="Transfer Wallet"
    >
        <UButton type="button" icon="i-tabler-transfer"
            >Transfer Wallet</UButton
        >
        <template #body>
            <LazyWalletTransferForm
                hydrate-on-visible
                :selected-wallet="selected"
                @close="open = false"
            />
        </template>
    </USlideover>
</template>
