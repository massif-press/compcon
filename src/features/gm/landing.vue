<template>
  <v-container fluid :style="`overflow: hidden; height: calc(100vh - ${mobile ? '20px' : '50px'})`">
    <v-row dense justify="space-around" align="center" class="mt-n1">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div
          class="font-weight-light text-center my-n2"
          style="letter-spacing: 2vw !important; font-size: 2vw !important">
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
        :max-height="mobile ? '82vh' : '88vh'" />

      <v-col>
        <v-row>
          <landing-card
            to="gm/npcs"
            name="NPCS"
            description="Manage non-player combat units"
            img="npcs"
            :max-height="mobile ? '38vh' : '42.73vh'" />
          <landing-card
            to="gm/encounters"
            name="Encounters"
            description="Create combat encounters"
            img="encounters"
            :max-height="mobile ? '38vh' : '42.73vh'" />
        </v-row>
        <v-row>
          <landing-card
            to="gm/narrative"
            name="Narrative Elements"
            description="Manage characters, locations, and factions"
            img="location"
            :max-height="mobile ? '38vh' : '42.73vh'" />
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
