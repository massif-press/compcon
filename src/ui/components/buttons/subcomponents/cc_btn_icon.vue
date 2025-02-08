<template>
  <div class="top-element" style="display: inline-block; position: relative">
    <span :class="`light ${size} bg-${color} ${tonal && 'tonal-light'}`" />
    <v-btn
      :class="`hex ${size} ${colorClass}`"
      style="container-type: inline-size"
      :variant="variant ? 'tonal' : undefined"
      :color="getColor"
      icon
      :size="buttonSize"
      rounded="0"
      :disabled="disabled"
      :block="block"
      :prepend-icon="'mdi-alert'"
      :append-icon="'mdi-alert'"
      :loading="loading"
      :href="href"
      :to="to"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click', $event)">
      <v-icon style="font-size: 75cqw; margin-top: 4cqw" :color="tonal ? color : ''" :icon="icon" />
    </v-btn>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-btn-icon',
  props: {
    color: { type: String },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    block: { type: Boolean },
    size: { type: String },
    variant: { type: String },
    prependIcon: { type: String },
    appendIcon: { type: String },
    icon: { type: String, required: true, default: 'mdi-help' },
    href: { type: String },
    to: { type: [String, Object] },
    target: { type: String },
  },
  emits: ['click'],
  computed: {
    getColor() {
      if (!this.color) return '';
      return this.tonal ? this.color : 'transparent';
    },
    tonal() {
      return this.variant === 'tonal';
    },
    colorClass() {
      if (this.tonal || !this.color) return '';
      return `bg-${this.color}`;
    },
    buttonSize() {
      switch (this.size) {
        case 'x-small':
          return '22px';
        case 'small':
          return '28px';
        case 'large':
          return '38px';
        case 'x-large':
          return '48px';
        case 'xx-large':
          return '60px';
        default:
          return '36px';
      }
    },
  },
};
</script>

<style scoped>
.hex {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  outline: 4px solid #2c3e50;
}

.v-btn {
  position: relative;
}

.light {
  width: 13px;
  height: 6.5px;
  position: absolute;
  top: 0;
  left: 0;
  clip-path: polygon(0 25%, 0 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.tonal-light {
  opacity: 0.35;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  width: 8.5px;
  height: 4px;
}

.light.small {
  width: 11.5px;
  height: 5.5px;
}

.light.large {
  width: 15.5px;
  height: 8px;
}

.light.x-large {
  width: 17px;
  height: 8.5px;
}

.light.xx-large {
  width: 24.5px;
  height: 12.5px;
}
</style>
