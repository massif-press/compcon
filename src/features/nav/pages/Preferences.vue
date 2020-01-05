<template>
  <div>
    <h4 class="title secondary--text text--lighten-1">Appearance</h4>
    <v-switch v-model="$vuetify.theme.dark" color="primary" label="Dark mode" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'preferences',
  watch: {
    '$vuetify.theme.dark': function() {
      console.log('theme changed')
    }
  }
})
</script>