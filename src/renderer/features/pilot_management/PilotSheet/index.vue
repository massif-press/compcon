<template>
  <v-container fluid class="mt-7">
    <template v-if="pilot">
      <pilot-header />
      <router-view></router-view>
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
import { PilotManagementStore } from '../store'
import { getModule } from 'vuex-module-decorators'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'pilot-sheet',
  components: { PilotHeader },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
  },
  mixins: [activePilot],
})
</script>
