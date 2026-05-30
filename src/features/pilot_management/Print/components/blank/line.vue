<template>
  <div
    v-if="width"
    :style="`height: ${height}px; width: ${width}px; border-bottom: 1px solid rgba(0,0,0,0.25); border-radius: 0;`"
  />
  <div
    v-else
    :style="`height: ${height}px; width: 100%; border-bottom: 1px solid rgba(0,0,0,0.25); border-radius: 0;`"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'terse-print' })

const props = withDefaults(defineProps<{
  height: number
  width?: number
  inline?: boolean
}>(), {
  inline: false
})
</script>
