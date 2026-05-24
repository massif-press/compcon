<template>
  <component :is="component"
    v-bind="$props">
    <slot />
    <template v-if="!!$slots.options"
      #options>
      <slot name="options" />
    </template>
    <template v-if="!!$slots.subtitle"
      #subtitle>
      <slot name="subtitle" />
    </template>
    <template v-if="!!$slots.info"
      #info>
      <slot name="info" />
    </template>
    <template #tooltip>
      <slot name="tooltip" />
    </template>
    <template v-if="!!$slots.items"
      #items>
      <slot name="items" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import std from './subcomponents/cc_btn_std.vue'
import icn from './subcomponents/cc_btn_icon.vue'
import txt_icn from './subcomponents/cc_btn_icon_text.vue'
import ton from './subcomponents/cc_btn_tonal.vue'
import txt from './subcomponents/cc_btn_text.vue'
import blk from './subcomponents/cc_btn_block.vue'
import stk from './subcomponents/cc_btn_stk.vue'

interface Props {
  color?: string
  pipColor?: string
  disabled?: boolean
  block?: boolean
  stacked?: boolean
  loading?: boolean
  icon?: string | boolean
  size?: string | boolean
  variant?: string
  tooltip?: string
  tooltipIcon?: string
  prependIcon?: string
  appendIcon?: string
  optionsIcon?: string
  to?: string | object
  href?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  prependIcon: '',
  appendIcon: '',
})

const component = computed(() => {
  if (props.stacked) return stk
  if (props.block) {
    if (props.variant === 'text') return txt
    return props.variant === 'tonal' ? ton : blk
  }
  if (props.icon) {
    if (props.variant === 'text') return txt_icn
    if (props.variant === 'outlined') return txt_icn
    return icn
  }
  if (props.variant === 'text') return txt
  return props.variant === 'tonal' ? ton : std
})
</script>
