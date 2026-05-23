<template>
  <div
    v-for="i in rows"
    :key="`row-${i}`"
    class="my-1"
    style="height: 20px; width: 100%"
    :style="lined ? 'border-bottom: 1px solid rgba(0,0,0,0.2)' : ''"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows: number
  lined?: boolean
}>(), { lined: false })
</script>
