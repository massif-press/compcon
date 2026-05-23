<template>
  <cc-bond-info :bond="item"
    hide-title />
</template>

<script setup lang="ts">
defineProps<{
  item: object
}>()
</script>
