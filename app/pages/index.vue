<script setup lang="ts">
import type { Wallet, Transaction } from "~/types";

definePageMeta({
  middleware: "auth",
});

const { user, loggedIn, clear } = useUserSession();

const isLoadingGlobal = ref(false);
function setLoadingGlobal(current: boolean) {
  isLoadingGlobal.value = current;
}
provide("loading-global", {
  isLoading: isLoadingGlobal,
  setLoading: setLoadingGlobal,
});

const {
  isSlideoverVisible: isWalletTransferSlideoverVisible,
  selectedWallet: selectedWalletTransfer,
  open: openWalletTransfer,
} = useWalletTransfer();

const { data: walletsData } = await useFetch<Wallet[]>("/api/wallets", {
  key: "wallets",
});
const { data: transactionsData } = await useFetch<Transaction[]>(
  "/api/transactions",
  {
    key: "latest-transactions",
    query: {
      limit: 5,
    },
  },
);

async function logout() {
  await clear();

  navigateTo("/login");
}

function useWalletTransfer() {
  const isSlideoverVisible = ref<boolean>(false);
  const selectedWallet = ref<string | null>(null);

  function open(walletNanoid: string) {
    isSlideoverVisible.value = true;
    selectedWallet.value = walletNanoid;
  }

  return {
    isSlideoverVisible,
    selectedWallet,
    open,
  };
}
</script>

<template>
  <UContainer>
    <p>
      {{ loggedIn }}
      {{ user }}
    </p>

    <UButton type="button" icon="i-tabler-logout" @click="logout"
      >Logout</UButton
    >

    <div class="flex flex-row flex-wrap gap-x-4 mt-8">
      <WalletSlideover v-model:is-loading="isLoadingGlobal" />
      <TransactionSlideover v-model:is-loading="isLoadingGlobal" />
      <WalletTransferSlideover
        v-model:is-loading="isLoadingGlobal"
        v-model:selected="selectedWalletTransfer"
        v-model:is-visible="isWalletTransferSlideoverVisible"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 py-8">
      <div>
        <div
          v-if="walletsData ? walletsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
        >
          <WalletItem
            v-for="wallet in walletsData"
            :key="wallet.nanoid"
            :wallet
            @transfer="openWalletTransfer"
          />
        </div>
      </div>
      <div>
        <div
          v-if="transactionsData ? transactionsData.length > 0 : false"
          class="grid grid-cols-1 border border-neutral-700 divide-y divide-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
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
