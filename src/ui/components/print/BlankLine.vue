<template>
  <div
    :style="`height: ${height}px; width: ${width ? `${width}px` : '100%'}; border-bottom: 1px solid rgba(0, 0, 0, 0.25); border-radius: 0;`"
  />
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      height: number
      width?: number
    }>(),
    {
      width: 0,
    }
  )
</script>
