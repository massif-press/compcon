<template>
  <div class="heading h3"
    v-text="item.StatusType" />
  <div v-html-safe="item.Effects" />
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
