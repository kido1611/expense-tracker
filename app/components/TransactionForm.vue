<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

import { format } from "date-fns";

const { data: walletsData } = useFetch("/api/wallets", {
  key: "wallets",
});
const { data: categoriesData } = useFetch("/api/categories", {
  key: "categories",
});

const isLoading = ref<boolean>(false);
const inputPhotoRef = ref<HTMLInputElement>();

type Schema = z.output<typeof transactionSchema>;
const state = reactive({
  walletNanoid: "",
  categoryId: "",
  amount: "",
  spendAt: format(new Date(), "yyyy-MM-dd"),
  note: "",
  isVisibleInReport: true,
});
const statePhoto = ref<File | null | undefined>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  await $fetch("/api/transactions", {
    method: "POST",
    body: event.data,
  })
    .then(async (transaction) => {
      console.log(transaction);

      await uploadImage(transaction.nanoid);

      state.walletNanoid = "";
      state.categoryId = "";
      state.amount = "";
      state.spendAt = format(new Date(), "yyyy-MM-dd");
      state.note = "";
      state.isVisibleInReport = true;
      statePhoto.value = null;

      if (inputPhotoRef.value) {
        inputPhotoRef.value.value = "";
      }

      refreshNuxtData("wallets");
      refreshNuxtData("latest-transactions");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      isLoading.value = false;
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
    (data) => data.id === parseInt(state.categoryId),
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

async function onFileSelect(fileList: File[]) {
  if (fileList.length === 0) {
    return;
  }

  const file = fileList[0];

  if (!file) {
    return;
  }

  statePhoto.value = file;
  return;
}
</script>

<template>
  <div>
    <p>Add transaction</p>
    <UForm
      :schema="transactionSchema"
      :state="state"
      class="flex flex-col space-y-5"
      @submit="onSubmit"
    >
      <UFormGroup label="Wallet" name="walletNanoid" required>
        <!-- TODO: save last selected wallet -->
        <USelectMenu
          v-model="state.walletNanoid"
          :options="walletsData"
          option-attribute="name"
          value-attribute="nanoid"
          searchable
          searchable-placeholder="Find a wallet..."
          clear-search-on-close
          placeholder="Find wallet"
          required
          :disabled="isLoading"
        >
          <template #label>
            <template v-if="selectedWallet">
              <UIcon
                :name="selectedWallet.icon ?? 'i-tabler-wallet'"
                class="flex-none size-5 text-primary"
              />
              <div class="flex flex-col space-y-0.5 px-1">
                <p class="font-medium">{{ selectedWallet.name }}</p>
                <p
                  :class="{
                    'text-red-500': selectedWallet.balance < 0,
                    'dark:text-gray-400 text-gray-500':
                      selectedWallet.balance >= 0,
                  }"
                >
                  {{ idrFormatter(selectedWallet.balance) }}
                </p>
              </div>
            </template>
          </template>
          <template #option="{ option: wallet }">
            <UIcon
              :name="wallet.icon ?? 'i-tabler-wallet'"
              class="flex-none size-5 text-primary"
            />
            <div class="flex flex-col space-y-0.5 px-1">
              <p class="font-medium">{{ wallet.name }}</p>
              <p
                :class="{
                  'text-red-500': wallet.balance < 0,
                  'dark:text-gray-400 text-gray-500': wallet.balance >= 0,
                }"
              >
                {{ idrFormatter(wallet.balance) }}
              </p>
            </div>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Category" name="categoryId" required>
        <USelectMenu
          v-model="state.categoryId"
          :options="categoriesData"
          option-attribute="name"
          value-attribute="id"
          searchable
          searchable-placeholder="Find a category..."
          clear-search-on-close
          placeholder="Find category"
          required
          :disabled="isLoading"
        >
          <template #label>
            <template v-if="selectedCategory">
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
              <div class="flex flex-col space-y-0.5 px-1">
                <p class="font-medium">{{ selectedCategory.name }}</p>
                <p class="text-xs dark:text-gray-400 text-gray-500">
                  {{ selectedCategory.is_expense ? "Expense" : "Income" }}
                </p>
              </div>
            </template>
          </template>
          <template #option="{ option: category }">
            <UIcon
              :name="
                category.is_expense
                  ? 'i-hugeicons-money-send-02'
                  : 'i-hugeicons-money-receive-02'
              "
              class="flex-none size-5"
              :class="{
                'text-red-600': category.is_expense,
                'text-green-600': !category.is_expense,
              }"
            />
            <div class="flex flex-col space-y-0.5 px-1">
              <p class="font-medium">{{ category.name }}</p>
              <p class="text-xs dark:text-gray-400 text-gray-500">
                {{ category.is_expense ? "Expense" : "Income" }}
              </p>
            </div>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Amount" name="amount" required>
        <UInput
          v-model="state.amount"
          type="number"
          required
          :disabled="isLoading"
        />
      </UFormGroup>
      <UFormGroup label="Transaction at" name="spendAt" required>
        <UInput
          v-model="state.spendAt"
          type="date"
          required
          :disabled="isLoading"
        />
      </UFormGroup>
      <UFormGroup label="Photo" name="photo">
        <UInput
          ref="inputPhotoRef"
          type="file"
          name="photo"
          accept="image/jpeg,image/png"
          @change="onFileSelect"
        />
      </UFormGroup>
      <UCheckbox
        v-model="state.isVisibleInReport"
        name="isVisibleInReport"
        label="Show in report"
      />
      <UFormGroup label="Note" name="note">
        <UTextarea
          v-model="state.note"
          :rows="5"
          autoresize
          placeholder="Explain about the transaction"
        />
      </UFormGroup>
      <UButton
        type="submit"
        class="self-start"
        :loading="isLoading"
        icon="i-tabler-plus"
        >Add</UButton
      >
    </UForm>
  </div>
</template>
