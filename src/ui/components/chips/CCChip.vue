<template>
  <component :is="component" v-bind="$props">
    <template #tooltip><slot name="tooltip" /></template>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import split from './_subcomponents/cc_split_chip.vue';
import std from './_subcomponents/cc_std_chip.vue';

const props = withDefaults(defineProps<{
  color?: string
  bgColor?: string
  title?: string
  label?: string | number
  icon?: string
  outlined?: boolean
  size?: string
  variant?: string
  tooltip?: string
}>(), {
  color: 'primary',
  size: 'small',
})

const component = computed(() => {
  if ((props.title || props.icon) && props.label) return split;
  return std;
})
</script>
