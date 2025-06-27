<script setup lang="ts">
const { wallet } = defineProps<{
  wallet: WalletResponse;
}>();

const dropdownItems = [
  [
    {
      label: "Adjust Balance",
      icon: "i-tabler-cash-banknote-edit",
      onSelect() {
        alert("TODO");
        // emits("adjustBalance", wallet.id);
      },
    },
    {
      label: "Transfer",
      icon: "i-tabler-transfer",
      onSelect() {
        alert("TODO");
        // emits("transfer", wallet.id);
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-tabler-trash",
      color: "error",
      onSelect() {
        alert("TODO");
        // deleteWallet();
      },
    },
  ],
];
</script>

<template>
  <UCard class="relative">
    <div
      class="flex size-11 items-center justify-center rounded-full bg-primary text-neutral-800"
    >
      <UIcon
        v-if="wallet.icon"
        :name="wallet.icon"
        class="size-6"
      />
    </div>

    <div class="mt-4 flex flex-col">
      <NuxtLink
        :to="`/dashboard/wallets/${wallet.id}`"
        class="stretched-link text-base font-semibold hover:underline"
        >{{ wallet.name }}</NuxtLink
      >
      <p class="text-2xl font-light">{{ idrFormatter(wallet.balance) }}</p>
    </div>

    <div class="absolute top-5 right-5">
      <UDropdownMenu
        :items="dropdownItems"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
      >
        <DropdownTriggerButton />
      </UDropdownMenu>
    </div>
  </UCard>
</template>
