<template>
  <v-container fluid class="mt-7">
    <pilot-header :pilot="pilot" />
    <v-fade-transition group mode="ease-in">
      <v-card v-show="page === 0" key="pcp0" color="red lighten-2">
        <h1>pilot info/hist/roleplay/flavor</h1>
        <v-card outlined height="150px" class="mx-5 my-1">full image (additional art?)</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">appearance desc</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">bio/hist</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">player notes</v-card>
      </v-card>
      <v-card v-show="page === 1" key="pcp1" color="blue lighten-2">
        <h1>pilot/dt related</h1>
        <v-card outlined height="150px" class="mx-5 my-1">skills</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">dt resources</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">orgs</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">loadouts</v-card>
      </v-card>
      <v-card v-show="page === 2" key="pcp2" color="green lighten-2">
        <h1>mech related</h1>
        <v-card outlined height="150px" class="mx-5 my-1">mech skills</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">core bonuses</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">talents</v-card>
      </v-card>
      <v-card v-show="page === 3" key="pcp3" color="orange lighten-2">
        <h1>pilot mech hangar</h1>
        <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
        <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
      </v-card>
    </v-fade-transition>
    <pilot-nav :selected="page" @set-page="page = $event" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotNav from './components/PilotNav.vue'
import PilotHeader from './views/PilotHeader.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'pilot-sheet',
  components: { PilotNav, PilotHeader },
  data: () => ({
    page: 1,
  }),
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
  },
})
</script>