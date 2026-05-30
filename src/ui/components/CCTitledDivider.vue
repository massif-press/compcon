<template>
  <v-row dense
    align="center">
    <v-col :cols="offset"><v-divider /></v-col>
    <v-col cols="auto">
      <div :class="`heading h${heading} text-${color}`">
        <slot name="prepend" />
        {{ title }}
        <span v-if="subtitle"
          class="text-caption text-text"
          style="opacity: 0.75">
          {{ subtitle }}</span>
      </div>
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  offset?: number
  color?: string
  heading?: string
}>(), {
  offset: 1,
  color: 'primary',
  heading: '3'
})
</script>
