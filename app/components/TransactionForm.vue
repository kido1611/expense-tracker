<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

import { format } from "date-fns";

const emit = defineEmits<{
  close: [];
}>();

const { data: walletsData } = useFetch("/api/wallets", {
  key: "wallets",
});
const { data: categoriesData } = useFetch("/api/categories", {
  key: "categories",
});

const { isLoading, setLoading } = inject<LoadingGlobal>("loading-global", {
  isLoading: false,
  setLoading: () => {},
});
const inputPhoto = useTemplateRef("inputPhotoRef");
// const inputPhotoRef = ref<HTMLInputElement>();

type Schema = z.output<typeof transactionSchema>;
const state = reactive({
  walletNanoid: "",
  categoryId: 0,
  amount: 0,
  spendAt: format(new Date(), "yyyy-MM-dd"),
  note: "",
  isVisibleInReport: true,
});
const statePhoto = ref<File | null | undefined>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  setLoading(true);

  await $fetch("/api/transactions", {
    method: "POST",
    body: event.data,
  })
    .then(async (transaction) => {
      await uploadImage(transaction.nanoid);

      state.walletNanoid = "";
      state.categoryId = 0;
      state.amount = 0;
      state.spendAt = format(new Date(), "yyyy-MM-dd");
      state.note = "";
      state.isVisibleInReport = true;
      statePhoto.value = null;

      if (inputPhoto.value) {
        // TODO: fix me to clear file input form field
        // inputPhoto.value.value = "";
      }

      refreshNuxtData("wallets");
      refreshNuxtData("latest-transactions");

      emit("close");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });

  // TODO: error on backend validation
}

async function uploadImage(nanoid: string | undefined) {
  if (!nanoid) {
    return;
  }

  if (!statePhoto.value) {
    return;
  }

  const formData = new FormData();
  formData.append("image", statePhoto.value);

  await $fetch(`/api/transactions/${nanoid}/image`, {
    method: "POST",
    body: formData,
  }).catch((_err) => {
    // TODO: Toast failed uploading image
  });
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
  if (!state.walletNanoid) {
    return null;
  }

  return walletsData.value?.filter(
    (data) => data.nanoid === state.walletNanoid,
  )[0];
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
    :schema="transactionSchema"
    :state="state"
    class="flex flex-col space-y-5"
    @submit="onSubmit"
  >
    <UFormField label="Wallet" name="walletNanoid" required>
      <!-- TODO: save last selected wallet -->

      <USelectMenu
        v-model="state.walletNanoid"
        value-key="nanoid"
        label-key="name"
        :icon="selectedWallet?.icon ?? undefined"
        :items="walletsData"
        required
        :disabled="isLoading"
        placeholder="Find wallet..."
      >
        <template v-if="selectedWallet">
          <div class="flex flex-col space-y-0.5 px-1 text-start">
            <p class="font-medium">{{ selectedWallet.name }}</p>
            <p
              :class="{
                'text-red-500': selectedWallet.balance < 0,
                'dark:text-gray-400 text-gray-500': selectedWallet.balance >= 0,
              }"
            >
              {{ idrFormatter(selectedWallet.balance) }}
            </p>
          </div>
        </template>
        <template #item="{ item }">
          <UIcon
            :name="item.icon ?? 'i-tabler-wallet'"
            class="flex-none size-5 text-primary"
          />
          <div class="flex flex-col space-y-0.5 px-1">
            <p class="font-medium">{{ item.name }}</p>
            <p
              :class="{
                'text-red-500': item.balance < 0,
                'dark:text-gray-400 text-gray-500': item.balance >= 0,
              }"
            >
              {{ idrFormatter(item.balance) }}
            </p>
          </div>
        </template>
      </USelectMenu>
    </UFormField>
    <UFormField label="Category" name="categoryId" required>
      <USelectMenu
        v-model="state.categoryId"
        value-key="id"
        label-key="name"
        :items="categoriesData"
        required
        :disabled="isLoading"
        placeholder="Find category..."
      >
        <template v-if="selectedCategory" #leading>
          <UIcon
            :name="
              selectedCategory.is_expense
                ? 'i-hugeicons-money-send-02'
                : 'i-hugeicons-money-receive-02'
            "
            class="flex-none size-5"
            :class="{
              'text-red-600': selectedCategory.is_expense,
              'text-green-600': !selectedCategory.is_expense,
            }"
          />
        </template>

        <template v-if="selectedCategory">
          <div class="flex flex-col space-y-0.5 ms-7 px-1 text-start">
            <p class="font-medium">{{ selectedCategory.name }}</p>
            <p class="text-xs dark:text-gray-400 text-gray-500">
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
            class="flex-none size-5"
            :class="{
              'text-red-600': item.is_expense,
              'text-green-600': !item.is_expense,
            }"
          />
          <div class="flex flex-col space-y-0.5 px-1">
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-xs dark:text-gray-400 text-gray-500">
              {{ item.is_expense ? "Expense" : "Income" }}
            </p>
          </div>
        </template>
      </USelectMenu>
    </UFormField>
    <UFormField label="Amount" name="amount" required>
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
    <UFormField label="Transaction at" name="spendAt" required>
      <UInput
        v-model="state.spendAt"
        type="date"
        required
        :disabled="isLoading"
      />
    </UFormField>
    <UFormField label="Photo" name="photo">
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
    <UFormField label="Note" name="note">
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
