<template>
  <div :class="`cc-corner-pip bg-${color}`" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'primary',
})
</script>
