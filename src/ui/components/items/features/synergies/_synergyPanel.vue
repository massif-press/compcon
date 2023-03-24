<template>
  <v-alert variant="outlined" dense>
    <synergy-base :synergy="synergy" />
  </v-alert>
</template>

<script lang="ts">
import synergyBase from './_synergyBase.vue';

export default {
  name: 'synergy-panel',
  components: { synergyBase },
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
};
</script>
