<template>
  <info-card-base :item="item"
    :notes="notes"
    :charts="charts" />
</template>

<script setup lang="ts">
import InfoCardBase from './_InfoCardBase.vue'

defineProps<{
  item: object
  notes?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
