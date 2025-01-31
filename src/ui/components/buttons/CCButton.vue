<template>
  <component :is="component" v-bind="$props">
    <slot />
    <template #options v-if="!!$slots.options"><slot name="options" /></template>
    <template #subtitle v-if="!!$slots.subtitle"><slot name="subtitle" /></template>
    <template #info v-if="!!$slots.info"><slot name="info" /></template>
    <template #tooltip><slot name="tooltip" /></template>
  </component>
</template>

<script lang="ts">
import std from './subcomponents/cc_btn_std.vue';
import icn from './subcomponents/cc_btn_icon.vue';
import txt_icn from './subcomponents/cc_btn_icon_text.vue';
import ton from './subcomponents/cc_btn_tonal.vue';
import txt from './subcomponents/cc_btn_text.vue';
import blk from './subcomponents/cc_btn_block.vue';
import stk from './subcomponents/cc_btn_stk.vue';

export default {
  name: 'cc-button',
  props: {
    color: { type: String, default: '' },
    pipColor: { type: String, required: false },
    disabled: { type: Boolean },
    block: { type: Boolean },
    stacked: { type: Boolean },
    loading: { type: Boolean },
    icon: { type: [String, Boolean], required: false },
    size: { type: String, required: false },
    variant: { type: String, required: false },
    tooltip: { type: String, required: false },
    tooltipIcon: { type: String, required: false },
    prependIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    optionsIcon: { type: String },
    to: { type: [String, Object] },
    href: { type: String },
    target: { type: String },
  },
  computed: {
    component() {
      if (this.stacked) return stk;
      if (this.icon) {
        console.log(this.icon);
        if (this.variant === 'text') return txt_icn;
        if (this.variant === 'outlined') return txt_icn;
        return icn;
      }
      if (this.block) {
        if (this.variant === 'text') return txt;
        return this.variant === 'tonal' ? ton : blk;
      }
      if (this.variant === 'text') return txt;
      return this.variant === 'tonal' ? ton : std;
    },
  },
};
</script>
