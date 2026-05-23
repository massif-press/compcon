<template>
  <cc-talent :talent="item"
    hide-change
    hide-title />
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
