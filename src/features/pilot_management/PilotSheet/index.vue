<template>
  <v-container fluid class="mt-7">
    <template v-if="pilot">
      <pilot-header />
      <router-view class="mt-5" />
      <v-spacer style="min-height: 80px" />
    </template>
    <template v-else>
      <!-- TODO: make this look fancy -->
      <h1 style="margin-top: 50px; text-align: center">ERROR // INVALID PILOT</h1>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotHeader from './components/PilotHeader.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'pilot-sheet',
  components: { PilotHeader },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
  },
})
</script>
