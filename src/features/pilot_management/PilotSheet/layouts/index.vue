<template>
  <div>
    <tabbed-layout v-if="profile.GetView('pilotSheet') === 'tabbed'" :page="tab" :pilot="pilot" />
    <classic-layout
      v-else-if="profile.GetView('pilotSheet') === 'classic'"
      :page="tab"
      :pilot="pilot"
    />
    <pilot-nav :pilot="pilot" :selected="tab" @set-layout="profile.SetView('pilotSheet', $event)" />
  </div>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/user'
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
    page: 2,
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.state.management.Pilots.find(p => p.ID === this.pilotID)
    },
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
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
