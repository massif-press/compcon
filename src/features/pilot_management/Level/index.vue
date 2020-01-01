<template>
  <v-container fluid style="margin-top: 50px">
    <v-stepper v-model="step" non-linear class="elevation-0">
      <v-stepper-header class="elevation-0" style="height: 40px">
        <v-stepper-step
          editable
          :complete="step > 1"
          :color="step > 1 ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="1"
        >
          <span>Overview</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullSkills"
          :color="pilot.HasFullSkills ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="2"
        >
          <span>Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullTalents"
          :color="pilot.HasFullTalents ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="3"
        >
          <span>Talents</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullHASE"
          :color="pilot.HasFullHASE ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="4"
        >
          <span>Mech Skills</span>
        </v-stepper-step>
        <v-divider />

        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasLicenses"
          :color="pilot.HasLicenses ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="5"
        >
          <span>Licenses</span>
        </v-stepper-step>
        <v-divider />

        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullCB"
          :color="pilot.CBEligible ? (pilot.HasFullCB ? 'success' : 'primary') : 'grey'"
          edit-icon="mdi-check"
          step="6"
        >
          <span>CORE Bonuses</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="7">Confirm</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <overview-page :pilot="pilot" @next="step++" />
        </v-stepper-content>
        <v-stepper-content step="2">
          <skills-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="3">
          <talents-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="4">
          <mech-skills-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="5">
          <license-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="6">
          <core-bonus-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="7">
          <confirm-page :pilot="pilot" :original="currentPilot" @back="step--" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import OverviewPage from './pages/OverviewPage.vue'
import SkillsPage from './pages/SkillsPage.vue'
import TalentsPage from './pages/TalentsPage.vue'
import MechSkillsPage from './pages/MechSkillsPage.vue'
import LicensePage from './pages/LicensePage.vue'
import CoreBonusPage from './pages/CoreBonusPage.vue'
import ConfirmPage from './pages/ConfirmPage.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'pilot-wizard',
  components: {
    OverviewPage,
    SkillsPage,
    TalentsPage,
    MechSkillsPage,
    LicensePage,
    CoreBonusPage,
    ConfirmPage,
  },
  data: () => ({
    step: 1,
    pilot: {},
  }),
  computed: {
    currentPilot(): Pilot {
      return getModule(PilotManagementStore, this.$store).Pilots.find(
        p => p.ID === this.$route.params.pilotID
      )
    },
  },
  watch: {
    step() {
      window.scrollTo(0, 0)
    },
  },
  created() {
    this.pilot = Pilot.Deserialize(Pilot.Serialize(this.currentPilot))
    this.pilot.Level++
  },
})
</script>
