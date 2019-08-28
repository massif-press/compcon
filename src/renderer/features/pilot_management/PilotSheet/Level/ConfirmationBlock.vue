<template>
  <div>
    <v-row align-center justify="center">
      <span class="callsign-text mb-4">{{ pilot.callsign }}</span>
    </v-row>
    <v-divider />
    <v-container grid-list-xl text-center class="mt-0 pt-0 mb-0 pb-0">
      <v-row justify-space-between>
        <v-col>
          <b class="minor-title">License Level {{ pilot.Level }}</b>
        </v-col>
      </v-row>

      <div class="ma-2">
        <v-row class="headline">Skills</v-row>
        <v-row wrap justify-space-between>
          <v-col v-for="pskill in pilot.Skills" :key="pskill.Skill.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ pskill.Skill.Trigger }}
                  <span class="primary--text">+{{ pskill.Bonus }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="ma-2">
        <v-row class="headline">Talents</v-row>
        <v-row wrap justify-space-between>
          <v-col v-for="ptalent in pilot.Talents" :key="ptalent.Talent.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ ptalent.Talent.Name }}
                  <span class="primary--text">Rank {{ ptalent.Rank }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="ma-2">
        <v-row class="headline">Mech Skills</v-row>
        <v-row wrap justify-space-between>
          <v-col>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Hull</b>
                <b class="primary--text">{{ pilot.MechSkills.Hull }}</b>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Agility</b>
                <b class="primary--text">{{ pilot.MechSkills.Agi }}</b>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Systems</b>
                <b class="primary--text">{{ pilot.MechSkills.Sys }}</b>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Engineering</b>
                <b class="primary--text">{{ pilot.MechSkills.Eng }}</b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="ma-2">
        <v-row class="headline">Licenses</v-row>
        <v-row wrap justify-space-between>
          <v-col v-for="plicense in pilot.Licenses" :key="plicense.License.Name">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ plicense.License.Source }} {{ plicense.License.Name }}
                  <span class="primary--text">Rank {{ plicense.Rank }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="ma-2" v-if="pilot.level % 3 === 0">
        <v-row class="headline">Core Bonuses</v-row>
        <v-row wrap justify-space-between>
          <v-col v-for="cb in pilot.CoreBonuses" :key="cb.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>{{ cb.Name }}</b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'confirmation-block',
  props: {
    pilot: Pilot,
  },
})
</script>

<style scoped>
.bigtext {
  font-size: 20px;
}
</style>
