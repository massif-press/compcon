<template>
  <v-card class="cc-panel-clip" :color="color" flat tile :border="border">
    <slot name="toolbar" />
    <v-card-text :class="[densityClass, variantClass]" style="opacity: 0.8">
      <slot>Default Content</slot>
    </v-card-text>
    <div v-if="border" class="clip-fix" />
  </v-card>
</template>

<script>
export default {
  name: 'cc-panel',
  props: {
    color: {
      type: String,
      default: 'light-panel',
    },
    border: {
      type: Boolean,
      default: false,
    },
    density: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'fluff',
    },
  },
  computed: {
    densityClass() {
      switch (this.density) {
        case 'no-gutters':
          return 'pa-0';
        case 'compact':
          return 'pa-2';
        case 'comfortable':
          return 'py-3 px-8';
        default:
          return 'py-2 px-5';
      }
    },
    variantClass() {
      switch (this.variant) {
        case 'flavor':
          return 'text-cc-flavor';
        case 'fluff':
          return 'text-cc-fluff';
        case 'admin':
          return 'text-cc-overline';
        case 'emphasis':
          return 'text-cc-emphasis';
        case 'subtle':
          return 'text-cc-subtle';
        case 'effect':
          return 'text-cc-effect';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}

.clip-fix {
  position: absolute;
  width: 38px;
  height: 2px;
  background-color: rgba(126, 126, 126, 0.3);
  transform-origin: 10 0;
  bottom: 8px;
  right: -6px;
  transform: rotate(-45deg);
}
</style>
