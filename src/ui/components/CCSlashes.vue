<template>
  <span :style="`opacity: 0.5; ${size ? `font-size:${size}pt;` : ``}`">//</span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: string | number
}>(), {
  size: ''
})
</script>
