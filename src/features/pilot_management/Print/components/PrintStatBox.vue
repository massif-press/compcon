<template>
  <v-col cols="auto"
    :style="`min-height: ${blank ? '60' : '50'}px; min-width: ${minWidth}`">
    <fieldset>
      <legend class="caption font-weight-bold text-primary px-1">{{ label }}</legend>
      <div v-if="!blank && value !== null"
        class="heading h2 text-center mt-n2">{{ value }}</div>
    </fieldset>
  </v-col>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  value?: string | number
  blank?: boolean
  minWidth?: string
}>(), {
  value: null,
  blank: false,
  minWidth: '8vw'
})
</script>
