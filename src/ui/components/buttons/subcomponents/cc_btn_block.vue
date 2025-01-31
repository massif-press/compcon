<template>
  <v-card tile flat class="top-element" color="transparent" style="text-transform: uppercase">
    <v-row dense no-gutters :class="`${outlined && 'outlined'}`">
      <v-col>
        <span :class="`light ${size} ${bgColor}`" />
        <v-card
          :class="`${colorClass} ${sizeStyle} ${outlined && `border-sm text-${color}`}  px-4 pb-1`"
          :style="outlined ? `border-color: ${borderColor}!important;` : ''"
          style="padding: 2px 0 2px 0"
          tile
          :ripple="{ class: `text-${color}` }"
          :loading="loading"
          :disabled="disabled"
          :to="to"
          :href="href"
          :target="target"
          @click="$emit('click')">
          <v-row :align="alignment" dense>
            <v-col cols="auto">
              <v-icon v-if="prependIcon" :size="iconSize" :icon="prependIcon" start />
              <span v-else-if="size !== 'small' && size !== 'x-small'">&nbsp;</span>
            </v-col>
            <v-col>
              <div :style="`font-size: ${size}; margin-top: 1px`">
                <slot />
              </div>
              <div class="text-caption mt-n1"><slot name="subtitle" /></div>
            </v-col>
            <v-col cols="auto">
              <div class="text-caption"><slot name="info" /></div>
            </v-col>
            <v-col v-if="appendIcon" cols="auto">
              <v-icon :size="iconSize" :icon="appendIcon" start />
            </v-col>
            <v-col cols="auto">
              <v-tooltip v-if="tooltip" location="top" max-width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="fade-select"
                    :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
                </template>
                {{ tooltip }}
              </v-tooltip>
              <div v-else style="height: 14px" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="auto" v-if="$slots.options">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              style="height: 100%; margin-left: -1px; container-type: size"
              :variant="outlined ? 'outlined' : 'tonal'"
              :color="outlined ? color : ''"
              rounded="0"
              icon
              v-bind="props">
              <v-icon
                style="font-size: 90cqh; padding-bottom: 1px"
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
  computed: {
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
  font-size: 0.6rem;
  letter-spacing: 3px;
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  font-size: 0.75rem;
  letter-spacing: 4px;
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  letter-spacing: 2px;
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
  letter-spacing: 3px;
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
  letter-spacing: 4px;
}

.size-xx-large {
  clip-path: polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px);
  letter-spacing: 4px;
}
</style>
