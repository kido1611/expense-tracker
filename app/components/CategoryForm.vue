<script setup lang="ts">
import { FetchError } from "ofetch";
import type { FormSubmitEvent } from "@nuxt/ui";

const { category } = defineProps<{
  category?: CategoryResponse;
}>();
const emit = defineEmits<{
  onSuccess: [category?: CategoryResponse];
}>();

const toast = useToast();

const isLoading = ref<boolean>(false);
const state = reactive<CategoryCreateType>({
  name: category ? category.name : "",
  icon:
    category && category.icon ? category.icon : "i-hugeicons-money-receive-02",
  isExpense: category ? category.is_expense : false,
});

const iconList = [
  {
    label: "Money Receive",
    icon: "i-hugeicons-money-receive-02",
  },
  {
    label: "Money Send",
    icon: "i-hugeicons-money-send-02",
  },
  {
    label: "Pig",
    icon: "i-tabler-pig",
  },
  {
    label: "Wallet",
    icon: "i-tabler-wallet",
  },
];
const selectedIcon = computed(() => {
  if (!state.icon) {
    return null;
  }

  return iconList.filter((data) => data.icon === state.icon)[0];
});

async function onSubmit(event: FormSubmitEvent<CategoryCreateType>) {
  try {
    isLoading.value = true;
    if (category) {
      const response = await $fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        body: event.data,
      });

      emit("onSuccess", response.data);
    } else {
      await $fetch("/api/categories", {
        method: "POST",
        body: event.data,
      });

      emit("onSuccess");
    }
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
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UForm
    :schema="CategoryCreateSchema"
    :state
    @submit="onSubmit"
    class="flex flex-col gap-y-5"
  >
    <UFormField
      label="Name"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        type="text"
        required
        :disabled="isLoading"
      />
    </UFormField>

    <UFormField
      label="Icon"
      name="icon"
      required
    >
      <USelectMenu
        v-model="state.icon"
        value-key="icon"
        :items="iconList"
        :disabled="isLoading"
        :icon="selectedIcon?.icon"
        required
        placeholder="Find icon..."
        :leading="true"
      />
    </UFormField>

    <USwitch
      v-model="state.isExpense"
      label="Expense"
    />

    <UButton
      type="submit"
      class="self-start"
      :loading="isLoading"
      :icon="category ? 'i-tabler-pencil' : 'i-tabler-plus'"
      >{{ category ? "Update" : "Add" }}</UButton
    >
  </UForm>
</template>
