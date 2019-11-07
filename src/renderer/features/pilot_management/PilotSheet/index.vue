<template>
  <v-container fluid class="mt-7">
    <pilot-header />
    <tabbed-layout v-if="layout === 'tabbed'" :page="page" :pilot="pilot" />
    <classic-layout v-else-if="layout === 'classic'" :page="page" :pilot="pilot" />
    <pilot-nav
      :pilot="pilot"
      :selected="page"
      @set-page="page = $event"
      @set-layout="pilot.PilotSheetLayout = $event"
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
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

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
    layout(): string {
      return this.pilot.PilotSheetLayout
    },
  },
  watch: {
    layout() {
      this.page = 0
    },
  },
})
</script>