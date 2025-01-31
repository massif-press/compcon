<template>
  <component :is="component" :color="color" :line="line" :filled="filled">
    <slot />
  </component>
</template>

<script lang="ts">
import minor from './subcomponents/cc_heading_minor.vue';

export default {
  name: 'cc-title',
  props: {
    type: { type: String, default: 'minor' },
    color: { type: String, default: '' },
    line: { type: Boolean },
    filled: { type: Boolean, default: false },
  },
  computed: {
    component() {
      return minor;
    },
  },
};
</script>
