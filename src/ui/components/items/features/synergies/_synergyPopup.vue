<template>
  <v-tooltip top>
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props">cc:talent</v-icon>
    </template>
    <synergy-base :synergy="synergy" />
  </v-tooltip>
</template>

<script lang="ts">
import synergyBase from './_synergyBase.vue';

export default {
  name: 'synergy-popup',
  components: { synergyBase },
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
};
</script>
