<script setup lang="ts">
import type { Transaction } from "~/types";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";

const props = defineProps<{
  transaction: Transaction;
}>();

const realAmount = computed(() => {
  if (props.transaction.category.is_expense) {
    return `-${idrFormatter(props.transaction.amount)}`;
  }

  return idrFormatter(props.transaction.amount);
});
const isoDate = computed(() => {
  // return props.transaction.spend_at + " " + typeof props.transaction.spend_at;
  return format(
    parse(props.transaction.spend_at, "yyyy-MM-dd", new Date()),
    "d MMMM yyyy",
    {
      locale: id,
    },
  );
});

const isDeleteLoading = ref<boolean>(false);
async function deleteTransaction() {
  isDeleteLoading.value = true;
  try {
    await $fetch(`/api/transactions/${props.transaction.nanoid}`, {
      method: "DELETE",
    });

    // TODO: Toast
    await refreshNuxtData("latest-transactions");
    await refreshNuxtData("wallets");
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
      click: () => {
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
        transaction.is_transfer
      "
      class="flex flex-row items-center gap-x-4 gap-y-2 mb-2"
    >
      <UBadge
        v-if="!transaction.is_visible_in_report"
        rounded
        color="indigo"
        variant="subtle"
        >Report Hidden</UBadge
      >
      <UBadge
        v-if="transaction.image_path"
        rounded
        color="pink"
        variant="subtle"
        >With Image</UBadge
      >
      <UBadge
        v-if="transaction.is_transfer"
        rounded
        color="amber"
        variant="subtle"
        >Transfer</UBadge
      >
    </div>
    <div class="flex flex-row justify-between items-center gap-x-4">
      <div class="flex flex-col space-y-0.5 flex-1">
        <p class="font-semibold">{{ transaction.category.name }}</p>
        <p class="text-sm text-gray-300">{{ transaction.wallet.name }}</p>
      </div>
      <div class="flex flex-col space-y-0.5 text-right flex-1">
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
      <UDropdown :items="dropdownItems" class="flex-none">
        <UButton
          color="white"
          square
          trailing-icon="i-tabler-dots-vertical"
          size="sm"
        />
      </UDropdown>
    </div>
    <p
      v-if="transaction.note"
      class="whitespace-pre-line text-gray-400 mt-2 line-clamp-1"
    >
      {{ transaction.note }}
    </p>
  </div>
</template>
