<template>
  <div :class="`cc-end-accent bg-${color}`" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'primary',
})
</script>
