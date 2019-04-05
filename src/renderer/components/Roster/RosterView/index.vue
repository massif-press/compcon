<template>
  <div class="roster-view">
    <v-container fluid class="pa-0 pt-3">
      <v-layout><v-flex class="text-xs-center roster-title"><span>pilot roster</span></v-flex></v-layout>
    </v-container>
    <v-container grid-list-xl fluid>
      <v-layout row wrap class="ml-2 mr-2" fill-height>
        <v-flex v-for="(p, i) in pilots" :key="p.id" class="mb-4" xs3>
          <pilot-card :pilot="p" :p-idx="i"/>
        </v-flex>
        <v-flex xs3><add-pilot-card /></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PilotCard from './PilotCard'
import AddPilotCard from './AddPilotCard'

export default {
  name: 'roster-view',
  components: { PilotCard, AddPilotCard },
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  }
}
</script>

<style>
  .roster-view {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background-color: #424242;
  }

  .roster-title {
    font-size: 35px;
    letter-spacing: 25px;
    font-weight: 100;
    text-transform: uppercase;
    color: #fff;
  }
</style>