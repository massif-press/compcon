<template>
  <v-tooltip :disabled="!tooltip"
    :text="tooltip"
    :location="<any>tooltipLocation"
    style="position: relative">
    <template #activator="{ props }">
      <div class="top-element"
        v-bind="props">
        <span :class="`light ${size} bg-${color} ${tonal && 'tonal-light'}`" />
        <v-btn :class="`hex ${size} ${colorClass}`"
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
          <v-icon style="font-size: 75cqw"
            :color="tonal ? color : ''"
            :icon="icon" />
        </v-btn>
      </div>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'CcBtnIcon',
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
    tooltip: { type: String },
    tooltipLocation: { type: String },
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
          return '27px';
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
  /* width = height × (sqrt3/2) for a regular hexagon */
  width: 31.18px !important;
  min-width: 0 !important;
}

/* x-small: 22px height */
.hex.x-small {
  width: 19.05px !important;
}

/* small: 27px height */
.hex.small {
  width: 23.38px !important;
}

/* large: 38px height */
.hex.large {
  width: 32.91px !important;
}

/* x-large: 48px height */
.hex.x-large {
  width: 41.57px !important;
}

/* xx-large: 60px height */
.hex.xx-large {
  width: 51.96px !important;
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

.top-element {
  position: relative;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  width: 6px;
  height: 4px;
}

.light.small {
  width: 8px;
  height: 5px;
}

.light.large {
  width: 10px;
  height: 6px;
}

.light.x-large {
  width: 14px;
  height: 8px;
}

.light.xx-large {
  width: 19px;
  height: 10px;
}
</style>
