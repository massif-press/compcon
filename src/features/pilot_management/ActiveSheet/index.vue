<template>
  <v-container fluid class="mt-4 mx-2">
    <div style="height: 40px" />
    <div v-if="pilot && pilot.State">
      <v-fade-transition group leave-absolute>
        <active-narrative v-if="pilot.State.Stage === 'Narrative'" :key="'act-ft-tr-narrative'" />
        <active-combat v-else-if="pilot.State.Stage === 'Combat'" :key="'act-ft-tr-combat'" />
        <active-rest v-else-if="pilot.State.Stage === 'Rest'" :key="'act-ft-tr-rest'" />
      </v-fade-transition>
    </div>
    <div>
      <span class="overline">
        PLAYER NOTES
        <v-btn small right icon class="fadeSelect" @click="showNotes = !showNotes">
          <v-icon small v-html="showNotes ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
        </v-btn>
      </span>
      <v-textarea v-if="showNotes" v-model="pilot.Notes" outlined auto-grow color="accent" />
    </div>
    <div style="height: 60px" />
    <turn-footer />
  </v-container>
</template>

<script lang="ts">
import TurnSidebar from './turn/index.vue'
import ActiveCombat from './views/ActiveCombat.vue'
import ActiveNarrative from './views/ActiveNarrative.vue'
import ActiveRest from './views/ActiveRest.vue'
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
    ActiveCombat,
    ActiveNarrative,
    ActiveRest,
  },
  data: () => ({
    showNotes: false,
  }),
})
</script>
