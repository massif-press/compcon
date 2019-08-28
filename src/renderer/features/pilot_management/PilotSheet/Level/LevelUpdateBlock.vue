<template>
  <div>
    <v-row align-center justify="center">
      <span class="title">{{ callsign }}</span>
    </v-row>
    <v-divider />
    <v-row align-center justify="center">
      <v-col shrink>
        <span class="grey--text">
          LICENSE
          <br />
          LEVEL
        </span>
      </v-col>
      <v-col shrink>
        <span class="display-3 grey--text">{{ lvl - 1 }}</span>
      </v-col>
      <v-col shrink class="ml-4">
        <v-icon size="70px" class="ml-5">arrow_forwards</v-icon>
      </v-col>
      <v-col shrink>
        <span>
          LICENSE
          <br />
          LEVEL
        </span>
      </v-col>
      <v-col shrink>
        <span class="display-3">{{ lvl }}</span>
      </v-col>
    </v-row>
    <v-container grid-list-xl text-center class="mt-0 pt-0 mb-0 pb-0">
      <v-row justify-space-between>
        <v-col>
          <b>Pending Advancements for License Level {{ lvl }}:</b>
        </v-col>
      </v-row>
      <v-row justify-space-between>
        <v-col xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+2</span>
              &emsp;
              <b>Pilot Skill Points</b>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>Mech Skill Point</b>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>Talent Point</b>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col xs3>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              &emsp;
              <b>License Point</b>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col>
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
        </v-col>
      </v-row>

      <v-row justify-space-between v-if="lvl % 3 === 0">
        <v-col xs12>
          <v-card color="grey lighten-3" elevation="10">
            <v-card-text>
              <span class="display-2">+1</span>
              <br />
              <b>Core Bonus</b>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
