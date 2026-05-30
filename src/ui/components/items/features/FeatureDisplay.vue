<template>
  <component :is="renderer"
    v-bind="featureProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFeatureRenderer, type FeatureType, type DisplayMode } from './featureRenderers'

const props = withDefaults(defineProps<{
  featureType: FeatureType
  displayMode: DisplayMode
  feature: object
  [key: string]: any
}>(), {
  displayMode: 'popup',
})

const renderer = computed(() => getFeatureRenderer(props.featureType, props.displayMode))

const featureProps = computed(() => {
  const { featureType, displayMode, feature, ...rest } = props
  return { ...rest, [featureType === 'action' ? 'action' : featureType === 'bonus' ? 'bonus' : 'info']: feature }
})
</script>
