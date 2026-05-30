<template>
  <v-card class="parent"
    style="corner-shape: bevel; border-bottom-right-radius: 16px !important"
    :class="small ? 'small' : ''"
    :color="color"
    flat
    tile
    :ripple="false"
    :border="border"
    :height="height"
    :variant="variant">
    <slot name="toolbar" />
    <v-toolbar v-if="hasTitle"
      flat
      density="compact"
      :color="titleColor"
      class="ma-0 pa-0">
      <div class="mt-n1 px-2 pt-2 pb-1">
        <div class="text-cc-overline">
          <slot name="title-prepend" />
          <v-icon v-if="icon"
            :icon="icon"
            start
            class="mt-n1" />
          <span v-if="title"
            v-text="title" />
          <slot v-else-if="$slots.title"
            name="title" />
        </div>
      </div>
      <v-spacer />
      <v-toolbar-items>
        <slot name="toolbar-items" />
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text :class="[densityClass, variantClass]"
      :style="[height && `height: ${height}`]"
      style="overflow-y: scroll">
      <slot />
    </v-card-text>
    <div v-if="border"
      class="clip-fix" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()

interface Props {
  color?: string
  titleColor?: string
  border?: boolean
  density?: string
  variant?: string
  title?: string | boolean
  icon?: string | boolean
  height?: string
  clickable?: boolean
  stark?: boolean
  small?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'light-panel',
  titleColor: 'panel',
  border: false,
  density: '',
  variant: 'elevated',
  title: '',
  icon: '',
  clickable: false,
  stark: false,
  small: false,
})

defineEmits<{ click: [] }>()

const hasTitle = computed(() => slots.title || props.title || props.icon || slots['toolbar-items'])

const densityClass = computed(() => {
  switch (props.density) {
    case 'no-gutters': return 'pa-0'
    case 'compact': return 'pa-2'
    case 'comfortable': return 'py-3 px-8'
    default: return 'py-2 px-5'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'flavor': return 'text-cc-flavor'
    case 'fluff': return 'text-cc-fluff'
    case 'admin': return 'text-cc-overline'
    case 'emphasis': return 'text-cc-emphasis'
    case 'subtle': return 'text-cc-subtle'
    case 'effect': return 'text-cc-effect'
    default: return ''
  }
})
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}
</style>
