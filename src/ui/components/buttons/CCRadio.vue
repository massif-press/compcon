<template>
  <div style="display: flex">
    <v-icon
      v-if="prependIcon"
      style="align-self: center"
      :size="iconSize(prependIcon)"
      :start="!label"
      :icon="prependIcon" />
    <div v-if="label" class="d-inline-block text-cc-overline ml-3" style="align-self: center">
      {{ label }}
      <cc-slashes class="mr-2 ml-1" />
    </div>
    <v-hover>
      <template #default="{ props, isHovering }">
        <div
          v-bind="props"
          class="top-element"
          :style="`display: inline-block; position: relative`">
          <span :class="`light ${size} bg-${getLightColor(isHovering)}`" />
          <v-btn
            icon
            tile
            :size="iconSize('btn')"
            :class="`${size} ${isOn && 'on'} size-${size} bg-${bgColor}`"
            @click="toggle">
            <v-fade-transition leave-absolute>
              <v-btn v-if="isOn" icon tile :color="activeColor" :size="iconSize('btn')" />
            </v-fade-transition>
          </v-btn>
        </div>
      </template>
    </v-hover>

    <v-tooltip v-if="tooltip" location="top" max-width="300px">
      <template v-slot:activator="{ props }">
        <v-icon
          style="align-self: center"
          :size="iconSize('tt')"
          v-bind="props"
          class="fade-select mx-1"
          :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
      </template>
      {{ tooltip }}
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToggleIndicator } from '@/composables/useToggleIndicator'

interface Props {
  modelValue: boolean
  size?: string
  bgColor?: string
  color?: string
  activeColor?: string
  prependIcon?: string
  tooltip?: string
  tooltipIcon?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  bgColor: 'panel',
  color: 'primary',
  activeColor: 'success',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isOn = computed(() => props.modelValue)

function toggle() {
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
