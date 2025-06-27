<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import { format, formatISO } from "date-fns";

const emit = defineEmits<{
  close: [];
}>();

const { data: walletsData } = await useFetch("/api/wallets", {
  deep: false,
  lazy: true,
  transform: (value) => {
    return value.data;
  },
});
const { data: categoriesData } = await useFetch("/api/categories", {
  deep: false,
  lazy: true,
  transform: (value) => {
    return value.data;
  },
});

const toast = useToast();
const { isLoading, setLoading } = useLoading();

const inputPhoto = useTemplateRef<HTMLInputElement>("inputPhotoRef");

const state = reactive({
  walletId: "",
  categoryId: "",
  amount: 0,
  transactionAt: format(new Date(), "yyyy-MM-dd"),
  note: "",
  isVisibleInReport: true,
});
const statePhoto = ref<File | null | undefined>(null);

async function onSubmit(event: FormSubmitEvent<TransactionCreate>) {
  const data = {
    ...event.data,
    transactionAt: formatISO(syncDateToDateTime(event.data.transactionAt)),
  };
  try {
    setLoading(true);

    const transaction = await $fetch("/api/transactions", {
      method: "POST",
      body: data,
    });

    await uploadImage(transaction.data?.id);

    state.walletId = "";
    state.categoryId = "";
    state.amount = 0;
    state.transactionAt = format(new Date(), "yyyy-MM-dd");
    state.note = "";
    state.isVisibleInReport = true;
    statePhoto.value = null;

    if (inputPhoto.value) {
      inputPhoto.value.value = "";
    }

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    emit("close");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description: "Error when creating transaction",
      color: "error",
    });
  } finally {
    setLoading(false);
  }
}

async function uploadImage(transactionId: string | undefined) {
  if (!transactionId) {
    return;
  }

  if (!statePhoto.value) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", statePhoto.value);

    await $fetch(`/api/transactions/${transactionId}/image`, {
      method: "POST",
      body: formData,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description:
        "Error when uploading photo file, but success when create transaction.",
      color: "error",
    });
  }
}

const selectedCategory = computed(() => {
  if (!state.categoryId) {
    return null;
  }

  return categoriesData.value?.filter(
    (data) => data.id === state.categoryId,
  )[0];
});

const selectedWallet = computed(() => {
  if (!state.walletId) {
    return null;
  }

  return walletsData.value?.filter((data) => data.id === state.walletId)[0];
});

async function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    statePhoto.value = target.files[0];
  }
}
</script>

<template>
  <UForm
    :schema="TransactionCreateSchema"
    :state="state"
    class="flex flex-col space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="Wallet"
      name="walletId"
      required
    >
      <!-- TODO: save last selected wallet -->

      <USelectMenu
        v-model="state.walletId"
        value-key="id"
        label-key="name"
        :icon="selectedWallet?.icon ?? undefined"
        :items="walletsData"
        required
        :disabled="isLoading"
        placeholder="Find wallet..."
      >
        <template v-if="selectedWallet">
          <div class="ml-0 flex flex-col space-y-0.5 px-1 text-start">
            <p class="font-medium">{{ selectedWallet.name }}</p>
            <p
              :class="{
                'text-red-500': selectedWallet.balance < 0,
                'text-gray-500 dark:text-gray-400': selectedWallet.balance >= 0,
              }"
            >
              {{ idrFormatter(selectedWallet.balance) }}
            </p>
          </div>
        </template>
        <template #item="{ item }">
          <UIcon
            :name="item.icon ?? 'i-tabler-wallet'"
            class="size-5 flex-none text-primary"
          />
          <div class="flex flex-col space-y-0.5 px-1">
            <p class="font-medium">{{ item.name }}</p>
            <p
              :class="{
                'text-red-500': item.balance < 0,
                'text-gray-500 dark:text-gray-400': item.balance >= 0,
              }"
            >
              {{ idrFormatter(item.balance) }}
            </p>
          </div>
        </template>
      </USelectMenu>
    </UFormField>
    <UFormField
      label="Category"
      name="categoryId"
      required
    >
      <USelectMenu
        v-model="state.categoryId"
        value-key="id"
        label-key="name"
        :items="categoriesData"
        required
        :disabled="isLoading"
        placeholder="Find category..."
      >
        <template v-if="selectedCategory">
          <UIcon
            :name="
              selectedCategory.is_expense
                ? 'i-hugeicons-money-send-02'
                : 'i-hugeicons-money-receive-02'
            "
            class="size-5 flex-none"
            :class="{
              'text-red-600': selectedCategory.is_expense,
              'text-green-600': !selectedCategory.is_expense,
            }"
          />
          <div class="ml-0 flex flex-col space-y-0.5 px-1 text-start">
            <p class="font-medium">{{ selectedCategory.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ selectedCategory.is_expense ? "Expense" : "Income" }}
            </p>
          </div>
        </template>
        <template #item="{ item }">
          <UIcon
            :name="
              item.is_expense
                ? 'i-hugeicons-money-send-02'
                : 'i-hugeicons-money-receive-02'
            "
            class="size-5 flex-none"
            :class="{
              'text-red-600': item.is_expense,
              'text-green-600': !item.is_expense,
            }"
          />
          <div class="flex flex-col space-y-0.5 px-1">
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ item.is_expense ? "Expense" : "Income" }}
            </p>
          </div>
        </template>
      </USelectMenu>
    </UFormField>
    <UFormField
      label="Amount"
      name="amount"
      required
    >
      <UInputNumber
        v-model="state.amount"
        required
        :min="0"
        :format-options="{
          style: 'currency',
          currency: 'IDR',
          currencyDisplay: 'narrowSymbol',
          currencySign: 'standard',
          maximumFractionDigits: 0,
        }"
      />
    </UFormField>
    <UFormField
      label="Date"
      name="transactionAt"
      required
    >
      <UInput
        v-model="state.transactionAt"
        type="date"
        required
        :disabled="isLoading"
      />
    </UFormField>
    <UFormField
      label="Photo"
      name="photo"
    >
      <UInput
        ref="inputPhotoRef"
        type="file"
        name="photo"
        accept="image/jpeg,image/png"
        @change="onFileSelect"
      />
    </UFormField>
    <UCheckbox
      v-model="state.isVisibleInReport"
      name="isVisibleInReport"
      label="Show in report"
    />
    <UFormField
      label="Note"
      name="note"
    >
      <UTextarea
        v-model="state.note"
        :rows="5"
        autoresize
        placeholder="Explain about the transaction"
      />
    </UFormField>
    <UButton
      type="submit"
      class="self-start"
      :loading="isLoading"
      icon="i-tabler-plus"
      >Add</UButton
    >
  </UForm>
</template>
