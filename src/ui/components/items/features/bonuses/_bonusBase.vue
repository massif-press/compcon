<template>
  <v-card-text>
    {{ bonus }}
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'bonus-base',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
