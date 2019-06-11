<template>
  <div>
    <v-layout row align-center justify-center>
      <span class="title">{{ callsign }}</span>
    </v-layout>
    <v-divider />
    <v-layout row align-center justify-center>
      <v-flex shrink>
        <span class="grey--text">
          LICENSE
          <br />
          LEVEL
        </span>
      </v-flex>
      <v-flex shrink>
        <span class="display-3 grey--text">{{ lvl - 1 }}</span>
      </v-flex>
      <v-flex shrink class="ml-4">
        <v-icon size="70px" class="ml-5">arrow_forwards</v-icon>
      </v-flex>
      <v-flex shrink>
        <span>
          LICENSE
          <br />
          LEVEL
        </span>
      </v-flex>
      <v-flex shrink>
        <span class="display-3">{{ lvl }}</span>
      </v-flex>
    </v-layout>
    <v-container grid-list-xl text-xs-center class="mt-0 pt-0 mb-0 pb-0">
      <v-layout row justify-space-between>
        <v-flex>
          <b>Pending Advancements for License Level {{ lvl }}:</b>
        </v-flex>
      </v-layout>
      <v-layout row justify-space-between>
        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+2</span>
              &emsp;
              <b>Pilot Skill Points</b>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>Mech Skill Point</b>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>Talent Point</b>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>License Point</b>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-center>
        <v-flex>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <b>Grit:</b>
              <br />
              <span class="display-2 grey--text pr-2">
                {{ Math.ceil((lvl - 1) / 2) }}
              </span>
              <span>
                <v-icon size="40px" class="pl-4">arrow_forwards</v-icon>
              </span>
              <span class="display-2">
                {{ Math.ceil(lvl / 2) }}
              </span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-space-between v-if="lvl % 3 === 0">
        <v-flex xs12>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              <br />
              <b>Core Bonus</b>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'level-update-block',
  props: {
    lvl: Number,
    callsign: String,
  },
})
</script>
