<template>
  <v-container fluid class="mt-7">
    <pilot-header />
    <tabbed-layout v-if="profile.PilotSheetView === 'tabbed'" :page="page" :pilot="pilot" />
    <classic-layout v-else-if="profile.PilotSheetView === 'classic'" :page="page" :pilot="pilot" />
    <pilot-nav
      :pilot="pilot"
      :selected="page"
      @set-page="page = $event"
      @set-layout="profile.PilotSheetView = $event"
    />
    <v-spacer style="min-height: 80px" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotNav from './components/PilotNav.vue'
import PilotHeader from './components/PilotHeader.vue'
import TabbedLayout from './layouts/Tabbed.vue'
import ClassicLayout from './layouts/Classic.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'pilot-sheet',
  components: { PilotNav, PilotHeader, TabbedLayout, ClassicLayout },
  data: () => ({
    page: 1,
  }),
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  watch: {
    layout() {
      this.page = 0
    },
  },
})
</script>