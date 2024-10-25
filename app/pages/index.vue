<script setup lang="ts">
import type { Wallet, Transaction } from "~/types";

definePageMeta({
  middleware: "auth",
});


const { user, loggedIn, clear } = useUserSession();
const route = useRoute();

const isLoadingGlobal = ref(false)
function setLoadingGlobal(current: boolean) {
  isLoadingGlobal.value = current
}
provide("loading-global", {
  isLoading: isLoadingGlobal,
  setLoading: setLoadingGlobal
})

const isAddWalletSlideOverVisible = ref<boolean>(false)
const isAddTransactionSlideOverVisible = ref<boolean>(false)


const { data: walletsData } = await useFetch<Wallet[]>("/api/wallets", {
  key: "wallets",
});
const { data: transactionsData } = await useFetch<Transaction[]>(
  "/api/transactions",
  {
    key: "latest-transactions",
  },
);


async function logout() {
  await clear();

  navigateTo("/login");
}

</script>

<template>
  <UContainer>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>

    <p>
      {{ loggedIn }}
      {{ user }}
    </p>

    <UButton type="button" icon="i-tabler-logout" @click="logout">Logout</UButton>

    <div class="flex flex-row flex-wrap gap-x-4 mt-8">
      <UButton type="button" icon="i-tabler-plus" @click="isAddWalletSlideOverVisible = true">Add Wallet</UButton>
      <UButton type="button" icon="i-tabler-plus" @click="isAddTransactionSlideOverVisible = true">Add Transaction
      </UButton>
    </div>

    <USlideover
v-model="isAddWalletSlideOverVisible" :prevent-close="isLoadingGlobal" :ui="{
      base: 'h-[\'100vh\'] overflow-y-auto'
    }">
      <UCard
class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add Wallet
            </h3>
            <UButton
:loading="isLoadingGlobal" color="gray" variant="ghost" icon="i-tabler-x" class="-my-1"
              @click="isAddWalletSlideOverVisible = false" />
          </div>
        </template>

        <WalletForm @close="isAddWalletSlideOverVisible = false" />
      </UCard>
    </USlideover>
    <USlideover
v-model="isAddTransactionSlideOverVisible" :prevent-close="isLoadingGlobal" :ui="{
      base: 'h-[\'100vh\'] overflow-y-auto'
    }">
      <UCard
class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add Transaction
            </h3>
            <UButton
:loading="isLoadingGlobal" color="gray" variant="ghost" icon="i-tabler-x" class="-my-1"
              @click="isAddTransactionSlideOverVisible = false" />
          </div>
        </template>

        <TransactionForm @close="isAddTransactionSlideOverVisible = false" />
      </UCard>
    </USlideover>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 py-8">
      <div>
        <div
v-if="walletsData ? walletsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
          <WalletItem v-for="wallet in walletsData" :key="wallet.nanoid" :wallet />
        </div>
      </div>
      <div>
        <div
v-if="transactionsData ? transactionsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
          <TransactionItem v-for="transaction in transactionsData" :key="transaction.nanoid" :transaction />
        </div>
      </div>
    </div>
  </UContainer>
</template>
