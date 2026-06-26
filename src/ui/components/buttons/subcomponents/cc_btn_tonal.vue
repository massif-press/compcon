<template>
  <div
    class="top-element"
    :style="`display: ${block ? 'block' : 'inline-block'}; position: relative`">
    <div :class="`light ${size} ${lightColor}`" />
    <v-btn
      :class="`${sizeStyle} px-2`"
      :color="color"
      :loading="loading"
      tile
      :disabled="disabled"
      :block="block"
      variant="tonal"
      :href="href"
      :to="to"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click', $event)">
      <v-icon v-if="prependIcon" class="mx-2" :icon="prependIcon" />
      <span v-else>&nbsp;</span>
      <slot />
      <v-icon v-if="appendIcon" end :icon="appendIcon" />
      <cc-tooltip v-if="tooltip" :icon="tooltipIcon" :text="tooltip" end />
    </v-btn>
    <v-menu v-if="$slots.options" offset-y>
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

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'cc-btn-std' })

const props = withDefaults(defineProps<{
  color?: string
  disabled?: boolean
  block?: boolean
  loading?: boolean
  size?: string
  variant?: string
  prependIcon?: string
  appendIcon?: string
  optionsIcon?: string
  tooltip?: string
  tooltipIcon?: string
  href?: string
  to?: string | object
  target?: string
  pipColor?: string
}>(), {})

defineEmits<{ click: [payload: any] }>()

const sizeStyle = computed(() => props.size ? `size-${props.size}` : 'size-default')
const optionsSize = computed(() => props.size ? `options-${props.size}` : 'options-default')
const lightColor = computed(() => {
  if (props.pipColor) return `bg-${props.pipColor}`
  if (!props.color) return ''
  return `bg-${props.color || 'panel'}`
})
</script>

<style scoped>
@import './cc_btn_base.css';
@import './cc_btn_flat_size.css';

.light {
  display: block;
  height: 100%;
  width: 6px;
  position: absolute;
  opacity: 0.55;
  transition: all 0.2s ease-in-out;
}

.light.x-small {
  width: 4px;
}

.light.small {
  width: 5px;
}

.light.default {
  width: 7px;
}

.light.large {
  width: 9px;
}

.light.x-large {
  width: 12px;
}

.light.xx-large {
  width: 14px;
}

.size-small {
  font-size: 0.75rem;
  letter-spacing: 4px;
  height: 23px !important;
}
</style>
