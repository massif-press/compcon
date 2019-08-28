<template>
  <div>
    <h1 class="heading margin-nav">Pilot Roster</h1>

    <v-menu offset-y open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn icon absolute top right class="margin-nav-absolute" v-on="on">
          <v-icon>mdi-sort</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-for="s in sorts" :key="s.name">
          <v-list-item-title>{{ s.name }}</v-list-item-title>
          <v-spacer class="ml-3" />
          <v-btn icon class="pa-0 ma-0" @click="sortBy(s, true)">
            <v-icon color="primary">mdi-sort-ascending</v-icon>
          </v-btn>
          <v-btn icon class="pa-0 ma-0" @click="sortBy(s, false)">
            <v-icon color="primary">mdi-sort-descending</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-container grid-list-xl fluid>
      <v-row wrap class="ml-2 mr-2 mb-5" fill-height>
        <v-col v-for="(p, i) in pilots" :key="p.id" class="mb-4" xs3>
          <pilot-card :pilot="p" :p-idx="i" :card-height="cardHeight" />
        </v-col>
        <v-col xs3 class="mb-4">
          <add-pilot-card :card-height="cardHeight" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import PilotCard from './PilotCard.vue'
import AddPilotCard from './AddPilotCard.vue'

export default Vue.extend({
  name: 'roster-view',
  components: { PilotCard, AddPilotCard },
  data: () => ({
    sorts: [
      { name: 'Created', field: '' },
      { name: 'Callsign', field: 'Callsign' },
      { name: 'Name', field: 'Name' },
      { name: 'License Level', field: 'Level' },
    ],
    currentSort: { name: 'Created', field: '' },
    ascending: false,
    cardHeight: 300,
  }),
  computed: {
    pilots(): Pilot[] {
      const vm = this
      var allPilots = vm.$store.getters['getAllPilots']
      if (vm.currentSort && vm.currentSort.field !== '') {
        allPilots =
          vm.currentSort.field === 'Level'
            ? vm.$_.sortBy(allPilots, vm.currentSort.field)
            : vm.$_.sortBy(allPilots, p => p[vm.currentSort.field].toLowerCase())
      }
      if (!vm.ascending) {
        return vm.$_.reverse(vm.$_.clone(allPilots))
      }
      return allPilots
    },
  },
  methods: {
    sortBy(sort: { name: string; field: string }, isAscending: boolean) {
      this.currentSort = sort
      this.ascending = isAscending
    },
  },
})
</script>