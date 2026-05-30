<template>
  <div class="text-uppercase" :class="[center && 'text-center', color && `text-${color}`]">
    <b :style="!dense && 'letter-spacing: 5px'"><slot /></b>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'cc-h3' })

const props = withDefaults(defineProps<{
  color?: string
  dense?: boolean
  center?: boolean
}>(), {
  dense: false,
  center: false
})
</script>
