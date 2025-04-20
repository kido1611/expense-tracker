<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
definePageMeta({
  middleware: "guest",
});

const isLoading = ref<boolean>(false);
const isShowPassword = ref<boolean>(false);

const toast = useToast();

const state = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
});

async function onSubmit(event: FormSubmitEvent<UserCreate>) {
  isLoading.value = true;

  await $fetch("/api/auth/register", {
    method: "POST",
    body: event.data,
  })
    .then(async () => {
      return navigateTo("/login");
    })
    .catch((err) => {
      toast.add({
        title: err.data.message,
        color: "error",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<template>
  <UContainer>
    <h1>Register</h1>

    <NuxtLink to="/login">Login</NuxtLink>
    <NuxtLink to="/register">Register</NuxtLink>

    <UForm
      :schema="UserCreateSchema"
      :state="state"
      class="space-y-5 flex flex-col"
      @submit="onSubmit"
    >
      <UFormField label="Name" name="name" required>
        <UInput
          v-model="state.name"
          type="text"
          required
          autocomplete="name"
          :disabled="isLoading"
        />
      </UFormField>
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
      <UFormField label="Password (Ulang)" name="passwordConfirmation" required>
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
      <UButton type="submit" class="self-start" :loading="isLoading"
        >Register</UButton
      >
    </UForm>
  </UContainer>
</template>
