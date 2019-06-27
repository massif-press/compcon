<template>
  <div class="roster-content" style="background-color: #424242">
    <v-container fluid dark>
      <v-tabs v-model="tabs" dark slider-color="yellow" fixed-tabs>
        <v-tab ripple>
          DOWNTIME
        </v-tab>
        <v-tab ripple>
          MISSION
        </v-tab>

        <v-tab-item>
          pilot name
          <br />
          active mech/select mech
          <br />
          pilot stats
          <br />
          pilot skill cards
          <br />
          pilot active loadout
          <br />
        </v-tab-item>

        <v-tab-item>
          if no active mech, select mech
          <br />
          mech name - frame
          <br />
          hase & stats
          <br />
          pips/stats
          <br />
          pilot talent cards
          <br />
          core bonus cards
          <br />
          frame traits
          <br />
          core system
          <br />
          mech active loadout
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'active-sheet',
  data: () => ({
    tabs: 0,
  }),
})
</script>
