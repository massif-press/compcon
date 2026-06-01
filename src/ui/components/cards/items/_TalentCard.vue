<template>
  <cc-talent :talent="item"
    hide-change
    hide-title />
</template>

<script setup lang="ts">
import type { Talent } from '@/classes/pilot/components/talent/Talent'
defineProps<{
  item: Talent
}>()
</script>
