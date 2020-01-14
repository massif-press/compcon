<template>
  <v-container fluid style="margin-top: 50px; min-height: calc(100vh - 50px)">
    {{ mission.Name }}
    <v-divider />
    {{ mission.Note }}
    <v-divider />
    PILOTS:
    <br />
    <v-btn>Add Pilot</v-btn>
    pilots
    <br />
    <v-btn>start</v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'

export default Vue.extend({
  name: 'mission-briefing',
  props: {
    missionID: {
      type: String,
      required: true,
    },
  },
  computed: {
    mission() {
      const store = getModule(MissionStore, this.$store)
      return store.Missions.find(x => x.ID === this.missionID)
    },
  },
})
</script>
