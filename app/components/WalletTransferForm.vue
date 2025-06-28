<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { FetchError } from "ofetch";
import { format, formatISO } from "date-fns";

const { selectedWalletId } = defineProps<{
  selectedWalletId?: string | null;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { isLoading, setLoading } = useLoading();
const toast = useToast();

const { data: walletsData } = await useFetch("/api/wallets", {
  lazy: true,
  transform: (value) => {
    return value.data;
  },
});

const state = reactive({
  source_wallet_id: "",
  destination_wallet_id: "",
  amount: 0,
  note: "",
  transfer_at: format(new Date(), "yyyy-MM-dd"),
  with_fee: false,
  fee_amount: 0,
});

const selectedFromWallet = computed(() => {
  if (!state.source_wallet_id) {
    return null;
  }

  return walletsData.value?.filter(
    (data) => data.id === state.source_wallet_id,
  )[0];
});
const selectedToWallet = computed(() => {
  if (!state.destination_wallet_id) {
    return null;
  }

  return walletsData.value?.filter(
    (data) => data.id === state.destination_wallet_id,
  )[0];
});

const fromWalletList = computed(() => {
  if (!walletsData.value) {
    return [];
  }

  return walletsData.value ?? [];
});

const toWalletsList = computed(() => {
  if (!state.source_wallet_id) {
    return [];
  }

  return fromWalletList.value.filter(
    (data) => data.id !== state.source_wallet_id,
  );
});

watch(
  () => state.with_fee,
  (newValue) => {
    if (!newValue) {
      state.fee_amount = 0;
    } else {
      state.fee_amount = 2500;
    }
  },
);
watch(
  () => state.source_wallet_id,
  () => {
    state.destination_wallet_id = "";
  },
);

onMounted(() => {
  if (selectedWalletId) {
    state.source_wallet_id = selectedWalletId;
  }
});

async function onSubmit(event: FormSubmitEvent<WalletTransferCreate>) {
  try {
    setLoading(true);

    const data = {
      ...event.data,
      transfer_at: formatISO(syncDateToDateTime(event.data.transfer_at)),
    };

    await $fetch("/api/wallets/transfer", {
      method: "POST",
      body: data,
    });

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    state.source_wallet_id = "";
    state.destination_wallet_id = "";
    state.amount = 0;
    state.note = "";
    state.transfer_at = format(new Date(), "yyyy-MM-dd");
    state.with_fee = false;
    state.fee_amount = 0;

    emit("close");
  } catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        title: error.data?.message,
        color: "error",
      });
    } else {
      toast.add({
        title: "Error: unknown",
        color: "error",
      });
    }
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
      name="source_wallet_id"
      required
    >
      <USelectMenu
        v-model="state.source_wallet_id"
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
      label="To"
      name="destination_wallet_id"
      required
    >
      <USelectMenu
        v-model="state.destination_wallet_id"
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
      name="transfer_at"
      required
    >
      <UInput
        v-model="state.transfer_at"
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
      v-model="state.with_fee"
      name="with_fee"
      label="Transfer Fee"
    />
    <UFormField
      v-if="state.with_fee"
      label="Fee Amount"
      name="fee_amount"
      required
    >
      <UInputNumber
        v-model="state.fee_amount"
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
