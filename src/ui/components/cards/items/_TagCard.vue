<template>
  <div v-html-safe="item.GetDescription()" />
</template>

<script setup lang="ts">
import type Tag from '@/classes/Tag'
defineProps<{
  item: Tag
}>()
</script>
