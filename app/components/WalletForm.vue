<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();
const { isLoading, setLoading } = useLoading();

const state = reactive({
  name: "",
  balance: 0,
  icon: "i-tabler-wallet",
});

const selectedIcon = computed(() => {
  if (!state.icon) {
    return null;
  }

  return icons.value.filter((data) => data.icon === state.icon)[0];
});

const icons = ref([
  {
    label: "Wallet",
    icon: "i-tabler-wallet",
  },
  {
    label: "Cash",
    icon: "i-tabler-cash",
  },
  {
    label: "Cash Banknote",
    icon: "i-tabler-cash-banknote",
  },
  {
    label: "Bank Building",
    icon: "i-tabler-building-bank",
  },
  {
    label: "Pig",
    icon: "i-tabler-pig-money",
  },
  {
    label: "Moneybag",
    icon: "i-tabler-moneybag",
  },
  {
    label: "Credit Card",
    icon: "i-tabler-credit-card",
  },
  {
    label: "Briefcase",
    icon: "i-tabler-briefcase",
  },
  {
    label: "Shopping Cart",
    icon: "i-tabler-shopping-cart",
  },
  {
    label: "Lock",
    icon: "i-tabler-lock",
  },
  {
    label: "Heart",
    icon: "i-tabler-heart",
  },
  {
    label: "Brand: MasterCard",
    icon: "i-tabler-brand-mastercard",
  },
  {
    label: "Brand: Visa",
    icon: "i-tabler-brand-visa",
  },
]);

async function onSubmit(event: FormSubmitEvent<WalletCreate>) {
  try {
    setLoading(true);

    await $fetch("/api/wallets", {
      method: "POST",
      body: event.data,
    });

    state.name = "";
    state.balance = 0;
    state.icon = "i-tabler-wallet";

    await refreshNuxtData(DASHBOARD_INDEX_CACHE_KEYS);

    emit("close");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.add({
      title: "Failed",
      description: "Error when creating wallet",
      color: "error",
    });
  } finally {
    setLoading(false);
  }
}
</script>

<template>
  <UForm
    :schema="WalletCreateSchema"
    :state="state"
    class="flex flex-col space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        type="text"
        required
        :disabled="isLoading"
      />
    </UFormField>
    <UFormField
      label="Balance"
      name="balance"
      required
    >
      <UInputNumber
        v-model="state.balance"
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
      label="Icon"
      name="icon"
      required
    >
      <USelectMenu
        v-model="state.icon"
        value-key="icon"
        :icon="selectedIcon?.icon"
        :items="icons"
        required
        :disabled="isLoading"
        placeholder="Find icon..."
        :leading="true"
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
