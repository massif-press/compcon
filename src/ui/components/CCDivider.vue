<template>
  <v-divider
    :color="color"
    :thickness="thickness"
    :class="[vertical ? 'mx-2' : 'my-2', class_]"
    :vertical="vertical"
    :inset="inset" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  thickness?: number
  vertical?: boolean
  inset?: boolean
  class_?: string
}>(), {
  thickness: 1,
  vertical: false,
  inset: false,
})
</script>
