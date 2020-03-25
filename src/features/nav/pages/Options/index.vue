<template>
  <v-tabs v-model="tab" dark background-color="primary" style="min-height: 640px;">
    <v-tab>Settings</v-tab>
    <v-tab>Log</v-tab>
    <v-tab-item>
      <v-card-text><settings /></v-card-text>
    </v-tab-item>
    <v-tab-item>
      <v-card-text><log /></v-card-text>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue'
import Settings from './Settings.vue'
import Log from './Log.vue'

export default Vue.extend({
  name: 'options',
  components: { Settings, Log },
  data: () => ({
    tab: 0,
  }),
})
</script>
