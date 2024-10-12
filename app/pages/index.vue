<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user, loggedIn, clear } = useUserSession();
const route = useRoute();

async function logout() {
  await clear();

  navigateTo("/login");
}
</script>

<template>
  <UContainer>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >

    <p>
      {{ loggedIn }}
      {{ user }}
    </p>

    <UButton type="button" icon="i-tabler-logout" @click="logout"
      >Logout</UButton
    >

    <WalletForm />
  </UContainer>
</template>
