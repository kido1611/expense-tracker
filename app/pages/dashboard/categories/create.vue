<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Create Category",
});

useHead({
  title: "Create Category",
});

async function onSuccess() {
  await navigateTo("/dashboard/categories");
}
</script>

<template>
  <UContainer class="py-8">
    <CategoryForm @on-success="onSuccess" />
  </UContainer>
</template>
