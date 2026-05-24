<template>
  <p v-html-safe="item.Detail"></p>
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
