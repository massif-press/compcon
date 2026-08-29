<template>
  <v-card v-if="description && layout.showFlavor"
    tile
    color="panel"
    class="px-2 py-1 mb-2 clipped">
    <p v-html-safe="description"
      style="white-space: pre-wrap; overflow: hidden; word-break: break-word; max-width: 100%;" />
  </v-card>
</template>

<script setup lang="ts">
import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

defineOptions({ name: 'EquipmentFlavorDescription' })

const { layout } = useLayoutOptions()

const props = withDefaults(defineProps<{
  description?: string
}>(), {
  description: undefined
})
</script>
