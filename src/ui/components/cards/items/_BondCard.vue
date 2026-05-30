<template>
  <cc-bond-info :bond="item"
    hide-title />
</template>

<script setup lang="ts">
import CCBondInfo from '../../CCBondInfo.vue'
defineProps<{
  item: object
}>()
</script>
