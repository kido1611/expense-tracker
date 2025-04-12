<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
const { user, loggedIn, clear } = useUserSession();

const route = useRoute();

const menu = [
  {
    title: "Home",
    path: "/dashboard",
    icon: "i-tabler-layout-dashboard",
  },
  {
    title: "Wallets",
    path: "/dashboard/wallets",
    icon: "i-tabler-wallet",
  },
  {
    title: "Transactions",
    path: "/dashboard/transactions",
    icon: "i-tabler-arrows-transfer-down",
  },
  {
    title: "Categories",
    path: "/dashboard/categories",
    icon: "i-tabler-category",
  },
  {
    title: "Budgets",
    path: "/dashboard/budgets",
    icon: "i-tabler-pig",
  },
];

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
  <div class="grid grid-cols-1 md:grid-cols-(--dashboard-layout) overflow-clip">
    <aside class="hidden md:block h-screen relative overflow-hidden">
      <div
        class="fixed inset-0 bg-neutral-800 max-w-(--dashboard-sidebar-width) overflow-hidden h-screen"
      >
        <div
          class="grid grid-rows-(--dashboard-sidebar-layout) grid-cols-1 h-screen"
        >
          <div class="px-4 py-2 h-16 border border-red-300">
            Expense Tracker
          </div>
          <div class="h-full overflow-y-auto overscroll-none px-4 py-2">
            <div>button add transaction // dropdown add wallet</div>
            <NuxtLink
              v-for="item in menu"
              :key="item.path"
              :data-active="item.path === route.path"
              class="flex flex-row items-center h-10 text-sm gap-x-3 text-neutral-400 data-[active=true]:text-white hover:bg-neutral-700 -mx-2 px-2 rounded-md font-medium"
              :to="item.path"
            >
              <UIcon :name="item.icon" class="size-6 flex-none" />
              <p :to="item.path">{{ item.title }}</p>
            </NuxtLink>
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
                  class="h-10 hover:bg-neutral-700 rounded-md flex flex-row items-center justify-center flex-col px-2 w-full text-left"
                >
                  <!-- eslint-disable-next-line vue/html-self-closing -->
                  <img
                    loading="lazy"
                    :src="`https://ui-avatars.com/api/?name=${user?.name}`"
                    class="flex-none size-7 rounded-full bg-red-200"
                  />
                  <p class="flex-1 ml-3 text-sm font-medium">
                    {{ user?.name }}
                  </p>
                </button>
              </UDropdownMenu>
            </template>
            <NuxtLink
              v-else
              to="/login"
              class="h-10 hover:bg-neutral-700 rounded-md flex flex-col justify-center px-2 w-full text-left text-sm"
            >
              <p class="font-medium">Guest</p>
              <p class="text-neutral-400 text-xs">Login now</p>
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
