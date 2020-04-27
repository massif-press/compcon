<template>
  <div>
    <v-btn text color="white" tile to="/gm/npc-roster">NPC Roster</v-btn>
    <v-divider vertical dark class="ml-2 mr-2" />
    <v-btn text color="white" tile to="/gm/encounter-builder">Encounters</v-btn>
    <v-divider vertical dark class="ml-2 mr-2" />
    <v-btn v-if="$vuetify.breakpoint.lgAndUp" text color="white" tile to="/gm/mission/builder">
      Mission Builder
    </v-btn>
    <v-btn v-if="$vuetify.breakpoint.lgAndUp" text color="white" tile to="/gm/mission/selector">
      Mission Runner
    </v-btn>
    <v-btn v-if="!$vuetify.breakpoint.lgAndUp" text color="white" tile to="/gm/mission">
      Missions
    </v-btn>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'encounter-nav-mode',
})
</script>
