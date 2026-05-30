<template>
  <v-hover #default="{ isHovering, props }">
    <div class="top-element"
      style="display: block; position: relative"
      v-bind="props">
      <v-text-field :model-value.number="modelValue"
        :color="color"
        :base-color="color"
        :variant="<any>variant"
        :loading="loading"
        :disabled="disabled"
        :readonly="readonly"
        :clearable="clearable"
        :autofocus="autofocus"
        clear-icon="mdi-close-circle-outline"
        density="compact"
        hide-details
        rounded="0"
        class="shrink"
        :bg-color="isFocused ? 'surface-variant' : 'panel'"
        @click:clear="setVal(min > 0 ? min : 0)"
        @update:focused="isFocused = $event"
        @update:model-value="setVal($event)">
        <template #prepend>
          <div
            :class="`prepend bg-${color} ${isFocused && 'color-rotate'} ${(icon || label) && 'mr-n2'}`"
            :style="`min-width: ${icon ? '30' : '12'}px`">
            <v-icon v-if="icon"
              :icon="icon"
              :class="label && 'ml-2'"
              class="mt-1" />
            <div v-if="label"
              class="d-inline-block text-cc-overline ml-3"
              style="line-height: 0; margin-top: 16px">
              {{ label }}
              <cc-slashes class="ml-1 mr-2" />
            </div>
          </div>
        </template>
        <template v-if="controls"
          #prepend-inner>
          <v-btn icon
            variant="text"
            tile
            size="x-small"
            @click="setVal(<number>modelValue - 1)">
            <v-icon size="x-large"
              icon="mdi-minus" />
          </v-btn>
        </template>
        <template #append>
          <v-menu v-if="$slots.options"
            offset-y>
            <template v-slot:activator="{ props }">
              <v-btn size="32"
                :color="color"
                icon
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
          <v-tooltip v-if="tooltip"
            location="top"
            max-width="300px">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props"
                class="fade-select mr-1 ml-3"
                :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
            </template>
            {{ tooltip }}
          </v-tooltip>
        </template>
        <template v-if="controls"
          #append-inner>
          <v-btn icon
            variant="text"
            tile
            size="x-small"
            @click="setVal(<number>modelValue + 1)">
            <v-icon size="x-large"
              icon="mdi-plus" />
          </v-btn>
        </template>
      </v-text-field>
      <v-slide-y-transition>
        <div v-if="details"
          class="text-right text-caption">
          {{ details }}
        </div>
      </v-slide-y-transition>
    </div>
  </v-hover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { max, min } from 'lodash-es';

defineOptions({ name: 'CCTextField' })

const props = withDefaults(defineProps<{
  modelValue?: string | number
  min?: number | string
  max?: number | string
  density?: string
  dense?: boolean
  hideDetails?: boolean | string
  type?: string
  modelModifiers?: any
  color?: string
  size?: string
  variant?: string
  controls?: boolean
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
}>(), {
  min: 0,
  max: 100,
  modelModifiers: () => ({}),
  color: 'panel',
  variant: 'solo'
})

const emit = defineEmits<{
  'update:model-value': []
}>()

const isFocused = ref(false)

function setVal(val: string | number) {
      const value = max([min([val, props.max]), props.min]);
      emit('update:model-value', value);
    }
</script>

<style scoped>
@import '@/ui/style/cc-input-field.css';

.color-rotate {
  filter: brightness(3) saturate(200%) hue-rotate(40deg);
}
</style>
