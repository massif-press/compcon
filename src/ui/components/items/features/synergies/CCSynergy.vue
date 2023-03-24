<template>
  <component :is="panel ? 'synergyPanel' : 'synergyPopup'" :synergy="synergy" />
</template>

<script lang="ts">
import synergyPanel from './_synergyPanel.vue';
import synergyPopup from './_synergyPopup.vue';

export default {
  name: 'cc-synergy',
  components: { synergyPanel, synergyPopup },
  props: {
    synergy: {
      type: Object,
      required: true,
    },
    popup: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Boolean,
    },
  },
};
</script>
