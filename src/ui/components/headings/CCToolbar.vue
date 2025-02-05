<template>
  <component :is="component" v-bind="$props">
    <template #toolbar-items>
      <slot name="toolbar-items" />
    </template>
    <slot />
  </component>
</template>

<script lang="ts">
import minor from './toolbars/cc_toolbar_minor.vue';
import major from './toolbars/cc_toolbar_major.vue';

export default {
  name: 'cc-toolbar',
  props: {
    type: { type: String, default: 'minor' },
    title: { type: String },
    color: { type: String },
    minor: { type: Boolean },
    hideClose: { type: Boolean },
    extended: { type: Boolean },
  },
  computed: {
    component() {
      if (this.minor) {
        return minor;
      }
      return major;
    },
  },
};
</script>
