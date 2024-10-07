<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  middleware: "guest",
});

const { fetch: refreshSession } = useUserSession();

const toast = useToast();

const isLoading = ref<boolean>(false);

type Schema = z.output<typeof loginSchema>;

const state = reactive({
  email: "test@email.com",
  password: "password",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  await $fetch("/api/auth/login", {
    method: "POST",
    body: event.data,
  })
    .then(async () => {
      toast.add({
        title: "Ok",
      });

      await refreshSession();
      return navigateTo("/");
    })
    .catch(() => {
      toast.add({
        title: "Invalid credential",
        color: "red",
      });
    });

  isLoading.value = false;
}
</script>

<template>
  <UContainer>
    <h1>Login</h1>
    <UForm
      :schema="loginSchema"
      :state="state"
      class="space-y-5 flex flex-col"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          required
          autocomplete="username"
          :disabled="isLoading"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          required
          autocomplete="current-password"
          :disabled="isLoading"
        />
      </UFormGroup>

      <UButton type="submit" class="self-start" :loading="isLoading"
        >Login</UButton
      >
    </UForm>
  </UContainer>
</template>
