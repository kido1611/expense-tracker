<script setup lang="ts">
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

    <div class="flex flex-row flex-wrap gap-4 mt-8">
      <WalletSlideover v-model:is-loading="isLoadingGlobal" />
      <TransactionSlideover v-model:is-loading="isLoadingGlobal" />
      <WalletTransferSlideover
        v-model:is-loading="isLoadingGlobal"
        v-model:selected="selectedWalletTransfer"
        v-model:is-visible="isWalletTransferSlideoverVisible"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
      <IndexWalletList @transfer="openWalletTransfer" />
      <IndexTransactionList />
    </div>
  </UContainer>
</template>
