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
      label: "Profile",
      icon: "i-tabler-user",
    },
    {
      type: "separator",
    },
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
  <div class="grid h-dvh grid-cols-1 grid-rows-(--dashboard-sidebar-layout)">
    <div class="flex h-18 items-center px-4">
      <p class="font-kalam text-2xl font-semibold">Expense Tracker</p>
    </div>
    <div class="h-full overflow-y-auto overscroll-none px-4">
      <AddButton class="mb-4 w-full" />
      <UNavigationMenu
        :items="menu"
        orientation="vertical"
        class="-mx-2.5"
        :ui="{ link: 'py-2.5' }"
      />
    </div>
    <div class="border-t border-neutral-700 px-1.5 py-2">
      <template v-if="loggedIn">
        <UDropdownMenu
          :items="userMenu"
          :modal="false"
          :content="{
            align: 'end',
            side: 'top',
            sideOffset: 8,
          }"
          :ui="{
            content: 'min-w-52',
          }"
        >
          <button
            class="flex h-14 w-full flex-row items-center justify-center rounded-md px-2.5 text-left hover:bg-neutral-700"
          >
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <img
              loading="lazy"
              :src="`https://ui-avatars.com/api/?name=${user?.name}`"
              class="size-9 flex-none rounded-md bg-red-200"
            />
            <div class="mx-2.5 flex w-full flex-col">
              <p class="max-w-40 truncate text-sm font-medium">
                {{ user?.name }}
              </p>
              <p class="max-w-40 text-xs text-neutral-400">{{ user?.email }}</p>
            </div>
            <UIcon
              name="i-tabler-selector"
              class="size-4 flex-none"
            />
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
</template>
