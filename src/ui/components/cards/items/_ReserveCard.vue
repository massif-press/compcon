<template>
  <p v-html-safe="item.Description" />
</template>

<script setup lang="ts">
import type { Reserve } from '@/classes/pilot/components/reserves/Reserve'
defineProps<{
  item: Reserve
}>()
</script>
