<template>
  <v-container fluid style="overflow: hidden; margin-top: 48px; height: calc(100vh - 50px)">
    <v-row style="height: 100%" align="center">
      <v-col>
        <home-card
          title="NPC Roster"
          icon="mdi-account-edit"
          text="Design, edit, and manage NPCs for use in encounters."
          to="/gm/npc-roster"
        />
      </v-col>

      <v-col>
        <home-card
          title="Encounter Builder"
          icon="mdi-account-multiple-plus"
          text="Compose encounters with NPCs, objectives, and battlefield conditions"
          to="/gm/encounter-builder"
        />
      </v-col>

      <v-col>
        <home-card
          title="Mission Runner"
          icon="mdi-account-group"
          text="Run sets of encounters digitally with NPC and Pilot status tracking."
          to="/gm/mission"
          :icon-offset="13"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from './components/HomeCard.vue'

export default Vue.extend({
  name: 'home',
  components: { HomeCard },
})
</script>
