<template>
  <v-container fluid
    :style="`overflow: hidden; height: calc(100vh - ${mobile ? '20px' : '50px'})`">
    <v-row dense
      justify="space-around"
      align="center"
      class="mt-n1">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div class="font-weight-light text-center my-n2"
          style="letter-spacing: 2vw !important; font-size: 2vw !important">
          GM TOOLKIT
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row class="mt-1"
      align="start">
      <landing-card cols="4"
        to="gm/campaigns"
        name="Campaign Manager"
        :disabled="!isDevsite"
        description="Create, modify, and browse LANCER campaigns (v3.1)"
        img="campaign"
        :max-height="mobile ? 'calc((100vh - 20px) * 0.95)' : 'calc((100vh - 50px) * 0.95)'" />

      <v-col>
        <v-row>
          <landing-card to="gm/npcs"
            name="NPCS"
            description="Manage non-player combat units"
            img="npcs"
            :max-height="mobile ? 'calc((100vh - 20px) * 0.46)' : 'calc((100vh - 50px) * 0.46)'" />
          <landing-card to="gm/narrative"
            name="Narrative Elements"
            description="Manage characters, locations, and factions"
            img="location"
            :max-height="mobile ? 'calc((100vh - 20px) * 0.46)' : 'calc((100vh - 50px) * 0.46)'" />
        </v-row>
        <v-row>
          <landing-card to="gm/encounters"
            name="Encounters"
            description="Create combat encounters"
            img="encounters"
            :max-height="mobile ? 'calc((100vh - 20px) * 0.46)' : 'calc((100vh - 50px) * 0.46)'" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import LandingCard from './_components/LandingCard.vue'
import { useMobile } from '@/composables/useMobile';

export default {
  name: 'Home',
  components: { LandingCard },
  mixins: [useMobile],
  computed: {
    isDevsite() {
      return (
        window.location.hostname === 'dev.compcon.app' || window.location.hostname === 'localhost'
      )
    },
  },
}
</script>
