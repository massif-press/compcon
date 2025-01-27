<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <div class="d-inline-block" style="position: relative">
        <v-icon
          v-if="outlined"
          :size="iconSize * 1.5"
          :color="color"
          icon="cc:hex_thin"
          :style="!isHovering && `opacity: 0.5`"
          :class="`hover ${isHovering && 'outline-hover'}`"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" />
        <v-btn
          v-bind="props"
          variant="text"
          icon
          :disabled="disabled"
          :size="iconSize"
          :style="outlined && `border-color: ${color}`"
          :class="`pa-0 hover text-${color}  ${iconOffset}`">
          <v-icon :class="iconOffset" :size="iconSize" :icon="icon" />
        </v-btn>
      </div>
    </template>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'cc-btn-icon',
  props: {
    color: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    size: { type: String },
    icon: { type: String, required: true, default: 'mdi-help' },
    variant: { type: String, default: 'default' },
  },
  computed: {
    outlined() {
      return this.variant === 'outlined';
    },
    colorClass() {
      return `bg-${this.color}`;
    },
    iconOffset() {
      return this.icon.includes('cc:') ? 'off-5' : 'off-1';
    },
    iconSize() {
      switch (this.size) {
        case 'x-small':
          return 20;
        case 'small':
          return 24;
        case 'large':
          return 36;
        case 'x-large':
          return 42;
        case 'xx-large':
          return 50;
        default:
          return 32;
      }
    },
  },
};
</script>

<style scoped>
.off-5 {
  margin-top: -3px;
}

.off-1 {
  margin-top: -2px;
}

.hover {
  transition: all 0.2s ease-in-out;
}

.hover:hover {
  filter: saturate(2) brightness(1.2) hue-rotate(20deg);
}

.outline-hover {
  opacity: 1;
  filter: saturate(2) brightness(2) hue-rotate(40deg);
}
</style>
