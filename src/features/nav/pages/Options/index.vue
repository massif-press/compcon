<template>
  <v-tabs dark background-color="primary" v-model="tab" style="min-height: 640px;">
    <v-tab>Settings</v-tab>
    <v-tab>Log</v-tab>
    <v-tab-item>
      <v-card-text><Settings /></v-card-text>
    </v-tab-item>
    <v-tab-item>
      <v-card-text><Log /></v-card-text>
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
    tab: 1
  })
})
</script>
