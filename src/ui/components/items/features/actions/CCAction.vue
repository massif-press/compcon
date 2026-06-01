<template>
  <component :is="cType"
    :action="action"
    :no-action="noAction"
    :activations="activations"
    :unusable="unusable"
    :disabled="disabled"
    :tier="tier"
    :hide-icon="hideIcon"
    :close-on-click="closeOnClick"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFeatureRenderer } from '../featureRenderers'
import type { Action } from '@/classes/Action'

const props = withDefaults(defineProps<{
  action: Action
  hover?: boolean
  popup?: boolean
  panel?: boolean
  noAction?: boolean
  active?: boolean
  disabled?: boolean
  unusable?: boolean
  activations?: number
  tier?: number
  hideIcon?: boolean
  closeOnClick?: boolean
}>(), {
  popup: true,
  activations: 2,
  hideIcon: false,
  closeOnClick: true,
})

const cType = computed(() => {
  if (props.active) return getFeatureRenderer('action', 'button')
  if (props.hover) return getFeatureRenderer('action', 'hover')
  return props.panel ? getFeatureRenderer('action', 'panel') : getFeatureRenderer('action', 'popup')
})
</script>
