<template>
  <base-chip v-bind="$props">
    <template #content>
      <span class="px-2">
        <v-icon v-if="icon" :icon="icon" class="ml-2" />
        <slot />
      </span>
    </template>
    <template #tooltip><slot name="tooltip" /></template>
  </base-chip>
</template>

<script setup lang="ts">
import baseChip from './cc_base_chip.vue';

const props = withDefaults(defineProps<{
  color?: string
  bgColor?: string
  title?: string
  label?: string | number
  icon?: string
  outlined?: boolean
  size?: string
  variant?: string
}>(), {
  color: 'primary',
  size: 'small',
})
</script>
