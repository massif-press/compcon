<template>
  <p v-html-safe="item.Description" />
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
