<template>
  <info-card-base :item="item" />
</template>

<script setup lang="ts">
import InfoCardBase from './_InfoCardBase.vue'

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
