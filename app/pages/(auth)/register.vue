<script setup lang="ts">
import { FetchError } from "ofetch";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  middleware: "guest",
  layout: "auth",
});
useHead({
  title: "Register",
});

const toast = useToast();

const isLoading = ref<boolean>(false);
const isShowPassword = ref<boolean>(false);

const state = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
});

async function onSubmit(event: FormSubmitEvent<UserCreate>) {
  try {
    isLoading.value = true;

    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });

    await navigateTo("/login");
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
    <h1 class="text-3xl font-light">Register</h1>
    <UForm
      :schema="UserCreateSchema"
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
          autocomplete="name"
          :disabled="isLoading"
        />
      </UFormField>
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
      <UFormField
        label="Password (repeat)"
        name="passwordConfirmation"
        required
      >
        <UInput
          v-model="state.passwordConfirmation"
          :type="isShowPassword ? 'text' : 'password'"
          required
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
        icon="i-tabler-user-plus"
        :loading="isLoading"
        >Register</UButton
      >
    </UForm>

    <p class="text-sm text-neutral-300">
      Have an account?
      <UButton
        to="/login"
        variant="ghost"
        color="neutral"
        aria-label="Click here to login"
        >Click here!</UButton
      >
    </p>
  </div>
</template>
