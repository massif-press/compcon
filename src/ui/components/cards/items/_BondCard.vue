<template>
  <CCBondInfo :bond="item"
    hide-title />
</template>

<script setup lang="ts">
import CCBondInfo from '../../CCBondInfo.vue'
import type { Bond } from '@/classes/pilot/components/bond/Bond'
defineProps<{
  item: Bond
}>()
</script>
