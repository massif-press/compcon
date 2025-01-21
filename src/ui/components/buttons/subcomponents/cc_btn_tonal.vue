<template>
  <div
    class="top-element"
    :style="`display: ${block ? 'block' : 'inline-block'}; position: relative`">
    <span :class="`light ${size} ${colorClass}`" />
    <v-btn
      :class="`${sizeStyle} pr-2`"
      :color="color"
      :loading="loading"
      tile
      :disabled="disabled"
      :block="block"
      variant="tonal">
      <v-icon v-if="prependIcon" start :icon="prependIcon" />
      <slot />
      <v-icon v-if="appendIcon" end :icon="appendIcon" />
      <v-tooltip v-if="tooltip" location="top">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            end
            class="fade-select"
            :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
        </template>
        {{ tooltip }}
      </v-tooltip>
    </v-btn>
    <v-menu v-if="hasOptions" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          variant="tonal"
          :class="`${optionsSize}`"
          style="opacity: 0.5"
          :style="` ${block ? 'position: absolute; right: 0; top: 0' : ''}`"
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
    color: { type: String, default: 'accent' },
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
  },
  computed: {
    sizeStyle() {
      return this.size ? `size-${this.size}` : 'size-default';
    },
    colorClass() {
      return `bg-${this.color}`;
    },
    optionsSize() {
      return this.size ? `options-${this.size}` : 'options-default';
    },
    hasOptions() {
      return !!this.$slots.options;
    },
  },
};
</script>

<style scoped>
.v-btn {
  position: relative;
}

.light {
  display: block;
  top: 0;
  width: 4px;
  height: 100%;
  position: absolute;
  opacity: 0.25;
  transition: all 0.2s ease-in-out;
}

.top-element:hover .light {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  height: 16px;
  margin-top: 5.25px;
  width: 2px;
}

.light.small {
  height: 22px;
  margin-top: 2.5px;
  width: 3px;
}

.light.large {
  width: 5px;
}

.light.x-large {
  width: 6.5px;
}

.light.xx-large {
  width: 8px;
}

.size-x-small {
  font-size: 0.6rem;
  letter-spacing: 3px;
  height: 16px !important;
}

.size-small {
  font-size: 0.75rem;
  letter-spacing: 4px;
  height: 20px !important;
}

.size-default {
  font-size: 0.85rem;
  letter-spacing: 3px;
  height: 34px !important;
}

.size-large {
  font-size: 1.2rem;
  letter-spacing: 4px;
  font-weight: 500;
  height: 40px !important;
}

.size-x-large {
  font-size: 1.6rem;
  letter-spacing: 6px;
  font-weight: 600;
  height: 50px !important;
}

.size-xx-large {
  font-size: 2.3rem;
  letter-spacing: 10px;
  font-weight: 600;
  height: 64px !important;
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
