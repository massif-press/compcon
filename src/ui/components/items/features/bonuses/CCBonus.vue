<template>
  <component :is="cType"
    v-if="bonuses.length"
    :bonuses="bonuses"
    :tier="tier"
    :icon="icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFeatureRenderer } from '../featureRenderers'
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'

const props = withDefaults(defineProps<{
  bonuses: Bonus[]
  popup?: boolean
  panel?: boolean
  chip?: boolean
  icon?: boolean
  tier?: number
}>(), {
  popup: true,
  icon: false,
  tier: 1,
})

const cType = computed(() =>
  props.chip || props.icon ? getFeatureRenderer('bonus', 'button') : getFeatureRenderer('bonus', 'popup')
)
</script>
