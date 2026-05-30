<template>
  <div
    :style="`position: absolute; bottom: -${size}px; right: -${size}px; width: ${size * 2}px; height: ${size * 2}px;`"
    :class="`bg-${color}`"
    style="clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%); pointer-events: none" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  size?: number
}>(), {
  color: 'primary',
  size: 5,
})
</script>
