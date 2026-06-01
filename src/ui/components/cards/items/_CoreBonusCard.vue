<template>
  <info-card-base :item="item"
    :notes="notes"
    :charts="charts" />
</template>

<script setup lang="ts">
import InfoCardBase from './_InfoCardBase.vue'
import type { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'

defineProps<{
  item: CoreBonus
  notes?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
