<script setup lang="ts">
useHead({
  titleTemplate: "%s - Expense Tracker",
  meta: [
    {
      name: "robots",
      content: "noindex,nofollow",
    },
  ],
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="m-6 w-full max-w-md">
      <UCard variant="subtle">
        <slot />
      </UCard>
    </div>
  </div>
</template>
