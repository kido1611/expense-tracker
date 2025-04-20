<script setup lang="ts">
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const props = defineProps<{
  transaction: TransactionResponse;
}>();

const realAmount = computed(() => {
  return idrFormatter(props.transaction.amount);
});

const isoDate = computed(() => {
  const date =
    props.transaction.spend_at instanceof Date
      ? props.transaction.spend_at
      : parseISO(props.transaction.spend_at);
  return format(date, "d MMMM yyyy", {
    locale: id,
  });
});

const isDeleteLoading = ref<boolean>(false);
async function deleteTransaction() {
  isDeleteLoading.value = true;
  try {
    await $fetch(`/api/transactions/${props.transaction.id}`, {
      method: "DELETE",
    });

    // TODO: Toast
    await refreshNuxtData([
      INDEX_WALLETS_CACHE_KEY_NAME,
      INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
    ]);
  } catch (err) {
    // TODO: Toast
    console.log(err);
  } finally {
    isDeleteLoading.value = false;
  }
}

const dropdownItems = [
  [
    {
      label: "Delete",
      icon: "i-tabler-trash",
      color: "error",
      onSelect() {
        deleteTransaction();
      },
    },
  ],
];
</script>

<template>
  <div class="px-4 py-3">
    <div
      v-if="
        !transaction.is_visible_in_report ||
        transaction.image_path ||
        transaction.is_wallet_transfer
      "
      class="mb-2 flex flex-row items-center gap-x-4 gap-y-2"
    >
      <UBadge
        v-if="transaction.is_wallet_transfer"
        rounded
        color="warning"
        variant="subtle"
        >Transfer</UBadge
      >
      <UBadge
        v-if="transaction.image_path"
        rounded
        color="secondary"
        variant="subtle"
        >With Image</UBadge
      >
      <UBadge
        v-if="!transaction.is_visible_in_report"
        rounded
        color="error"
        variant="subtle"
        >Report Hidden</UBadge
      >
    </div>
    <div class="flex flex-row items-center justify-between gap-x-4">
      <div class="flex flex-1 flex-col space-y-0.5">
        <p class="font-semibold">{{ transaction.category.name }}</p>
        <p class="text-sm text-gray-300">{{ transaction.wallet.name }}</p>
      </div>
      <div class="flex flex-1 flex-col space-y-0.5 text-right">
        <p class="text-sm text-gray-300">{{ isoDate }}</p>
        <p
          class="text-sm"
          :class="{
            'text-green-500': !transaction.category.is_expense,
            'text-red-500': transaction.category.is_expense,
          }"
        >
          {{ realAmount }}
        </p>
      </div>
      <UDropdownMenu
        :items="dropdownItems"
        class="flex-none"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
      >
        <UButton
          color="neutral"
          variant="outline"
          square
          trailing-icon="i-tabler-dots-vertical"
          size="md"
        />
      </UDropdownMenu>
    </div>
    <p
      v-if="transaction.note"
      class="mt-2 line-clamp-1 text-sm whitespace-pre-line text-gray-400"
    >
      {{ transaction.note }}
    </p>
  </div>
</template>
