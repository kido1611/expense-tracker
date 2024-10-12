<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const isLoading = ref<boolean>(false);

type Schema = z.output<typeof walletSchema>;
const state = reactive({
  name: "",
  balance: 0,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  await $fetch("/api/wallets", {
    method: "POST",
    body: event.data,
  })
    .then(() => {
      state.name = "";
      state.balance = 0;

      refreshNuxtData("wallets");
    })
    .catch((_err) => {})
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
      <UFormGroup label="Name" name="name">
        <UInput
          v-model="state.name"
          type="text"
          required
          :disabled="isLoading"
        />
      </UFormGroup>
      <UFormGroup label="Balance" name="balance">
        <UInput
          v-model="state.balance"
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
  </div>
</template>
