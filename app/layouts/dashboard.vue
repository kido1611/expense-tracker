<script setup lang="ts">
const isSidebarVisible = ref(false);
</script>
<template>
  <div class="grid grid-cols-1 overflow-clip md:grid-cols-(--dashboard-layout)">
    <aside class="relative hidden h-screen overflow-hidden md:block">
      <div
        class="fixed inset-0 h-screen max-w-(--dashboard-sidebar-width) overflow-hidden bg-neutral-800"
      >
        <DashboardSidebarContent />
      </div>
    </aside>
    <main>
      <div class="px-4 py-2">
        <UButton
          icon="i-tabler-menu-2"
          color="neutral"
          variant="outline"
          size="md"
          class="md:hidden"
          @click="isSidebarVisible = !isSidebarVisible"
        />
      </div>
      <slot />
    </main>
    <USlideover
      v-model:open="isSidebarVisible"
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
            class="absolute top-2 right-2"
            @click="isSidebarVisible = false"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
