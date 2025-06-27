<script setup lang="ts">
import { FetchError } from "ofetch";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  middleware: "guest",
  layout: "auth",
});
useHead({
  title: "Login",
});

const { fetch: refreshSession } = useUserSession();
const toast = useToast();

const isShowPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const state = reactive({
  email: "test@email.com",
  password: "password",
});

async function onSubmit(event: FormSubmitEvent<UserLogin>) {
  try {
    isLoading.value = true;
    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });

    await refreshSession();
    await navigateTo("/dashboard");
  } catch (error: any) {
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
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-8">
    <h1 class="text-3xl font-light">Login</h1>

    <UForm
      :schema="UserLoginSchema"
      :state="state"
      class="flex flex-col space-y-5"
      @submit="onSubmit"
    >
      <UFormField
        label="Email"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          required
          autocomplete="username"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
        required
      >
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

      <UButton
        type="submit"
        class="self-start"
        icon="i-tabler-login"
        :loading="isLoading"
        >Login</UButton
      >
    </UForm>

    <p class="text-sm text-neutral-300">
      Doesn't have an account?
      <UButton
        to="/register"
        variant="ghost"
        color="neutral"
        aria-label="Click here to register"
        >Click here!</UButton
      >
    </p>
  </div>
</template>
