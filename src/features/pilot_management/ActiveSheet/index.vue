<template>
  <v-container fluid class="mt-4 mx-2">
    <!-- <turn-sidebar v-if="pilot.ActiveMech" :pilot="pilot" /> -->
    <div style="height: 40px" />
    <div>
      <pilot-mode v-if="!pilot.Mounted" :pilot="pilot" />
      <mech-block v-else :pilot="pilot" />
    </div>
    drone tracker
    <br />
    deployable tracker
    <div style="height: 60px" />
    <turn-footer v-if="pilot.Mounted" :pilot="pilot" />
  </v-container>
</template>

<script lang="ts">
import TurnSidebar from './turn/index.vue'
import PilotMode from './layout/PilotMode.vue'
import MechBlock from './layout/MechBlock.vue'
import TurnFooter from './layout/TurnFooter.vue'

import activePilot from '@/features/pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'active-sheet',
  components: {
    TurnSidebar,
    PilotMode,
    MechBlock,
    TurnFooter,
  },
})
</script>
