<template>
  <div v-html-safe="item.GetDescription()" />
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
