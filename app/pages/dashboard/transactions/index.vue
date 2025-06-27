<script setup lang="ts">
import { FetchError } from "ofetch";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Transactions",
});
useHead({
  title: "Transactions",
});

const DASHBOARD_TRANSACTION_LIST = "dashboard-transactions-list";

const currentPage = useState("transactions-page", () => 1);
const openNextPage = () => {
  currentPage.value = currentPage.value + 1;
};
const openPrevPage = () => {
  let newPage = currentPage.value - 1;
  if (newPage < 1) {
    newPage = 1;
  }
  currentPage.value = newPage;
};

const toast = useToast();
const { data } = await useFetch("/api/transactions", {
  key: DASHBOARD_TRANSACTION_LIST,
  query: {
    page: currentPage,
  },
  transform: (data) => {
    return data.data;
  },
});

const tableHeaders: TableColumn<TransactionResponse>[] = [
  {
    id: "expand",
  },
  {
    accessorKey: "transaction_at",
    header: "Date",
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "report",
    header: "Report",
  },
  // {
  //   accessorKey: "created_at",
  //   header: "Created At",
  // },
  {
    id: "action",
  },
];

function rowsDropdownItems(
  transaction: TransactionResponse,
): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edit",
        icon: "i-tabler-pencil",
        // to: `/dashboard/categories/${category.id}/edit`,
      },
    ],
    [
      {
        label: "Delete",
        icon: "i-tabler-trash",
        color: "error",
        async onSelect() {
          await deleteTransaction(transaction.id);
        },
      },
    ],
  ];
}

async function deleteTransaction(transactionId: string) {
  try {
    await $fetch(`/api/transactions/${transactionId}`, {
      method: "DELETE",
    });

    await refreshNuxtData(DASHBOARD_TRANSACTION_LIST);
  } catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        title: error.data?.message,
        color: "error",
      });
    } else {
      toast.add({
        title: "Error: unknown",
        color: "error",
      });
    }
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div>Search / filter</div>
    <!-- tabel  -->
    <!-- spend date // wallet // category // amount // node // created_at // action -->
    <!-- action: (see image if exist // edit // delete ) -->

    <UTable
      :data="data"
      :columns="tableHeaders"
    >
      <template #expand-cell="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          icon="i-tabler-chevron-down"
          square
          size="sm"
          @click="() => row.toggleExpanded()"
        />
      </template>
      <template #transaction_at-cell="{ row }">
        <NuxtTime
          :datetime="row.original.transaction_at"
          year="numeric"
          month="long"
          day="numeric"
          hour="numeric"
          :hour12="false"
          minute="2-digit"
        />
      </template>

      <template #wallet-cell="{ row }">
        <div class="inline-flex flex-row items-center gap-x-3">
          <div
            v-if="row.original.wallet.icon"
            class="flex size-9 items-center justify-center rounded-full bg-neutral-800 text-primary"
          >
            <UIcon
              :name="row.original.wallet.icon"
              class="size-5"
            />
          </div>
          <NuxtLink
            :to="`/dashboard/wallets/${row.original.wallet.id}`"
            class="font-medium text-highlighted hover:underline"
          >
            {{ row.original.wallet.name }}
          </NuxtLink>
        </div>
      </template>

      <template #category-cell="{ row }">
        <div>
          <UBadge
            v-if="row.original.category.is_expense"
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
          <p class="mt-2">{{ row.original.category.name }}</p>
        </div>
      </template>

      <template #amount-cell="{ row }">
        <p
          class="font-medium"
          :class="{
            'text-red-500': row.original.category.is_expense,
            'text-white': !row.original.category.is_expense,
          }"
        >
          {{
            idrFormatter(
              row.original.category.is_expense
                ? row.original.amount * -1
                : row.original.amount,
            )
          }}
        </p>
      </template>

      <template #report-cell="{ row }">
        <UBadge
          v-if="!row.original.is_visible_in_report"
          color="neutral"
          variant="subtle"
          >Hidden</UBadge
        >
      </template>

      <!--   <template #created_at-cell="{ row }"> -->
      <!--     <NuxtTime -->
      <!--       :datetime="row.original.created_at" -->
      <!--       year="numeric" -->
      <!--       month="long" -->
      <!--       day="numeric" -->
      <!--       hour="numeric" -->
      <!--       :hour12="false" -->
      <!--       minute="2-digit" -->
      <!--     /> -->
      <!--   </template> -->

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

      <template #expanded="{ row }">
        <div class="flex flex-col gap-y-4">
          <div class="flex flex-col text-sm">
            <p class="font-medium text-white">Note</p>
            <p
              class="mt-1"
              v-if="row.original.note"
            >
              {{ row.original.note }}
            </p>
            <p
              class="mt-1"
              v-else
            >
              -
            </p>
          </div>
          <div
            class="flex flex-col text-sm"
            v-if="row.original.image_path"
          >
            <p class="font-medium text-white">Transaction Photo</p>
            <img
              alt="Transaction photo"
              :src="`/${row.original.image_path}`"
              class="mt-1 max-h-[400px] max-w-[400px]"
            />
          </div>
        </div>
      </template>
    </UTable>

    <div class="mt-6 flex flex-row items-center justify-between gap-4">
      <UButton
        :disabled="currentPage === 1"
        leading-icon="i-tabler-arrow-left"
        @click="openPrevPage"
      >
        Prev
      </UButton>
      <p class="text-sm text-gray-400">Page {{ currentPage }}</p>
      <UButton
        :disabled="(data?.length ?? 0) < 20"
        trailing-icon="i-tabler-arrow-right"
        @click="openNextPage"
      >
        Next
      </UButton>
    </div>
  </UContainer>
</template>
