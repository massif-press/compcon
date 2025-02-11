<template>
  <component :is="component" v-bind="$props">
    <template #tooltip><slot name="tooltip" /></template>
    <slot />
  </component>
</template>

<script lang="ts">
import split from './_subcomponents/cc_split_chip.vue';
import std from './_subcomponents/cc_std_chip.vue';

export default {
  name: 'CCChip',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    bgColor: {
      type: String,
      required: false,
    },
    title: {
      type: String,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    outlined: {
      type: Boolean,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
    variant: {
      type: String,
    },
    tooltip: {
      type: String,
    },
  },
  computed: {
    component() {
      if ((this.title || this.icon) && this.label) return split;
      return std;
    },
  },
};
</script>
