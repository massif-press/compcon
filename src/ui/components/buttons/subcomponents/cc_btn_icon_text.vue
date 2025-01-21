<template>
  <v-icon
    class="fade-select"
    :color="color"
    :size="iconSize"
    :disabled="disabled"
    :class="iconOffset"
    :icon="icon" />
</template>

<script lang="ts">
export default {
  name: 'cc-btn-icon',
  props: {
    color: { type: String, default: 'primary' },
    disabled: { type: Boolean },
    size: { type: String },
    icon: { type: String, required: true, default: 'mdi-help' },
  },
  computed: {
    colorClass() {
      return `bg-${this.color}`;
    },
    iconOffset() {
      return this.icon.includes('cc:') ? 'off-5' : 'off-1';
    },
    iconSize() {
      switch (this.size) {
        case 'x-small':
          return 15;
        case 'small':
          return 17;
        case 'large':
          return 20;
        case 'x-large':
          return 32;
        case 'xx-large':
          return 40;
        default:
          return 24;
      }
    },
  },
};
</script>

<style scoped>
.off-5 {
  margin-top: -4px;
}

.off-1 {
  margin-top: -2px;
}
</style>
