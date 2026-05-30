<template>
  <v-toolbar
    flat
    density="compact"
    :color="color"
    class="ma-0 pa-0"
    :class="mobile ? 'parent-mobile' : 'parent'"
    :extended="extended"
    :extension-height="extensionHeight">
    <v-row no-gutters align="center" class="mx-2" :class="mobile && 'mt-n3'" style="height: 100%">
      <v-col cols="auto">
        <v-icon v-if="icon" :icon="icon" start />
      </v-col>
      <v-col>
        <div
          class="heading h3"
          :style="portrait && 'max-width: 250px'"
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
          {{ title }}
          <slot name="title" />
        </div>
        <div v-if="hasSubtitleContent" class="text-cc-overline text-disabled pb-2">
          <slot name="subtitle" />
        </div>
      </v-col>
      <v-divider
        v-if="hasToolbarItemContent && !extended && !mobile"
        vertical
        class="ts mx-6"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-col cols="auto">
        <v-toolbar-items>
          <slot name="toolbar-items" />
        </v-toolbar-items>
      </v-col>
      <v-divider
        v-if="!mobile && !extended && !hideClose"
        vertical
        class="mx-6"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-col cols="auto" v-if="!hideClose">
        <v-btn @click="$emit('close')" tile size="small" icon variant="text" class="fade-select">
          <v-icon :size="mobile ? 30 : 40">mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="extended" #extension>
      <slot name="extension" />
    </template>
  </v-toolbar>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useMobile } from '@/composables/useMobile'
import { useTheme } from 'vuetify'

const props = defineProps({
    color: { type: String, default: 'primary' },
    title: { type: String, default: '' },
    icon: { type: String },
    extended: { type: Boolean },
    hideClose: { type: Boolean, default: false },
    extensionHeight: { type: String, default: 'auto' },
  })

const { mobile, portrait } = useMobile()
const slots = useSlots()
const theme = useTheme()

function _hasContent(prop: string) {
  const slot = slots[prop]
  if (slot && slot()[0] && slot()[0].children) {
    return (slot()[0].children as any).length > 0
  }
  return false
}

const hasToolbarItemContent = computed(() => _hasContent('toolbar-items'))
const hasExtensionContent = computed(() => _hasContent('extension'))
const hasSubtitleContent = computed(() => _hasContent('subtitle'))
const hexColor = computed(() => {
  if (props.color[0] === '#') return props.color
  return (theme.themes.value[theme.global.name.value] as any).colors?.[props.color] || props.color
})
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}

.parent-mobile:deep(.v-toolbar__content) {
  max-height: 28px;
}
</style>
