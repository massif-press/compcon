<template>
  <v-card
    v-if="description"
    tile
    color="panel"
    class="px-2 py-1 mb-2 clipped"
  >
    <p
      v-html-safe="description"
      style="white-space: pre-wrap"
    />
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'EquipmentFlavorDescription',
  props: {
    description: {
      type: String,
      default: null,
    },
  },
}
</script>
