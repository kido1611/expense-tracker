<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const isLoading = ref<boolean>(false);

type Schema = z.output<typeof walletSchema>;
const state = reactive({
  name: "",
  balance: 0,
  icon: "i-tabler-wallet",
});

const selectedIcon = computed(() => {
  if (!state.icon) {
    return null;
  }

  return icons.filter((data) => data.icon === state.icon)[0];
});

const icons = [
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
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  await $fetch("/api/wallets", {
    method: "POST",
    body: event.data,
  })
    .then(() => {
      state.name = "";
      state.balance = 0;
      state.icon = "i-tabler-wallet";

      refreshNuxtData("wallets");
      refreshNuxtData("latest-transactions");
    })
    .catch((_err) => {
      // TODO: error on backend validation
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<template>
  <div>
    <p>Tambah Wallet</p>

    <UForm
      :schema="walletSchema"
      :state="state"
      class="flex flex-col space-y-5"
      @submit="onSubmit"
    >
      <UFormGroup label="Name" name="name" required>
        <UInput
          v-model="state.name"
          type="text"
          required
          :disabled="isLoading"
        />
      </UFormGroup>
      <UFormGroup label="Balance" name="balance" required>
        <UInput
          v-model="state.balance"
          type="number"
          required
          min="0"
          :disabled="isLoading"
        />
      </UFormGroup>
      <UFormGroup label="Icon" name="icon" required>
        <USelectMenu
          v-model="state.icon"
          :options="icons"
          option-attribute="label"
          value-attribute="icon"
          searchable
          searchable-placeholder="Find icon..."
          clear-search-on-close
          placeholder="Find icon"
          required
          :disabled="isLoading"
        >
          <template #label>
            <template v-if="selectedIcon">
              <UIcon :name="selectedIcon.icon" class="flex-none size-5" />
              <p class="">{{ selectedIcon.label }}</p>
            </template>
          </template>
        </USelectMenu>
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
