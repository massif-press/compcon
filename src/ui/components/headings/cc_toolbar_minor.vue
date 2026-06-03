<template>
  <v-toolbar
    flat
    density="compact"
    :color="color"
    class="ma-0 pa-0 parent"
    :extended="extended"
    :extension-height="extensionHeight">
    <v-toolbar-title style="margin-top: -6px; margin-left: 6px">
      <span class="text-cc-overline">
        <v-icon v-if="icon" :icon="icon" start style="padding-bottom: 2px" />
        <span v-text="title" />
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <slot name="toolbar-items" />
      <v-icon v-if="!hideClose" class="fade-select mr-1" @click="$emit('close')">mdi-close</v-icon>
    </v-toolbar-items>
    <template v-if="extended" #extension>
      <slot name="extension" />
    </template>
  </v-toolbar>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'

const props = defineProps({
    color: { type: String, default: 'primary' },
    title: { type: String, default: '' },
    icon: { type: String },
    extended: { type: Boolean },
    hideClose: { type: Boolean, default: false },
    extensionHeight: { type: String, default: 'auto' },
  })

const { smAndDown: mobile, xs: portrait } = useDisplay()
const slots = useSlots()
const theme = useTheme()

function _hasContent(prop: string) {
  const slot = slots[prop]
  if (slot && slot()[0] && slot()[0].children) {
    return (slot()[0].children as any).length > 0
  }
  return false
}

const hasExtensionContent = computed(() => _hasContent('extension'))
const hexColor = computed(() => {
  if (props.color[0] === '#') return props.color
  return (theme.themes.value[theme.global.name.value] as any).colors?.[props.color] || props.color
})
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}
</style>
