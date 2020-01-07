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
    <roster-sort :pilots="pilots" @sort="onSort" />
    <v-slide-x-transition mode="out-in">
      <v-container v-if="profile.RosterView === 'list'" fluid>
        <v-row>
          <v-col v-for="p in pilots" :key="p.ID" cols="12">
            <cc-pilot-list-item :pilot="p" />
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
import PilotTable from './components/PilotTable.vue'
import AddPilot from './components/AddPilot.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { UserProfile } from '@/io/User'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'roster-view',
  components: { RosterSort, PilotTable, AddPilot },
  data: () => ({
    sortParams: null,
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
    pilotsUnsorted() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.Pilots
    },
    pilots() {
      if (!this.sortParams) return this.pilotsUnsorted
      return this.$_.orderBy(this.pilotsUnsorted, ...this.sortParams)
    },
  },
  methods: {
    onSort(sortParams: any[]) {
      this.sortParams = sortParams
    },
  },
})
</script>
