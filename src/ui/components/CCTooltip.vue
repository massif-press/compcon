<template>
  <v-tooltip :open-on-hover="!mobile" :open-on-click="mobile" max-width="350px">
    <template #activator="{ props }">
      <v-icon
        v-bind="showTooltip ? props : ''"
        :icon="getIcon"
        :start="start"
        :end="end"
        style="align-self: center; margin-top: -3px"
        :size="size" />
    </template>
    <template #default>
      <span v-if="text" v-html="text" />
      <slot v-else />
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    start: {
      type: Boolean,
      default: false,
    },
    end: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: false,
    },
  },
  computed: {
    getIcon() {
      return this.icon || 'mdi-information-slab-box-outline';
    },
    showTooltip() {
      return this.text || this.$slots.default;
    },
    mobile(): boolean {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
  },
};
</script>
