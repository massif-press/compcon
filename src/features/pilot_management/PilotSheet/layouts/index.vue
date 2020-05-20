<template>
  <div>
    <tabbed-layout v-if="profile.PilotSheetView === 'tabbed'" :page="tab" :pilot="pilot" />
    <classic-layout v-else-if="profile.PilotSheetView === 'classic'" :page="tab" :pilot="pilot" />
    <pilot-nav :pilot="pilot" :selected="tab" @set-layout="profile.PilotSheetView = $event" />
  </div>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/io/User'
import TabbedLayout from './Tabbed.vue'
import ClassicLayout from './Classic.vue'
import PilotNav from '../components/PilotNav.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-sheet-content',
  components: { PilotNav, TabbedLayout, ClassicLayout },
  props: {
    tab: {
      type: String,
      required: true,
    },
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    page: 1,
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.state.management.Pilots.find(p => p.ID === this.pilotID)
    },
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  watch: {
    tab() {
      this.page = this.tab
    },
    layout() {
      this.page = 0
    },
  },
})
</script>
