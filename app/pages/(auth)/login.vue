<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  middleware: "guest",
});

const { fetch: refreshSession } = useUserSession();

const isShowPassword = ref<boolean>(false);
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
        color: "error",
      });
    });

  isLoading.value = false;
}
</script>

<template>
  <UContainer>
    <h1>Login</h1>
    <NuxtLink to="/login">Login</NuxtLink>
    <NuxtLink to="/register">Register</NuxtLink>
    <UForm
      :schema="loginSchema"
      :state="state"
      class="space-y-5 flex flex-col"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          required
          autocomplete="username"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="state.password"
          :type="isShowPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          :disabled="isLoading"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="isShowPassword ? 'i-tabler-eye-off' : 'i-tabler-eye'"
              :aria-label="isShowPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="isShowPassword"
              aria-controls="password"
              @click="isShowPassword = !isShowPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton type="submit" class="self-start" :loading="isLoading"
        >Login</UButton
      >
    </UForm>
  </UContainer>
</template>
