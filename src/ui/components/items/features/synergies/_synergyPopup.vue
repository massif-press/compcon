<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">cci-talent</v-icon>
    </template>
    <synergy-base :synergy="synergy" />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import synergyBase from './_synergyBase.vue'

export default Vue.extend({
  name: 'synergy-popup',
  components: { synergyBase },
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
})
</script>
