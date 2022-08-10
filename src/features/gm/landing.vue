<template>
  <v-container fluid style="overflow: hidden; height: calc(100vh - 50px)">
    <v-row style="height: 100%" class="mt-1" align="center">
      <v-col cols="12">
        <v-row align="center" justify="center" dense>
          <landing-card
            cols="8"
            to="gm/campaigns"
            name="Campaign Manager"
            description="Create and run LANCER campaigns"
            :ratio="7"
            img="jungle.jpg"
            dark
          />
          <v-col cols="8">
            <v-btn block small outlined color="secondary" disabled>Continue Campaign</v-btn>
          </v-col>
          <v-col cols="8">
            <v-btn block small outlined color="secondary" disabled>Continue Encounter</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="panel lighten-1">
        <v-row align="center" justify="space-around" dense>
          <landing-card
            cols="2"
            to="gm/npcs"
            name="NPCS"
            description="Create and manage non-player characters"
            img="npc.jpg"
          />
          <landing-card
            cols="2"
            to="gm/encounters"
            name="Encounters"
            description="Create combat encounters"
            img="combat.jpg"
          />
          <landing-card
            cols="2"
            to="gm/characters"
            name="Characters"
            description="Manage non-player narrative characters"
            img="oda.jpg"
          />
          <landing-card
            cols="2"
            to="gm/locations"
            name="Locations"
            description="Manage locations and settings"
            img="location.jpg"
          />
          <landing-card
            cols="2"
            to="gm/factions"
            name="Factions"
            description="Manage factions and organizations"
            img="faction.jpg"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import LandingCard from './_components/LandingCard.vue'

export default Vue.extend({
  name: 'home',
  components: { LandingCard },
})
</script>
