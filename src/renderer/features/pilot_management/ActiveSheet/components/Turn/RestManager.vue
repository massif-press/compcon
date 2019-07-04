<template>
  <div>
    <v-layout column fill-height>
      <v-flex xs12 class="major-title text-xs-center" style="background: #33691E">
        <span>OUT OF COMBAT</span>
      </v-flex>
    </v-layout>
    <v-divider class="ma-2" />
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn block color="amber darken-4" dark @click="startCombat">Enter Combat</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-btn block color="green darken-4" dark @click="endMission">Complete Mission</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'rest-manager'
})
</script>

