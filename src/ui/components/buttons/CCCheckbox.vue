<template>
  <div style="display: flex">
    <v-icon
      v-if="prependIcon"
      style="align-self: center"
      :size="iconSize(prependIcon)"
      :start="!label"
      :icon="prependIcon"
    />
    <div
      v-if="label"
      class="d-inline-block text-cc-overline ml-3"
      style="align-self: center"
    >
      {{ label }}
      <cc-slashes class="mr-2 ml-1" />
    </div>
    <v-hover>
      <template #default="{ props, isHovering }">
        <div
          v-bind="props"
          class="top-element"
          :style="`display: inline-block; position: relative`"
        >
          <span :class="`light ${size} bg-${getLightColor(isHovering)}`" />
          <v-btn
            icon
            tile
            role="checkbox"
            :aria-checked="isOn"
            :aria-label="ariaLabel"
            :disabled="disabled"
            :size="iconSize('btn')"
            :class="`${size} ${isOn && 'on'} size-${size} bg-${bgColor}`"
            @click="toggle"
          >
            <v-slide-x-transition leave-absolute>
              <v-icon
                v-if="isOn"
                style="align-self: center"
                :color="activeColor"
                :size="iconSize(onIcon || 'mdi-check-bold')"
                :icon="onIcon || 'mdi-check-bold'"
              />
              <v-icon
                v-if="!isOn && offIcon"
                style="align-self: center; opacity: 0.5"
                :color="color"
                :size="iconSize(offIcon || 'mdi-cancel')"
                :icon="offIcon || 'mdi-cancel'"
              />
            </v-slide-x-transition>
          </v-btn>
        </div>
      </template>
    </v-hover>

    <v-tooltip
      v-if="tooltip"
      location="top"
      max-width="300px"
      :open-on-click="mobile"
    >
      <template #activator="{ props }">
        <v-icon
          style="align-self: center"
          :size="iconSize('tt')"
          v-bind="props"
          class="fade-select mx-1"
          :icon="tooltipIcon || 'mdi-information-slab-box-outline'"
        />
      </template>
      {{ tooltip }}
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useToggleIndicator } from '@/composables/useToggleIndicator'

const { smAndDown: mobile } = useDisplay()

interface Props {
  modelValue: boolean
  size?: string
  bgColor?: string
  color?: string
  activeColor?: string
  prependIcon?: string
  onIcon?: string
  offIcon?: string
  tooltip?: string
  tooltipIcon?: string
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  bgColor: 'panel',
  color: 'primary',
  activeColor: 'success',
  onIcon: 'mdi-check-bold',
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isOn = computed(() => props.modelValue)

const ariaLabel = computed(() => props.label || props.tooltip || undefined)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !isOn.value)
}

const { iconSize, getLightColor } = useToggleIndicator(
  () => props.size,
  () => props.color,
  () => props.activeColor,
  isOn
)
</script>

<style scoped>
@import '@/ui/style/toggle-indicator.css';
</style>
