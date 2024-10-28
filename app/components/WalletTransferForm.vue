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

const { data: walletsData } = useFetch("/api/wallets", {
  key: "wallets",
});

type Schema = z.output<typeof walletTransferSchema>;
const state = reactive({
  fromWalletNanoid: "",
  toWalletNanoid: "",
  amount: "",
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

const toWalletsData = computed(() => {
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
    .then(() => {
      state.fromWalletNanoid = "";
      state.toWalletNanoid = "";
      state.amount = "";
      state.note = "";
      state.transferAt = format(new Date(), "yyyy-MM-dd");
      state.withFee = false;
      state.feeAmount = 0;

      refreshNuxtData("wallets");
      refreshNuxtData("latest-transactions");

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
    <UFormGroup label="From" name="fromWalletNanoid" required>
      <USelectMenu
        v-model="state.fromWalletNanoid"
        :options="walletsData"
        option-attribute="name"
        value-attribute="nanoid"
        searchable
        searchable-placeholder="Find wallet..."
        clear-search-on-close
        placeholder="Find wallet"
        required
        :disabled="isLoading"
      >
        <template #label>
          <template v-if="selectedFromWallet">
            <UIcon
              :name="selectedFromWallet.icon ?? 'i-tabler-wallet'"
              class="flex-none size-5 text-primary"
            />
            <div class="flex flex-col space-y-0.5 px-1">
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
    <UFormGroup label="To" name="toWalletNanoid" required>
      <USelectMenu
        v-model="state.toWalletNanoid"
        :options="toWalletsData"
        option-attribute="name"
        value-attribute="nanoid"
        searchable
        searchable-placeholder="Find wallet..."
        clear-search-on-close
        placeholder="Find wallet"
        required
        :disabled="isLoading || !selectedFromWallet"
      >
        <template #label>
          <template v-if="selectedToWallet">
            <UIcon
              :name="selectedToWallet.icon ?? 'i-tabler-wallet'"
              class="flex-none size-5 text-primary"
            />
            <div class="flex flex-col space-y-0.5 px-1">
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

    <UFormGroup label="Amount" name="amount" required>
      <UInput
        v-model="state.amount"
        type="number"
        required
        min="0"
        :disabled="isLoading"
      />
    </UFormGroup>
    <UFormGroup label="Transfer at" name="transferAt" required>
      <UInput
        v-model="state.transferAt"
        type="date"
        required
        :disabled="isLoading"
      />
    </UFormGroup>
    <UFormGroup label="Note" name="note">
      <UTextarea
        v-model="state.note"
        :rows="5"
        autoresize
        placeholder="Explain about the transfer"
      />
    </UFormGroup>
    <UCheckbox v-model="state.withFee" name="withFee" label="Transfer Fee" />
    <UFormGroup
      v-if="state.withFee"
      label="Fee Amount"
      name="feeAmount"
      required
    >
      <UInput
        v-model="state.feeAmount"
        type="number"
        required
        min="0"
        :disabled="isLoading"
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
</template>
