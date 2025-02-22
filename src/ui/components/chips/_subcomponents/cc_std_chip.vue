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

<script lang="ts">
import baseChip from './cc_base_chip.vue';

export default {
  name: 'CCChip',
  components: { baseChip },
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
  },
};
</script>
