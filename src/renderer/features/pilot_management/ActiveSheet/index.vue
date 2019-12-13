<template>
  <v-container fluid style="margin-right: 40px">
    <turn-sidebar v-if="pilot.ActiveMech" :pilot="pilot" />
    <div style="height: 40px" />
    <pilot-block :pilot="pilot" />
    <v-divider class="mt-2 mb-4" />
    <mech-block :pilot="pilot" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TurnSidebar from './turn/index.vue'
import PilotBlock from './layout/PilotBlock.vue'
import MechBlock from './layout/MechBlock.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'active-sheet',
  components: {
    TurnSidebar,
    PilotBlock,
    MechBlock,
  },
  mixins: [activePilot],
})
</script>
