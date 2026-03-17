<template>
  <v-row
    v-if="destroyed"
    style="position: absolute; top: 0; left: 0; right: 0; bottom: -13px; z-index: 1; opacity: 0.9"
    class="bg-panel text-center"
  >
    <v-col
      class="d-flex justify-center align-center heading h3"
      style="letter-spacing: 9px"
    >
      EQUIPMENT DESTROYED
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'EquipmentDestroyedOverlay',
  props: {
    destroyed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
