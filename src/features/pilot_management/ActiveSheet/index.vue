<template>
  <v-container fluid class="mt-4 ml-2">
    <turn-sidebar v-if="pilot.ActiveMech" :pilot="pilot" />
    <div style="height: 40px" />
    <div style="margin-right: 80px">
      <pilot-block :pilot="pilot" />
      <v-divider class="mt-2 mb-4" />
      <mech-block :pilot="pilot" />
      <counters-block :counter-data="pilot.CounterData" />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TurnSidebar from './turn/index.vue'
import PilotBlock from './layout/PilotBlock.vue'
import MechBlock from './layout/MechBlock.vue'
import CountersBlock from './layout/CountersBlock.vue'

import activePilot from '@/features/pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'active-sheet',
  components: {
    TurnSidebar,
    PilotBlock,
    MechBlock,
    CountersBlock,
  },

})
</script>
