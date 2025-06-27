<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Categories",
});
useHead({
  title: "Categories",
});

const { data } = await useFetch("/api/categories", {
  transform: (data) => {
    return data.data;
  },
});

const tableHeaders: TableColumn<CategoryResponse>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "is_expense",
    header: "Type",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    id: "action",
  },
];

function rowsDropdownItems(category: CategoryResponse): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edit",
        icon: "i-tabler-pencil",
        to: `/dashboard/categories/${category.id}/edit`,
      },
    ],
    [
      {
        label: "Delete",
        icon: "i-tabler-trash",
        color: "error",
        onSelect(_) {
          alert("TODO");
        },
      },
    ],
  ];
}
</script>

<template>
  <UContainer class="py-8">
    <UButton
      to="/dashboard/categories/create"
      icon="i-tabler-plus"
      class="mb-8"
      >Create</UButton
    >
    <div v-if="data && data.length > 0">
      <UTable
        :data="data"
        :columns="tableHeaders"
      >
        <template #name-cell="{ row }">
          <div class="inline-flex flex-row items-center gap-x-3">
            <div
              v-if="row.original.icon"
              :class="{
                'text-error': row.original.is_expense,
                'text-success': !row.original.is_expense,
              }"
              class="flex size-9 items-center justify-center rounded-full bg-neutral-800"
            >
              <UIcon
                :name="row.original.icon"
                class="size-5"
              />
            </div>
            <NuxtLink
              :to="`/dashboard/categories/${row.original.id}`"
              class="font-medium text-highlighted hover:underline"
            >
              {{ row.original.name }}
            </NuxtLink>
          </div>
        </template>

        <template #is_expense-cell="{ row }">
          <UBadge
            v-if="row.original.is_expense"
            color="error"
            variant="subtle"
            >Expense</UBadge
          >
          <UBadge
            v-else
            color="success"
            variant="subtle"
            >Income</UBadge
          >
        </template>

        <template #created_at-cell="{ row }">
          <NuxtTime
            :datetime="row.original.created_at"
            year="numeric"
            month="long"
            day="numeric"
            hour="numeric"
            :hour12="false"
            minute="2-digit"
          />
        </template>

        <template #action-cell="{ row }">
          <div class="text-right">
            <UDropdownMenu
              :items="rowsDropdownItems(row.original)"
              :content="{
                align: 'end',
                side: 'bottom',
              }"
            >
              <DropdownTriggerButton />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </div>

    <div v-else-if="data && data.length === 0">Empty</div>
  </UContainer>
</template>
