<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const { walletId } = defineProps<{
  walletId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();
const { isLoading: isLoadingGlobal, setLoading } = useLoading();

const state = reactive({
  balance: 0,
});

const { data: walletData, status: walletStatus } = await useFetch(
  `/api/wallets/${walletId}`,
  {
    lazy: true,
    transform: (value: ApiResponse<WalletResponse>) => {
      return value.data;
    },
  },
);

watch(
  walletData,
  (wallet) => {
    if (wallet) {
      state.balance = wallet.balance;
    }
  },
  { immediate: true },
);

const isLoading = computed(() => {
  return isLoadingGlobal.value || walletStatus.value === "pending";
});

async function onSubmit(event: FormSubmitEvent<WalletAdjustBalanceCreate>) {
  if (!walletId) {
    emit("close");
    return;
  }

  setLoading(true);

  try {
    await $fetch(`/api/wallets/${walletId}`, {
      method: "PATCH",
      body: event.data,
    });

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    emit("close");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description: "Error when update wallet balance",
      color: "error",
    });
  } finally {
    setLoading(false);
  }
}
</script>

<template>
  <UForm
    :schema="WalletAdjustBalanceCreateSchema"
    :state="state"
    class="flex flex-col space-y-5"
    @submit="onSubmit"
  >
    <div
      v-if="walletData"
      class="justify-betbween flex flex-row items-center space-x-4 rounded-md border border-neutral-700 p-3"
    >
      <div
        class="flex size-9 flex-none items-center justify-center rounded-full bg-primary-400 text-gray-900"
      >
        <UIcon
          :name="walletData.icon ?? 'i-tabler-wallet'"
          class="size-5"
        />
      </div>
      <div class="flex flex-1 flex-col">
        <p class="font-semibold">{{ walletData.name }}</p>
        <p
          class="text-xs text-gray-300"
          :class="{
            'text-red-500': walletData.balance < 0,
          }"
        >
          Current: {{ idrFormatter(walletData.balance) }}
        </p>
      </div>
    </div>

    <UFormField
      label="Balance"
      name="balance"
      required
    >
      <UInputNumber
        v-model="state.balance"
        :disabled="isLoading"
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
      icon="i-tabler-pencil"
    >
      Save
    </UButton>
  </UForm>
</template>
