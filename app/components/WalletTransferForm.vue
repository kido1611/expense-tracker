<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { z } from "zod";

import { format } from "date-fns";

const props = defineProps<{
  selectedWallet: string | null | undefined;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { isLoading, setLoading } = inject<LoadingGlobal>("loading-global", {
  isLoading: false,
  setLoading: () => {},
});

const { data: walletsData } = await useFetch("/api/wallets", {
  key: INDEX_WALLETS_CACHE_KEY_NAME,
});

type Schema = z.output<typeof walletTransferSchema>;
const state = reactive({
  fromWalletNanoid: "",
  toWalletNanoid: "",
  amount: 0,
  note: "",
  transferAt: format(new Date(), "yyyy-MM-dd"),
  withFee: false,
  feeAmount: 0,
});

const selectedFromWallet = computed(() => {
  if (!state.fromWalletNanoid) {
    return null;
  }

  return walletsData.value?.filter(
    (data) => data.nanoid === state.fromWalletNanoid,
  )[0];
});
const selectedToWallet = computed(() => {
  if (!state.toWalletNanoid) {
    return null;
  }

  return walletsData.value?.filter(
    (data) => data.nanoid === state.toWalletNanoid,
  )[0];
});

const toWalletsList = computed(() => {
  if (!state.fromWalletNanoid) {
    return [];
  }

  return walletsData.value?.filter(
    (data) => data.nanoid !== state.fromWalletNanoid,
  );
});

watch(
  () => state.withFee,
  (newValue) => {
    if (!newValue) {
      state.feeAmount = 0;
    } else {
      state.feeAmount = 2500;
    }
  },
);
watch(
  () => state.fromWalletNanoid,
  () => {
    state.toWalletNanoid = "";
  },
);

onMounted(() => {
  if (props.selectedWallet) {
    state.fromWalletNanoid = props.selectedWallet;
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  setLoading(true);

  await $fetch("/api/wallets/transfer", {
    method: "POST",
    body: event.data,
  })
    .then(async () => {
      state.fromWalletNanoid = "";
      state.toWalletNanoid = "";
      state.amount = 0;
      state.note = "";
      state.transferAt = format(new Date(), "yyyy-MM-dd");
      state.withFee = false;
      state.feeAmount = 0;

      await refreshNuxtData([
        INDEX_WALLETS_CACHE_KEY_NAME,
        INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
      ]);

      emit("close");
    })
    .catch((_err) => {
      // TODO: error on backend validation
    })
    .finally(() => {
      setLoading(false);
    });
}
</script>

<template>
  <UForm
    :schema="walletTransferSchema"
    :state="state"
    class="flex flex-col space-y-5 max-w-md mx-auto"
    @submit="onSubmit"
  >
    <UFormField label="From" name="fromWalletNanoid" required>
      <USelectMenu
        v-model="state.fromWalletNanoid"
        value-key="nanoid"
        label-key="name"
        :icon="selectedFromWallet?.icon ?? undefined"
        :items="walletsData"
        required
        :disabled="isLoading"
        placeholder="Find wallet..."
      >
        <template v-if="selectedFromWallet">
          <div class="flex flex-col space-y-0.5 px-1 text-start">
            <p class="font-medium">{{ selectedFromWallet.name }}</p>
            <p
              :class="{
                'text-red-500': selectedFromWallet.balance < 0,
                'dark:text-gray-400 text-gray-500':
                  selectedFromWallet.balance >= 0,
              }"
            >
              {{ idrFormatter(selectedFromWallet.balance) }}
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
    <UFormField label="To" name="toWalletNanoid" required>
      <USelectMenu
        v-model="state.toWalletNanoid"
        value-key="nanoid"
        label-key="name"
        :icon="selectedToWallet?.icon ?? undefined"
        :items="toWalletsList"
        required
        :disabled="isLoading || !selectedFromWallet"
        placeholder="Find wallet..."
      >
        <template v-if="selectedToWallet">
          <div class="flex flex-col space-y-0.5 px-1 text-start">
            <p class="font-medium">{{ selectedToWallet.name }}</p>
            <p
              :class="{
                'text-red-500': selectedToWallet.balance < 0,
                'dark:text-gray-400 text-gray-500':
                  selectedToWallet.balance >= 0,
              }"
            >
              {{ idrFormatter(selectedToWallet.balance) }}
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
    <UFormField label="Transfer at" name="transferAt" required>
      <UInput
        v-model="state.transferAt"
        type="date"
        required
        :disabled="isLoading"
      />
    </UFormField>
    <UFormField label="Note" name="note">
      <UTextarea
        v-model="state.note"
        :rows="5"
        autoresize
        placeholder="Explain about the transfer"
      />
    </UFormField>
    <UCheckbox v-model="state.withFee" name="withFee" label="Transfer Fee" />
    <UFormField
      v-if="state.withFee"
      label="Fee Amount"
      name="feeAmount"
      required
    >
      <UInputNumber
        v-model="state.feeAmount"
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
    <UButton
      type="submit"
      class="self-start"
      :loading="isLoading"
      icon="i-tabler-plus"
      >Add</UButton
    >
  </UForm>
</template>
