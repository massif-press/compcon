<template>
  <base-chip v-bind="$props">
    <template #content>
      <span :class="`py-2 ${title ? 'px-2' : 'px-1'} bg-${color}`">
        <v-icon v-if="icon" :icon="icon" :start="!!title" />
        <span v-if="title" v-text="title" />
      </span>
      <span v-if="label" class="px-2" v-text="label" />
      <slot />
    </template>
    <template #tooltip><slot name="tooltip" /></template>
  </base-chip>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import baseChip from './cc_base_chip.vue';

const theme = useTheme()

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

function hexColor(color) {
  if (!color) return '';
  if (color[0] === '#') return color;
  return theme.current.value.colors[color];
}
</script>
