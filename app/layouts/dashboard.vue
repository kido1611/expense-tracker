<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
const { user, loggedIn, clear } = useUserSession();

const menu = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    to: "/dashboard",
    icon: "i-tabler-layout-dashboard",
  },
  {
    label: "Wallets",
    to: "/dashboard/wallets",
    icon: "i-tabler-wallet",
  },
  {
    label: "Transactions",
    to: "/dashboard/transactions",
    icon: "i-tabler-arrows-transfer-down",
  },
  {
    label: "Categories",
    to: "/dashboard/categories",
    icon: "i-tabler-category",
  },
  {
    label: "Budgets",
    to: "/dashboard/budgets",
    icon: "i-tabler-pig",
  },
]);

const userMenu: DropdownMenuItem[][] = [
  [
    {
      label: "Logout",
      icon: "i-tabler-logout",
      async onSelect() {
        await clear();

        clearNuxtData([
          INDEX_WALLETS_CACHE_KEY_NAME,
          INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME,
        ]);

        await navigateTo("/login");
      },
    },
  ],
];
</script>
<template>
  <div class="grid grid-cols-1 overflow-clip md:grid-cols-(--dashboard-layout)">
    <aside class="relative hidden h-screen overflow-hidden md:block">
      <div
        class="fixed inset-0 h-screen max-w-(--dashboard-sidebar-width) overflow-hidden bg-neutral-800"
      >
        <div
          class="grid h-screen grid-cols-1 grid-rows-(--dashboard-sidebar-layout)"
        >
          <div class="h-16 border border-red-300 px-4 py-2">
            Expense Tracker
          </div>
          <div class="h-full overflow-y-auto overscroll-none px-4 py-2">
            <div>button add transaction // dropdown add wallet</div>
            <UNavigationMenu
              :items="menu"
              orientation="vertical"
              class="-mx-2.5"
              :ui="{ link: 'py-2' }"
            />
          </div>
          <div class="border-t border-neutral-700 px-2 py-2">
            <template v-if="loggedIn">
              <UDropdownMenu
                :items="userMenu"
                :modal="false"
                :content="{
                  align: 'end',
                  side: 'top',
                  sideOffset: 8,
                }"
              >
                <button
                  class="flex h-10 w-full flex-row items-center justify-center rounded-md px-2 text-left hover:bg-neutral-700"
                >
                  <!-- eslint-disable-next-line vue/html-self-closing -->
                  <img
                    loading="lazy"
                    :src="`https://ui-avatars.com/api/?name=${user?.name}`"
                    class="size-8 flex-none rounded-full bg-red-200"
                  />
                  <div class="ml-3 flex flex-1 flex-col">
                    <p class="text-sm font-medium">
                      {{ user?.name }}
                    </p>
                    <p class="text-xs text-neutral-400">{{ user?.email }}</p>
                  </div>
                </button>
              </UDropdownMenu>
            </template>
            <NuxtLink
              v-else
              to="/login"
              class="flex h-10 w-full flex-col justify-center rounded-md px-2 text-left text-sm hover:bg-neutral-700"
            >
              <p class="font-medium">Guest</p>
              <p class="text-xs text-neutral-400">Login now</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>
