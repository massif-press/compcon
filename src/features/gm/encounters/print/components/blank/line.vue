<template>
  <div
    v-if="width"
    :style="`height: ${height}px; width: ${width}px;  background-color: rgba(0,0,0,0.075); border-radius: 3px; `"
  />
  <div
    v-else
    :style="`height: ${height}px; width: 100%;  background-color: rgba(0,0,0,0.075); border-radius: 3px; `"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  height: number
  width?: number
  inline?: boolean
}>(), { inline: false })
</script>
