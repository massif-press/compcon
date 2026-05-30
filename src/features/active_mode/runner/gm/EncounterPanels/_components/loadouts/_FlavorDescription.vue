<template>
  <v-card v-if="description"
    tile
    color="panel"
    class="px-2 py-1 mb-2 clipped">
    <p v-html-safe="description"
      style="white-space: pre-wrap; overflow: hidden; word-break: break-word; max-width: 100%;" />
  </v-card>
</template>

<script setup lang="ts">
defineOptions({ name: 'EquipmentFlavorDescription' })

const props = withDefaults(defineProps<{
  description?: string
}>(), {
  description: null
})
</script>
