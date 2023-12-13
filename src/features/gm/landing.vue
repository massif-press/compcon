<template>
  <v-container fluid style="overflow: hidden; height: calc(100vh - 50px)">
    <v-row justify="space-around" align="center" class="mt-0">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div
          class="font-weight-light text-center my-n2"
          style="letter-spacing: 2vw !important; font-size: 2vw !important"
        >
          GM TOOLKIT
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row class="mt-1" align="start">
      <landing-card
        cols="4"
        to="gm/campaigns"
        name="Campaign Manager"
        description="Create, modify, and browse LANCER campaigns"
        img="campaign"
        max-height="84.7vh"
      />

      <v-col>
        <v-row>
          <landing-card
            to="gm/npcs"
            name="NPCS"
            description="Manage non-player combat units"
            img="npcs"
            max-height="41vh"
          />
          <landing-card
            to="gm/encounters"
            name="Encounters"
            description="Create combat encounters"
            img="encounters"
            max-height="41vh"
          />
        </v-row>
        <v-row>
          <landing-card
            to="gm/characters"
            name="Characters"
            description="Manage non-player characters"
            img="characters"
            max-height="41vh"
          />
          <landing-card
            to="gm/locations"
            name="Locations"
            description="Manage locations and settings"
            img="location"
            max-height="41vh"
          />
          <landing-card
            to="gm/factions"
            name="Factions"
            description="Manage factions and organizations"
            img="factions"
            max-height="41vh"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import LandingCard from './_components/LandingCard.vue';

export default {
  name: 'home',
  components: { LandingCard },
};
</script>
