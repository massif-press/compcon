<template>
  <v-tooltip :open-on-hover="!mobile"
    :open-on-click="mobile"
    max-width="350px"
    :location="getLocation">
    <template #activator="{ props }">
      <v-icon v-bind="showTooltip ? props : ''"
        :icon="getIcon"
        :start="start"
        :end="end"
        :color="color"
        style="align-self: center; margin-top: -3px"
        :size="size" />
    </template>
    <template #default>
      <span v-if="text"
        v-html-safe="text" />
      <slot v-else />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { Anchor } from 'vuetify'

const slots = useSlots()

interface Props {
  text?: string
  icon?: string
  start?: boolean
  end?: boolean
  size?: string | number
  location?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  start: false,
  end: false,
  location: 'top',
  color: '',
})

const getIcon = computed(() => props.icon || 'mdi-information-slab-box-outline')
const showTooltip = computed(() => props.text || slots.default)
const mobile = computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
const getLocation = computed(() => (mobile.value ? 'top' : props.location) as Anchor)
</script>
