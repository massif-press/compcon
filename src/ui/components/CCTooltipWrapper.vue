<template>
  <v-tooltip
    :text="text"
    :location="location"
    :max-width="maxWidth"
    :open-delay="openDelay"
    :disabled="!text"
  >
    <template #activator="{ props }">
      <span v-bind="props"><slot /></span>
    </template>
    <slot name="content" />
  </v-tooltip>
</template>

<script setup lang="ts">
  import type { Anchor } from 'vuetify'
  withDefaults(
    defineProps<{
      text?: string
      location?: Anchor
      maxWidth?: string | number
      openDelay?: number
    }>(),
    {
      location: 'top',
      maxWidth: 300,
      openDelay: 0,
    }
  )
</script>
