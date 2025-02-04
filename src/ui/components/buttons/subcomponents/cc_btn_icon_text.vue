<template>
  <div class="top-element d-inline-block" style="position: relative; align-content: center">
    <v-icon
      v-if="outlined"
      :size="iconSize * 2"
      :color="getColor"
      :disabled="disabled"
      icon="cc:hex_thin"
      :class="!disabled && 'hover outline-hover'"
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" />
    <v-btn
      variant="text"
      icon
      :disabled="disabled"
      :size="iconSize"
      :loading="loading"
      :class="`pa-0 ${!disabled && 'hover'} text-${getColor}`"
      :to="to"
      :href="href"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click')">
      <v-icon :size="iconSize" :icon="icon" :disabled="disabled" />
    </v-btn>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-btn-icon',
  props: {
    color: { type: String },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    size: { type: String },
    icon: { type: String, required: true, default: 'mdi-help' },
    variant: { type: String, default: 'default' },
    href: { type: String },
    to: { type: [String, Object] },
    target: { type: String },
  },
  emits: ['click'],
  computed: {
    getColor() {
      return this.disabled ? 'grey' : this.color;
    },
    outlined() {
      return this.variant === 'outlined';
    },
    colorClass() {
      return `bg-${this.color}`;
    },
    iconSize() {
      switch (this.size) {
        case 'x-small':
          return 15;
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

.top-element:hover .hover {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.top-element:hover .outline-hover {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.hover {
  opacity: 0.7;
  transition: all 0.2s ease-in-out;
}

.outline-hover {
  opacity: 0.4;
}
</style>
