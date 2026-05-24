<template>
  <cc-action :action="item" panel />
</template>

<script setup lang="ts">
defineProps<{
  item: object
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
