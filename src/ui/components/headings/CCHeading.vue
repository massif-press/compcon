<template>
  <component
    :is="component"
    :color="color"
    :block="block"
    :icon="icon"
    :size="size"
    :tooltip="tooltip"
    :variant="variant"
    :tooltip-icon="tooltipIcon"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon">
    <slot />
  </component>
</template>

<script lang="ts">
import minor from './subcomponents/cc_heading_minor.vue';

export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    block: { type: Boolean },
    icon: { type: String, required: false },
    size: { type: String, required: false },
    variant: { type: String, required: false },
    tooltip: { type: String, required: false },
    tooltipIcon: { type: String, required: false },
    prependIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    border: { type: Boolean },
    line: { type: Boolean },
  },
  computed: {
    component() {
      return minor;
    },
  },
};
</script>
