<template>
  <component :is="cType"
    :deployable="deployable"
    :tier="tier"
    :owner="owner" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import { getFeatureRenderer } from '../featureRenderers'

const props = withDefaults(defineProps<{
  deployable: Deployable
  popup?: boolean
  panel?: boolean
  hover?: boolean
  tier?: number
  owner?: object | null
}>(), {
  popup: true,
  owner: null,
})

const cType = computed(() =>
  props.hover ? getFeatureRenderer('deployable', 'hover')
  : props.panel ? getFeatureRenderer('deployable', 'panel')
  : getFeatureRenderer('deployable', 'popup')
)
</script>
