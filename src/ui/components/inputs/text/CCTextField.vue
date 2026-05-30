<template>
  <div class="top-element mx-1"
    style="display: block; position: relative"
    v-bind="$attrs"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false">
    <v-text-field :model-value="modelValue"
      :color="color"
      :base-color="color"
      :variant="<any>variant"
      :loading="loading"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :clearable="clearable"
      :autofocus="autofocus"
      :width="width"
      :height="height"
      clear-icon="mdi-close-circle-outline"
      density="compact"
      hide-details
      :autocomplete="autocomplete"
      :type="type"
      :max="max"
      :rules="rules"
      :prefix="prefix"
      :suffix="suffix"
      :counter="counter"
      :hint="hint"
      rounded="0"
      :max-width="maxWidth"
      :bg-color="isFocused ? 'surface-variant' : bgColor"
      @update:focused="isFocused = $event"
      @update:model-value="$emit('update:model-value', $event)">
      <template #prepend>
        <div :class="`prepend bg-${color} ${isFocused && 'color-rotate'} `"
          :style="`min-width: ${icon ? '30' : '16'}px`">
          <v-icon v-if="icon"
            :icon="icon"
            class="mt-1 ml-3 mr-2" />
          <div v-if="label"
            class="d-inline-block text-cc-overline ml-3"
            style="line-height: 0; margin-top: 16px">
            {{ label }}
            <cc-slashes class="ml-1 mr-2" />
          </div>
        </div>
      </template>
      <template v-if="prependInnerIcon"
        #prepend-inner>
        <v-icon :icon="prependInnerIcon" />
      </template>
      <template #append>
        <v-menu v-if="$slots.options"
          offset-y>
          <template #activator="{ props }">
            <v-btn size="32"
              :color="color"
              icon
              :variant="<any>variant"
              tile
              flat
              v-bind="props"
              style="margin-left: -1px">
              <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>

        <div :class="`bg-${color} ${(isHovering || isFocused) && 'color-rotate'}`"
          style="
              transition: filter 0.2s ease-in-out;
              width: 3px;
              height: 100%;
              margin-left: 4px;
              z-index: 1;
            " />
        <span v-if="$slots.extra"
          class="pl-4">
          <slot name="extra" />
        </span>

        <v-tooltip v-if="tooltip"
          location="top"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              class="fade-select mx-1"
              :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
          </template>
          {{ tooltip }}
        </v-tooltip>
      </template>
      <template v-if="appendInnerIcon"
        #append-inner>
        <v-icon :icon="appendInnerIcon"
          @click.stop="$emit('click-append-inner')" />
      </template>
    </v-text-field>
    <v-slide-y-transition>
      <div v-if="details"
        class="text-right text-caption">
        {{ details }}
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  color?: string
  size?: string
  variant?: string
  prependInnerIcon?: string
  appendInnerIcon?: string
  block?: boolean
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  label?: string
  icon?: string
  clearable?: boolean
  tooltip?: string
  tooltipIcon?: string
  autofocus?: boolean
  details?: string
  readonly?: boolean
  optionsIcon?: string
  type?: string
  autocomplete?: string
  width?: string
  height?: string
  itemTitle?: string
  itemValue?: string
  hideDetails?: boolean
  maxWidth?: string
  items?: any[]
  max?: number | string
  density?: string
  dense?: boolean
  hideDetails?: boolean | string
  modelModifiers?: any
  bgColor?: string
  rules?: any[]
  prefix?: string
  suffix?: string
  counter?: boolean | number
  hint?: string
}>(), {
  color: 'panel',
  variant: 'solo',
  width: '100%',
  items: () => [],
  modelModifiers: () => ({}),
  bgColor: 'panel'
})

const emit = defineEmits<{
  'update:model-value': []
  'click-append-inner': []
}>()

const isFocused = ref(false)
const isHovering = ref(false)
</script>

<style scoped>
@import '@/ui/style/cc-input-field.css';

.color-rotate {
  filter: brightness(1.5) saturate(200%) hue-rotate(40deg);
}

.prepend {
  min-width: 16px;
}
</style>
