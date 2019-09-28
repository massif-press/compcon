<template>
  <v-container
    fluid
    style="display: flex;"
    align-center
    :style="{ padding: $vuetify.breakpoint.lgAndUp ? '0 20%' : 0 }"
    fill-height
  >
    <v-row align-center wrap>
      <v-col cols="12" md4>
        <HomeCard
          title="NPC Designer"
          icon="mdi-account-edit"
          text="Build NPCs to use in encounters."
          to="npc-designer"
        />
      </v-col>

      <v-col cols="12" md4>
        <HomeCard
          title="Encounter Builder"
          icon="mdi-account-multiple-plus"
          text="Compose encounters using your NPCs."
          to="encounter-builder"
        />
      </v-col>

      <v-col cols="12" md4>
        <HomeCard
          title="Encounter Runner"
          icon="mdi-account-group"
          text="Run your encounters digitally with NPC status tracking."
          to="encounter-runner"
          :icon-offset="13"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from '../components/Home/HomeCard.vue'
import { getModule } from 'vuex-module-decorators';
import { EncounterRunnerStore } from '../store/encounterRunner';

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
    const encounterRunnerStore = getModule(EncounterRunnerStore, this.$store)
    encounterRunnerStore.load()
  }
})
</script>
