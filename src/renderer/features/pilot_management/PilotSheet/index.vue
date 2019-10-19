<template>
  <v-container fluid class="mt-7">
    <pilot-header />
    <v-fade-transition group>
      <info-view v-show="page === 0" key="v0" :pilot="pilot" />
      <narrative-view v-show="page === 1" key="v1" :pilot="pilot" />
      <tactical-view v-show="page === 2" key="v2" :pilot="pilot" />
      <mech-hangar-view v-show="page === 3" key="v3" />
    </v-fade-transition>
    <pilot-nav :selected="page" @set-page="page = $event" />
    <v-spacer style="min-height: 80px" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotNav from './components/PilotNav.vue'
import PilotHeader from './views/PilotHeader.vue'
import NarrativeView from './views/narrative/index.vue'
import InfoView from './views/info/index.vue'
import TacticalView from './views/tactical/index.vue'
import MechHangarView from './views/hangar/index.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'pilot-sheet',
  components: { PilotNav, PilotHeader, NarrativeView, InfoView, TacticalView, MechHangarView },
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