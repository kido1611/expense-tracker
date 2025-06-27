<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Edit Category",
});

useHead({
  title: "Edit Category",
});

const route = useRoute();

const { data } = await useFetch(`/api/categories/${route.params.id}`);

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    message: "Category not found",
  });
}

async function onSuccess(category?: CategoryResponse) {
  await navigateTo(`/dashboard/categories/${category?.id}`);
}
</script>

<template>
  <UContainer class="py-8">
    <CategoryForm
      :category="data?.data"
      @on-success="onSuccess"
    />
  </UContainer>
</template>
