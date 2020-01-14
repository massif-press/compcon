<template>
  <v-container fluid style="overflow: hidden; margin-top: 48px; height: calc(100vh - 50px)">
    <v-row style="height: 100%" align="center">
      <v-col>
        <home-card
          title="Mission Builder"
          icon="mdi-wrench-outline"
          text="Compose and edit Missions"
          to="/gm/mission/builder"
        />
      </v-col>
      <v-col>
        <home-card
          title="Mission Runner"
          icon="mdi-play-speed"
          text="Start a new Mission or continue an active one"
          to="/gm/mission/selector"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from '../components/HomeCard.vue'

export default Vue.extend({
  name: 'mission-landing',
  components: { HomeCard },
})
</script>
