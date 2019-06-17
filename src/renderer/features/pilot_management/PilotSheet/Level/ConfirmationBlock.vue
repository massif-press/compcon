<template>
  <div>
    <v-layout row align-center justify-center>
      <span class="callsign-text mb-4">{{ pilot.callsign }}</span>
    </v-layout>
    <v-divider />
    <v-container grid-list-xl text-xs-center class="mt-0 pt-0 mb-0 pb-0">
      <v-layout row justify-space-between>
        <v-flex>
          <b class="minor-title">License Level {{ pilot.Level }}</b>
        </v-flex>
      </v-layout>

      <div class="ma-2">
        <v-layout class="headline">Skills</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex v-for="pskill in pilot.Skills" :key="pskill.Skill.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ pskill.Skill.Trigger }}
                  <span class="primary--text">+{{ pskill.Bonus }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div class="ma-2">
        <v-layout class="headline">Talents</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex v-for="ptalent in pilot.Talents" :key="ptalent.Talent.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ ptalent.Talent.Name }}
                  <span class="primary--text">Rank {{ ptalent.Rank }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div class="ma-2">
        <v-layout class="headline">Mech Skills</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Hull</b>
                <b class="primary--text">{{ pilot.MechSkills.Hull }}</b>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Agility</b>
                <b class="primary--text">{{ pilot.MechSkills.Agi }}</b>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Systems</b>
                <b class="primary--text">{{ pilot.MechSkills.Sys }}</b>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>Engineering</b>
                <b class="primary--text">{{ pilot.MechSkills.Eng }}</b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div class="ma-2">
        <v-layout class="headline">Licenses</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex
            v-for="plicense in pilot.Licenses"
            :key="plicense.License.Name"
          >
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>
                  {{ plicense.License.Source }} {{ plicense.License.Name }}
                  <span class="primary--text">Rank {{ plicense.Rank }}</span>
                </b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div class="ma-2" v-if="pilot.level % 3 === 0">
        <v-layout class="headline">Core Bonuses</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex v-for="cb in pilot.CoreBonuses" :key="cb.ID">
            <v-card color="grey lighten-3" elevation="10">
              <v-card-text class="bigtext">
                <b>{{ cb.Name }}</b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
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
