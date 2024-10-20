<script setup lang="ts">
import type { Wallet, Transaction } from "~/types";

definePageMeta({
  middleware: "auth",
});

const { data: walletsData } = await useFetch<Wallet[]>("/api/wallets", {
  key: "wallets",
});

const { data: transactionsData } = await useFetch<Transaction[]>(
  "/api/transactions",
  {
    key: "latest-transactions",
  },
);

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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 py-8">
      <div>
        <WalletForm />
        <div
          v-if="walletsData ? walletsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 mt-8 rounded-lg overflow-hidden bg-neutral-900"
        >
          <WalletItem
            v-for="wallet in walletsData"
            :key="wallet.nanoid"
            :wallet
          />
        </div>
      </div>
      <div>
        <TransactionForm />
        <div
          v-if="transactionsData ? transactionsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 mt-8 rounded-lg overflow-hidden bg-neutral-900"
        >
          <TransactionItem
            v-for="transaction in transactionsData"
            :key="transaction.nanoid"
            :transaction
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
