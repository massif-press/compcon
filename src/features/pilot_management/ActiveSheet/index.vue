<template>
  <v-container fluid class="mt-4 ml-2">
    <turn-sidebar v-if="pilot.ActiveMech" :pilot="pilot" />
    <div style="height: 40px" />
    <div style="margin-right: 80px">
      <pilot-block :pilot="pilot" />
      <mech-block :pilot="pilot" />
    </div>
  </v-container>
</template>

<script lang="ts">
import TurnSidebar from './turn/index.vue'
import PilotBlock from './layout/PilotBlock.vue'
import MechBlock from './layout/MechBlock.vue'

import activePilot from '@/features/pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'active-sheet',
  components: {
    TurnSidebar,
    PilotBlock,
    MechBlock,
  },
})
</script>
