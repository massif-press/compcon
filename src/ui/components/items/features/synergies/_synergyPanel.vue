<template>
  <v-alert outlined dense>
    <synergy-base :synergy="synergy" />
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import synergyBase from './_synergyBase.vue'

export default Vue.extend({
  name: 'synergy-panel',
  components: { synergyBase },
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
})
</script>
