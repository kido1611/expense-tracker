<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

import { format } from "date-fns";

const { selectedWalletId } = defineProps<{
  selectedWalletId: string | null | undefined;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { isLoading, setLoading } = useLoading();
const toast = useToast();

const { data: walletsData } = await useFetch("/api/wallets", {
  deep: false,
  lazy: true,
  transform: (value) => {
    return value.data;
  },
});

const state = reactive({
  fromWalletId: "",
  toWalletId: "",
  amount: 0,
  note: "",
  transferAt: format(new Date(), "yyyy-MM-dd"),
  withFee: false,
  feeAmount: 0,
});

const selectedFromWallet = computed(() => {
  if (!state.fromWalletId) {
    return null;
  }

  return walletsData.value?.filter((data) => data.id === state.fromWalletId)[0];
});
const selectedToWallet = computed(() => {
  if (!state.toWalletId) {
    return null;
  }

  return walletsData.value?.filter((data) => data.id === state.toWalletId)[0];
});

const fromWalletList = computed(() => {
  if (!walletsData.value) {
    return [];
  }

  return walletsData.value ?? [];
});

const toWalletsList = computed(() => {
  if (!state.fromWalletId) {
    return [];
  }

  return fromWalletList.value.filter((data) => data.id !== state.fromWalletId);
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
  () => state.fromWalletId,
  () => {
    state.toWalletId = "";
  },
);

onMounted(() => {
  if (selectedWalletId) {
    state.fromWalletId = selectedWalletId;
  }
});

async function onSubmit(event: FormSubmitEvent<WalletTransferCreate>) {
  try {
    setLoading(true);

    await $fetch("/api/wallets/transfer", {
      method: "POST",
      body: event.data,
    });

    state.fromWalletId = "";
    state.toWalletId = "";
    state.amount = 0;
    state.note = "";
    state.transferAt = format(new Date(), "yyyy-MM-dd");
    state.withFee = false;
    state.feeAmount = 0;

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    emit("close");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description: "Error when creating transfer wallet",
      color: "error",
    });
  } finally {
    setLoading(false);
  }
}
</script>

<template>
  <UForm
    :schema="WalletTransferCreateSchema"
    :state="state"
    class="mx-auto flex max-w-md flex-col space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="From"
      name="fromWalletId"
      required
    >
      <USelectMenu
        v-model="state.fromWalletId"
        value-key="id"
        label-key="name"
        :icon="selectedFromWallet?.icon ?? undefined"
        :items="fromWalletList"
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
                'text-gray-500 dark:text-gray-400':
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
            class="text-primary size-5 flex-none"
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
      label="To"
      name="toWalletId"
      required
    >
      <USelectMenu
        v-model="state.toWalletId"
        value-key="id"
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
                'text-gray-500 dark:text-gray-400':
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
            class="text-primary size-5 flex-none"
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
      label="Transfer at"
      name="transferAt"
      required
    >
      <UInput
        v-model="state.transferAt"
        type="date"
        required
        :disabled="isLoading"
      />
    </UFormField>
    <UFormField
      label="Note"
      name="note"
    >
      <UTextarea
        v-model="state.note"
        :rows="5"
        autoresize
        placeholder="Explain about the transfer"
      />
    </UFormField>
    <UCheckbox
      v-model="state.withFee"
      name="withFee"
      label="Transfer Fee"
    />
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
