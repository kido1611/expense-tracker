<script setup lang="ts">
type Props = {
  title: string;
  value: string;
  icon?: string;
  isLoading: boolean;
};

const { title, value, icon, isLoading } = defineProps<Props>();
</script>

<template>
  <div class="overflow-clip rounded-lg border border-neutral-700 p-5">
    <div class="mb-3 flex flex-row justify-between gap-x-3 text-neutral-300">
      <p class="text-sm font-medium">{{ title }}</p>
      <UIcon
        v-if="icon"
        :name="icon"
        class="size-5 flex-none"
      />
    </div>
    <p
      v-if="!isLoading"
      class="mt-3 text-2xl font-semibold tabular-nums"
    >
      {{ value }}
    </p>
    <USkeleton
      v-else
      class="h-8"
    />
  </div>
</template>
