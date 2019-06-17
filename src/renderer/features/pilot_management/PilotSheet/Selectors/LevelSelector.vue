<template>
  <div>
    <v-card-text class="text-xs-center">
      <p>
        <i>
          This tool skips the level up wizard. Triggers, licenses, talents, mech
          skills, and CORE bonuses will have to be updated manually
        </i>
      </p>
      <v-layout justify-center>
        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10" height="100">
            <v-card-text>
              <span class="title">
                <b class="caption">Current Level</b>
                <br />
                <span style="font-size: 35px">{{ pilot.level }}</span>
              </span>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs1 class="ml-2 mr-2">
          <v-card flat>
            <v-card-text class="mt-3">
              <v-icon large>arrow_forward</v-icon>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs3>
          <v-card color="grey lighten-3" elevation="10" height="100">
            <v-card-text>
              <v-text-field
                v-model="newLevel"
                type="number"
                label="New Level"
                append-outer-icon="add"
                @click:append-outer="newLevel++"
                prepend-icon="remove"
                @click:prepend="newLevel--"
                class="pb-0 mb-0"
              />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-layout>
      <v-flex>
        <v-alert :value="newLevel && newLevel < pilot.level" type="warning">
          <b>WARNING: LEVEL REMOVAL</b>
          <br />
          <span>
            This will reset all Pilot Skill Triggers, Talents, Licenses, Mech
            Skills, and CORE Bonuses. They must be re-added manually.
          </span>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout v-if="newLevel !== null" class="ma-4">
      <v-flex class="ml-5 mr-5">
        <v-btn
          block
          color="primary"
          large
          @click="setLevel"
          :disabled="newLevel === pilot.levels"
        >
          Set Pilot Level
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import MechSkills from '../../classes/MechSkills'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'level-selector',
  props: {
    pilot: Pilot,
  },
  data: () => ({
    newLevel: 0,
  }),
  methods: {
    setLevel() {
      if (this.newLevel > parseInt(rules.max_pilot_level))
        this.newLevel = parseInt(rules.max_pilot_level)
      if (this.newLevel < this.pilot.Level) {
        this.pilot.ClearLicenses()
        this.pilot.ClearSkills()
        this.pilot.ClearTalents()
        this.pilot.ClearCoreBonuses()
        this.pilot.MechSkills = new MechSkills()
      }
      this.pilot.Level = parseInt(this.newLevel)

      this.$emit('changed', this.newLevel)
    },
  },
  created() {
    this.newLevel = this.pilot.Level
  },
  watch: {
    newLevel: function() {
      if (!this.newLevel) this.newLevel = 0
      else if (this.newLevel < 0) this.newLevel = 0
      else if (this.newLevel > parseInt(rules.max_pilot_level))
        this.newLevel = parseInt(rules.max_pilot_level)
    },
  },
})
</script>
