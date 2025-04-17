<template>
  <component :is="component" v-bind="$props">
    <slot />
  </component>
</template>

<script lang="ts">
import minor from './headings/cc_heading_minor.vue';
import title from './headings/cc_title.vue';

import h3 from './headings/cc_h3.vue';

export default {
  name: 'cc-title',
  props: {
    type: { type: String, default: 'minor' },
    color: { type: String, default: '' },
    textColor: { type: String, default: 'accent' },
    line: { type: Boolean },
    filled: { type: Boolean, default: false },
    isTitle: { type: Boolean },
    text: { type: String, default: '' },
    small: { type: Boolean, default: false },
    size: { type: String, default: 'small' },
    tooltip: { type: String, default: '' },
    dense: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
  },
  computed: {
    component() {
      if (this.isTitle) {
        return title;
      }

      switch (this.type) {
        case 'minor':
          return minor;
        case 'h3':
          return h3;
        default:
          return title;
      }
    },
  },
};
</script>
