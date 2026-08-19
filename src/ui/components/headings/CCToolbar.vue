<template>
  <component
    :is="component"
    v-bind="$props"
  >
    <template #title>
      <slot name="title" />
    </template>
    <template #subtitle>
      <slot name="subtitle" />
    </template>
    <template #toolbar-items>
      <slot name="toolbar-items" />
    </template>
    <template #extension>
      <slot name="extension" />
    </template>
    <slot />
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import MinorToolbar from './cc_toolbar_minor.vue'
  import MajorToolbar from './cc_toolbar_major.vue'

  defineOptions({ name: 'cc-toolbar' })

  const props = withDefaults(
    defineProps<{
      type?: string
      title?: string
      color?: string
      minor?: boolean
      hideClose?: boolean
      extended?: boolean
      extensionHeight?: string
    }>(),
    {
      type: 'minor',
      extensionHeight: 'auto',
    }
  )

  const component = computed(() => {
    if (props.minor) {
      return MinorToolbar
    }
    return MajorToolbar
  })
</script>
