<template>
  <div class="top-element" style="display: flex; position: relative">
    <div :class="`${disabled && 'disabled'} light ${size} ${lightColor}`" />
    <v-btn
      :class="`${colorClass} ${sizeStyle} px-0  ${outlined && `border-sm text-${color}`} ${disabled && 'disabled'}`"
      :style="outlined ? `border-color: ${borderColor}!important` : ''"
      color="transparent"
      tile
      flat
      :loading="loading"
      :disabled="disabled"
      :to="to"
      :href="href"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click', $event)">
      <v-icon v-if="prependIcon" start :icon="prependIcon" :size="iconSize(prependIcon)" />
      <slot />
      <v-icon v-if="appendIcon" class="mx-1" :icon="appendIcon" :size="iconSize(appendIcon)" />
      <cc-tooltip v-if="tooltip" :icon="tooltipIcon" :text="tooltip" end />
    </v-btn>

    <v-menu v-if="$slots.options" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          variant="tonal"
          :class="`${optionsSize}`"
          style="opacity: 0.5"
          tile
          flat
          v-bind="props">
          <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
        </v-btn>
      </template>
      <slot name="options" />
    </v-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-btn-std',
  props: {
    pipColor: { type: String },
    color: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    block: { type: Boolean },
    loading: { type: Boolean },
    size: { type: String },
    variant: { type: String },
    prependIcon: { type: String },
    appendIcon: { type: String },
    optionsIcon: { type: String },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    to: { type: [String, Object] },
    href: { type: String },
    target: { type: String },
  },
  emits: ['click'],
  computed: {
    sizeStyle() {
      return this.size ? `size-${this.size}` : 'size-default';
    },
    optionsSize() {
      return this.size ? `options-${this.size}` : 'options-default';
    },
    colorClass() {
      if (this.outlined) {
        return '';
      }
      return this.bgColor;
    },
    bgColor() {
      return `bg-${this.color}`;
    },
    lightColor() {
      if (this.pipColor) return `bg-${this.pipColor}`;
      return `bg-${this.color}`;
    },
    outlined() {
      return this.variant === 'outlined';
    },
    borderColor() {
      if (this.color[0] === '#') return this.color;
      return `rgb(var(--v-theme-${this.color})`;
    },
  },
  methods: {
    iconSize(icon: string) {
      let size = 24;
      switch (this.size) {
        case 'x-small':
          size = 11;
          break;
        case 'small':
          size = 16;
          break;
        case 'large':
          size = 20;
          break;
        case 'x-large':
          size = 32;
          break;
        case 'xx-large':
          size = 40;
          break;
      }
      if (icon.includes('cc:')) size += 4;
      return `${size}px`;
    },
  },
};
</script>

<style scoped>
.offset {
  margin-top: -5px;
}

.disabled {
  filter: grayscale(100%);
  opacity: 0.4 !important;
}

.light {
  position: absolute;
  width: 13.5px;
  height: 13.5px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  width: 8px;
  height: 8px;
  top: 2px;
}

.light.small {
  width: 9.5px;
  height: 9.5px;
}

.light.default {
  width: 13.5px;
  height: 13.5px;
}

.light.large {
  width: 17px;
  height: 17px;
}

.light.x-large {
  width: 21px;
  height: 21px;
}

.light.xx-large {
  width: 27px;
  height: 27px;
}

.size-x-small {
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
  font-size: 0.6rem;
  letter-spacing: 3px;
  height: 20px !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  font-size: 9.5pt !important;
  letter-spacing: 2px;
  height: 26px !important;
  padding-left: 14px !important;
  padding-right: 12px !important;
  padding-top: 2px !important;
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  font-size: 0.85rem;
  letter-spacing: 3px;
  height: 32px !important;
  padding-left: 16px !important;
  padding-right: 12px !important;
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
  font-size: 1.2rem;
  letter-spacing: 4px;
  font-weight: 500;
  height: 40px !important;
  padding-left: 16px !important;
  padding-right: 8px !important;
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
  font-size: 1.6rem;
  letter-spacing: 6px;
  font-weight: 600;
  height: 50px !important;
  padding-left: 23px !important;
  padding-right: 10px !important;
}

.size-xx-large {
  clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px);
  font-size: 2.3rem;
  letter-spacing: 10px;
  font-weight: 600;
  height: 64px !important;
  padding-left: 26px !important;
  padding-right: 10px !important;
}

.options-x-small {
  font-size: 0.6rem;
  height: 16px !important;
  width: 16px !important;
  filter: saturate(0);
}

.options-small {
  font-size: 0.75rem;
  height: 22px !important;
  width: 22px !important;
  filter: saturate(0);
}

.options-default {
  font-size: 0.85rem;
  height: 34px !important;
  width: 34px !important;
  filter: saturate(0);
}

.options-large {
  font-size: 1.2rem;
  height: 40px !important;
  width: 40px !important;
  filter: saturate(0);
}

.options-x-large {
  font-size: 1.6rem;
  height: 50px !important;
  width: 50px !important;
  filter: saturate(0);
}

.options-xx-large {
  font-size: 2.3rem;
  height: 64px !important;
  width: 64px !important;
  filter: saturate(0);
}
</style>
