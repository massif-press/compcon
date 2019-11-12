<template>
  <v-container fluid>
    <h1 class="heading margin-nav pl-2">Pilot Roster</h1>
    <v-btn-toggle v-model="profile.RosterView" mandatory>
      <v-btn small icon value="list">
        <v-icon color="primary">mdi-view-list</v-icon>
      </v-btn>
      <v-btn small icon value="table">
        <v-icon color="primary">mdi-format-align-justify</v-icon>
      </v-btn>
    </v-btn-toggle>
    <roster-sort :pilots="pilots" @sort="sortPilots" />
    <v-slide-x-transition mode="out-in">
      <v-container v-if="profile.RosterView === 'list'" fluid>
        <v-row>
          <v-col v-for="p in pilots" :key="p.id" cols="12">
            <pilot-list-item :pilot="p" />
          </v-col>
        </v-row>
        <add-pilot />
      </v-container>
      <v-container v-else fluid>
        <pilot-table :pilots="pilots" class="mx-4" />
        <add-pilot />
      </v-container>
    </v-slide-x-transition>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RosterSort from './components/RosterSort.vue'
import PilotListItem from './components/PilotListItem.vue'
import PilotTable from './components/PilotTable.vue'
import AddPilot from './components/AddPilot.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'roster-view',
  components: { RosterSort, PilotListItem, PilotTable, AddPilot },
  data: () => ({
    pilots: [],
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  created() {
    const store = getModule(PilotManagementStore, this.$store)
    this.pilots = store.Pilots
  },
  methods: {
    sortPilots(sortedPilots) {
      this.pilots = sortedPilots
    },
  },
})
</script>