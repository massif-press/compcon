<template>
  <v-container fluid style="overflow: hidden; margin-top: 48px; height: calc(100vh - 50px)">
    <v-row style="height: 100%" align="center">
      <v-col>
        <home-card
          title="NPC Roster"
          icon="mdi-account-edit"
          text="Design, edit, and manage NPCs for use in encounters."
          to="npc-roster"
        />
      </v-col>

      <v-col>
        <home-card
          title="Encounter Builder"
          icon="mdi-account-multiple-plus"
          text="Compose encounters with NPCs, objectives, and battlefield conditions"
          to="encounter-builder"
        />
      </v-col>

      <v-col>
        <home-card
          title="Mission Runner"
          icon="mdi-account-group"
          text="Run sets of encounters digitally with NPC and Pilot status tracking."
          to="encounter-runner"
          :icon-offset="13"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from './components/Home/HomeCard.vue'
// import { getModule } from 'vuex-module-decorators';
// import { EncounterRunnerStore } from '../store/encounterRunner';

export default Vue.extend({
  name: 'home',
  components: { HomeCard },
  created() {
    this.$store.commit('npcDesigner/load')
    this.$store.commit('encounterBuilder/load')
    // <<<<<<< HEAD
    //     this.$store.commit('encounterRunner/load')
    //   },
    // =======
    // This below is equivalent one of the above lines.
    // ...it's more boilerplate and typing, but it's also
    // more type-safe and informative when debugging,
    // and is better supported by IDEs for intellisense.
    // const encounterRunnerStore = getModule(EncounterRunnerStore, this.$store)
    // encounterRunnerStore.load()
  },
})
</script>
