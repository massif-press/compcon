<template>
  <component :is="getComponent"
    :item="item" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CompendiumItem } from '@/classes/CompendiumItem';
import { getFeatureRenderer } from '../featureRenderers'

const props = withDefaults(defineProps<{
  item: CompendiumItem
  popup?: boolean
  panel?: boolean
  hover?: boolean
}>(), {
  popup: true,
})

const getComponent = computed(() =>
  props.hover ? getFeatureRenderer('integrated', 'hover')
  : props.panel ? getFeatureRenderer('integrated', 'panel')
  : getFeatureRenderer('integrated', 'popup')
)
</script>
