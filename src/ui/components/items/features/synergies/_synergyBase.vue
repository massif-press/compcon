<template>
  <v-card-text>
    {{ synergy }}
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'synergy-base',
  props: {
    synergy: {
      type: Object,
      required: true,
    },
  },
})
</script>
