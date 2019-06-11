<template>
  <v-container id="np-container" fluid>
    <v-layout>
      <v-flex>
        <v-stepper id="np-stepper" v-model="lv_step">
          <v-stepper-header>
            <v-stepper-step :complete="lv_step > 1" step="1">
              Overview
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="lv_step > 2" step="2">
              Assign Skill Points
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="lv_step > 3" step="3">
              Assign Talent Point
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="lv_step > 4" step="4">
              Assign Mech Skill Point
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="lv_step > 5" step="5">
              Select New License
            </v-stepper-step>
            <v-divider />
            <v-stepper-step
              v-if="pilot.Level % 3 === 0"
              :complete="lv_step > 6"
              step="6"
            >
              Select New Core Bonus
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :step="pilot.Level % 3 === 0 ? '7' : '6'">
              Confirm
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container>
                <level-update-block
                  :lvl="pilot.Level"
                  :callsign="pilot.Callsign"
                />
              </v-container>

              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn large color="primary" @click="stepForward">
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="2">
              <skill-selector v-if="lv_step === 2" :pilot="pilot" level-up />
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    large
                    color="primary"
                    :disabled="!hasSkills"
                    @click="stepForward"
                  >
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="3">
              <talent-selector v-if="lv_step === 3" :pilot="pilot" level-up />
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    large
                    color="primary"
                    :disabled="!hasTalents"
                    @click="stepForward"
                  >
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="4">
              <mech-skills-selector
                v-if="lv_step === 4"
                :pilot="pilot"
                level-up
              />
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    large
                    color="primary"
                    :disabled="!hasMechSkills"
                    @click="stepForward"
                  >
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="5">
              <license-selector v-if="lv_step === 5" :pilot="pilot" level-up />
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    large
                    color="primary"
                    :disabled="!hasLicenses"
                    @click="stepForward"
                  >
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content v-if="pilot.Level % 3 === 0" step="6">
              <core-bonus-selector
                v-if="lv_step === 6"
                :pilot="pilot"
                level-up
              />
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    large
                    color="primary"
                    :disabled="!hasBonuses"
                    @click="stepForward"
                  >
                    Continue
                    <v-icon>chevron_right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content :step="pilot.Level % 3 === 0 ? '7' : '6'">
              <v-container>
                <confirmation-block :pilot="pilot" />
              </v-container>

              <v-layout>
                <v-flex xs12 class="text-xs-right">
                  <span class="caption mr-5">Is this correct?</span>
                </v-flex>
              </v-layout>
              <v-layout justify-space-between>
                <v-flex xs1>
                  <v-btn flat to="pilot">Cancel</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn color="primary" flat @click="stepBack">
                    <v-icon>chevron_left</v-icon>
                    Back
                  </v-btn>
                  <v-btn large color="success" @click="savePilot">
                    Confirm &nbsp;
                    <v-icon>done</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, MechSkills } from '@/class'
import _ from 'lodash'
import {
  SkillSelector,
  TalentSelector,
  MechSkillsSelector,
  LicenseSelector,
  CoreBonusSelector,
} from '../Selectors'
import LevelUpdateBlock from './LevelUpdateBlock.vue'
import ConfirmationBlock from './ConfirmationBlock.vue'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'new-pilot',
  components: {
    SkillSelector,
    TalentSelector,
    MechSkillsSelector,
    LicenseSelector,
    CoreBonusSelector,
    LevelUpdateBlock,
    ConfirmationBlock,
  },
  data: () => ({
    lv_step: 0,
    pilot: {} as Pilot,
  }),
  computed: {
    hasSkills(): boolean {
      return (
        this.pilot.Skills.length >= rules.minimum_pilot_skills &&
        this.pilot.Skills.reduce((a, b) => {
          return a + (b ? b.Rank : 0)
        }, 0) ===
          rules.minimum_pilot_skills + this.pilot.Level
      )
    },
    hasTalents(): boolean {
      return (
        this.pilot.Skills.length >= rules.minimum_pilot_talents &&
        this.pilot.Talents.reduce((a, b) => {
          return a + (b ? b.Rank : 0)
        }, 0) ===
          rules.minimum_pilot_talents + this.pilot.Level
      )
    },
    hasMechSkills(): boolean {
      return (
        this.pilot.MechSkills.Sum >=
        rules.minimum_mech_skills + this.pilot.Level
      )
    },
    hasLicenses(): boolean {
      return (
        this.pilot.Licenses.reduce((a, b) => {
          return a + (b ? b.Rank : 0)
        }, 0) === this.pilot.Level
      )
    },
    hasBonuses(): boolean {
      return this.pilot.CoreBonuses.length === Math.floor(this.pilot.Level / 3)
    },
  },
  methods: {
    savePilot() {
      this.$store.dispatch('updatePilot', this.pilot)
      this.$router.push('./pilot')
    },
    stepBack() {
      this.lv_step--
      window.scrollTo(0, 0)
    },
    stepForward() {
      this.lv_step++
      window.scrollTo(0, 0)
    },
    init() {
      const pilotData = Pilot.Serialize(this.$store.getters.getPilot)
      this.pilot = Pilot.Deserialize(pilotData)
      this.pilot.Level += 1
    },
  },
  created() {
    this.init()
  },
})
</script>
