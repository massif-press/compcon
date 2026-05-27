<template>
  <div
    class="top-element"
    :style="`display: ${block ? 'block' : 'inline-block'}; position: relative`">
    <v-btn
      :class="`${sizeStyle} px-0 `"
      :color="color"
      :loading="loading"
      tile
      :disabled="disabled"
      :block="block"
      variant="text"
      :to="to"
      :href="href"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click', $event)">
      <v-icon v-if="prependIcon" start :icon="prependIcon" />
      <slot />
      <v-icon v-if="appendIcon" end :icon="appendIcon" />
      <cc-tooltip v-if="tooltip" :icon="tooltipIcon" :text="tooltip" end />
    </v-btn>

    <v-menu v-if="hasOptions" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          variant="text"
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
    sizeStyle() {
      return this.size ? `size-${this.size}` : 'size-default';
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
@import './cc_btn_base.css';
@import './cc_btn_flat_size.css';

.light {
  top: 0;
  width: 4px;
  height: 100%;
  position: absolute;
  opacity: 0.25;
  transition: all 0.2s ease-in-out;
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

.size-small {
  font-size: 0.75rem !important;
  letter-spacing: 2px;
  height: 20px !important;
}
</style>
