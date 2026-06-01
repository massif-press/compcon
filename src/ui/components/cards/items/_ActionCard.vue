<template>
  <cc-action :action="item" panel />
</template>

<script setup lang="ts">
import type { Action } from '@/classes/Action'
defineProps<{
  item: Action
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
