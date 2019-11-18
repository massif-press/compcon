<template>
  <div>
    <tabbed-layout v-if="profile.PilotSheetView === 'tabbed'" :page="page" :pilot="pilot" />
    <classic-layout v-else-if="profile.PilotSheetView === 'classic'" :page="page" :pilot="pilot" />
    <pilot-nav
      :pilot="pilot"
      :selected="page"
      @set-page="page = $event"
      @set-layout="profile.PilotSheetView = $event"
    />
  </div>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/io/User'
import TabbedLayout from './Tabbed.vue'
import ClassicLayout from './Classic.vue'
import PilotNav from '../components/PilotNav.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-sheet-content',
  components: { PilotNav, TabbedLayout, ClassicLayout },
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