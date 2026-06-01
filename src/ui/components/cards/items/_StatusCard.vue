<template>
  <div class="heading h3"
    v-text="item.StatusType" />
  <div v-html-safe="item.Effects" />
</template>

<script setup lang="ts">
import type { Status } from '@/classes/Status'
defineProps<{
  item: Status
}>()
</script>
