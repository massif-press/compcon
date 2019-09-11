<template>
  <v-container fluid>
    <h1 class="heading margin-nav pl-2">Pilot Roster</h1>
    <v-btn-toggle v-model="listOption" mandatory>
      <v-btn small icon>
        <v-icon color="primary">mdi-view-list</v-icon>
      </v-btn>
      <v-btn small icon>
        <v-icon color="primary">mdi-format-align-justify</v-icon>
      </v-btn>
    </v-btn-toggle>
    <roster-sort :pilots="pilots" @sort="sortPilots" />
    <v-slide-x-transition mode="out-in">
      <v-container v-if="listOption === 0" fluid>
        <v-row>
          <v-col v-for="p in pilots" :key="p.id" cols="12">
            <pilot-card :pilot="p" />
          </v-col>
        </v-row>
        <add-pilot />
      </v-container>
      <v-container v-else>
        <pilot-table :pilots="pilots" />
        <add-pilot />
      </v-container>
    </v-slide-x-transition>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RosterSort from './components/RosterSort.vue'
import PilotCard from './components/PilotCard.vue'
import PilotTable from './components/PilotTable.vue'
import AddPilot from './components/AddPilot.vue'

export default Vue.extend({
  name: 'roster-view',
  components: { RosterSort, PilotCard, PilotTable, AddPilot },
  data: () => ({
    pilots: [],
    listOption: 0,
  }),
  created() {
    this.pilots = this.$store.getters.getAllPilots
  },
  methods: {
    sortPilots(sortedPilots) {
      this.pilots = sortedPilots
    },
  },
})
</script>