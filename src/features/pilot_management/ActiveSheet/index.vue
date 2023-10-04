<template>
  <v-container fluid :class="`mt-4 ${$vuetify.display.mdAndUp ? 'mx-2' : ''} `">
    <div style="height: 40px" />
    <div v-if="pilot && pilot.State">
      <v-fade-transition group leave-absolute>
        <active-narrative v-if="pilot.State.Stage === 'Narrative'" />
        <active-combat v-else-if="pilot.State.Stage === 'Combat'" />
        <active-rest v-else-if="pilot.State.Stage === 'Rest'" />
      </v-fade-transition>
    </div>
    <div>
      <div class="text-overline my-2">
        PLAYER NOTES
        <v-btn small right icon variant="plain" @click="showNotes = !showNotes">
          <v-icon small v-html="showNotes ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
        </v-btn>
      </div>
      <v-textarea
        v-if="showNotes"
        v-model="pilot.Notes"
        variant="outlined"
        auto-grow
        color="accent"
      />
    </div>
    <div style="height: 60px" />
    <turn-footer />
  </v-container>
</template>

<script lang="ts">
import ActiveCombat from './views/ActiveCombat.vue';
import ActiveNarrative from './views/ActiveNarrative.vue';
import ActiveRest from './views/ActiveRest.vue';
import MechBlock from './layout/MechBlock.vue';
import TurnFooter from './layout/TurnFooter.vue';

export default {
  name: 'active-sheet',
  components: {
    MechBlock,
    TurnFooter,
    ActiveCombat,
    ActiveNarrative,
    ActiveRest,
  },
  data: () => ({
    showNotes: false,
  }),
};
</script>
