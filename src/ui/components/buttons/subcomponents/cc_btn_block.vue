<template>
  <v-card tile flat class="top-element pb-1" color="transparent" style="text-transform: uppercase">
    <v-row dense no-gutters>
      <v-col>
        <span :class="`light ${disabled && 'disabled'} ${size} ${bgColor}`" />
        <v-card
          :class="`${colorClass} ${sizeStyle} ${disabled && 'disabled'} ${outlined && `border-sm text-${color}`} px-4 mb-n1`"
          :style="outlined ? `border-color: ${borderColor}!important;` : ''"
          style="display: flex; justify-content: center; align-items: center"
          tile
          :ripple="{ class: `text-${color}` }"
          :loading="loading"
          :disabled="disabled"
          :to="to"
          :href="href"
          :target="target"
          @click.stop="!disabled && !loading && $emit('click')">
          <v-row dense align="center" :class="mobile && 'py-2'">
            <v-col cols="auto">
              <v-icon v-if="prependIcon" :size="iconSize" :icon="prependIcon" start />
              <span v-else-if="size !== 'small' && size !== 'x-small'">&nbsp;</span>
            </v-col>
            <v-col :style="`font-size: ${size}`">
              <slot />
              <div v-if="$slots.subtitle" class="text-caption mt-n1"><slot name="subtitle" /></div>
            </v-col>
            <v-col cols="auto">
              <div class="text-caption"><slot name="info" /></div>
            </v-col>
            <v-col v-if="appendIcon" cols="auto">
              <v-icon :size="iconSize" :icon="appendIcon" start />
            </v-col>
            <v-col cols="auto">
              <cc-tooltip v-if="tooltip" :icon="tooltipIcon" :text="tooltip" end />
              <div v-else style="height: 14px" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="auto" v-if="$slots.options">
        <v-menu :close-on-content-click="false" offset-y>
          <template #activator="{ props }">
            <v-btn
              style="height: 110%; margin-left: -1px; container-type: size"
              :variant="outlined ? 'outlined' : 'tonal'"
              :color="outlined ? color : ''"
              rounded="0"
              icon
              v-bind="props">
              <v-icon
                style="font-size: min(60px, 90cqh)"
                :icon="optionsIcon || 'mdi-dots-vertical'" />
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-btn-block',
  props: {
    color: { type: String },
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    sizeStyle() {
      return this.size ? `size-${this.size}` : 'size-default';
    },
    iconSize() {
      if (this.size === 'xx-large') return '42';
      return this.size;
    },
    colorClass() {
      if (this.outlined) {
        return 'bg-transparent';
      }
      return this.bgColor;
    },
    bgColor() {
      return `bg-${this.color}`;
    },
    outlined() {
      return this.variant === 'outlined';
    },
    borderColor() {
      if (!this.color) return '';
      if (this.color[0] === '#') return this.color;
      return `var(--v-${this.color}-base)`;
    },
    alignment() {
      if (this.size === 'x-small' || this.size === 'small')
        return !!this.$slots.subtitle ? 'center' : 'start';
      return 'center';
    },
  },
};
</script>

<style scoped>
.disabled {
  filter: grayscale(100%);
  opacity: 0.5;
}

.top-element {
  position: relative;
}

.light {
  top: 0px;
  width: 13.5px;
  height: 13.5px;
  position: absolute;
  display: block;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
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
  width: 32px;
  height: 32px;
}

.size-x-small {
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
  letter-spacing: 3px;
  min-height: 25px;
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  letter-spacing: 4px;
  min-height: 40px;
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  letter-spacing: 2px;
  min-height: 48px;
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
  letter-spacing: 3px;
  min-height: 64px;
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
  letter-spacing: 4px;
  min-height: 72px;
}

.size-xx-large {
  clip-path: polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px);
  letter-spacing: 4px;
  min-height: 84px;
}
</style>
