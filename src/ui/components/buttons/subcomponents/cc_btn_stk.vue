<template>
  <div
    class="top-element"
    :style="`display: ${block ? 'block' : 'inline-block'}; position: relative`">
    <span v-if="!text" :class="`light ${size} ${bgColor} ${tonal && 'light-tonal'}`" />
    <v-btn
      :class="`${colorClass} ${sizeStyle} px-0  ${outlined && `border-sm text-${color}`}`"
      :style="outlined ? `border-color: ${borderColor}!important` : ''"
      :color="text || tonal || outlined ? color : 'transparent'"
      :variant="<any>variant"
      tile
      :size="size"
      stacked
      :loading="loading"
      :disabled="disabled"
      :href="href"
      :to="to"
      :target="target"
      @click="$emit('click')">
      <v-icon v-if="prependIcon" :icon="prependIcon" :size="iconSize(prependIcon)" />
      <slot />
    </v-btn>

    <v-menu v-if="$slots.options" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          block
          :variant="variant === 'default' ? 'tonal' : (variant as any)"
          class="fade-select"
          style="container-type: inline-size; text-transform: uppercase; margin-top: -1px"
          tile
          :size="optionsSize"
          flat
          v-bind="props">
          <span style="font-size: 10cqw; padding-top: 1px">
            {{ optionsText || 'Options' }}
            <v-icon v-if="optionsIcon" :icon="optionsIcon" />
          </span>
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
    optionsText: { type: String },
    href: { type: String },
    to: { type: [String, Object] },
    target: { type: String },
  },
  computed: {
    sizeStyle() {
      return this.size ? `size-${this.size}` : 'size-default';
    },
    optionsSize() {
      switch (this.size) {
        case 'x-small':
          return 10;
        case 'small':
          return 16;
        case 'large':
          return 20;
        case 'x-large':
          return 'default';
        case 'xx-large':
          return 'large';
        default:
          return 20;
      }
    },
    colorClass() {
      if (this.outlined || this.text || this.tonal) {
        return '';
      }
      return this.bgColor;
    },
    bgColor() {
      return `bg-${this.color}`;
    },
    outlined() {
      return this.variant === 'outlined';
    },
    text() {
      return this.variant === 'text';
    },
    tonal() {
      return this.variant === 'tonal';
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
      if (icon.includes('cc:')) size += 2;
      return `${size}px`;
    },
  },
};
</script>

<style scoped>
.v-btn {
  position: relative;
}

.offset {
  margin-top: -5px;
}

.light {
  top: 0px;
  width: 13.5px;
  height: 13.5px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
}

.light-tonal {
  opacity: 0.35;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  width: 8px;
  height: 8px;
}

.light.small {
  width: 9.5px;
  height: 9.5px;
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
  height: 30px !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  font-size: 0.75rem;
  letter-spacing: 4px;
  height: 45px !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  font-size: 0.85rem;
  letter-spacing: 3px;
  padding-left: 12px !important;
  padding-right: 8px !important;
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
  font-size: 1.2rem;
  letter-spacing: 4px;
  font-weight: 500;
  padding-left: 16px !important;
  padding-right: 8px !important;
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
  font-size: 1.6rem;
  letter-spacing: 6px;
  font-weight: 600;
  height: 100px !important;
  padding-left: 23px !important;
  padding-right: 10px !important;
}

.size-xx-large {
  clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px);
  font-size: 2.3rem;
  letter-spacing: 10px;
  font-weight: 600;
  height: 150px !important;
  padding-left: 26px !important;
  padding-right: 10px !important;
}
</style>
