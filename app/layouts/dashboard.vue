<script setup lang="ts">
const route = useRoute();

const sidebarStore = useDashboardSidebarStore();
const { isVisible: isSidebarVisible } = storeToRefs(sidebarStore);
const { toggle: toggleSidebar, close: closeSidebar } = sidebarStore;
</script>

<template>
  <div class="grid grid-cols-1 overflow-clip md:grid-cols-(--dashboard-layout)">
    <aside class="relative hidden h-dvh overflow-hidden md:block">
      <div
        class="fixed inset-0 h-dvh max-w-(--dashboard-sidebar-width) overflow-hidden bg-neutral-800"
      >
        <DashboardSidebarContent />
      </div>
    </aside>
    <main>
      <UContainer
        class="flex h-16 flex-row items-center border-b border-neutral-800 px-4"
      >
        <UButton
          icon="i-tabler-menu-2"
          color="neutral"
          variant="outline"
          size="lg"
          class="mr-4 flex-none md:hidden"
          @click="toggleSidebar"
        />
        <p class="font-noto-sans text-xl font-medium">
          {{ route.meta.title }}
        </p>
      </UContainer>
      <slot />

      <WalletSlideover />
      <TransactionSlideover />
      <WalletTransferSlideover />
    </main>
    <USlideover
      v-model:open="isSidebarVisible"
      title="Sidebar"
      side="left"
      :ui="{ content: 'max-w-xs' }"
    >
      <template #content>
        <div class="relative">
          <DashboardSidebarContent />
          <UButton
            icon="i-tabler-x"
            color="neutral"
            variant="ghost"
            size="md"
            class="absolute top-3 right-3"
            @click="closeSidebar"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
