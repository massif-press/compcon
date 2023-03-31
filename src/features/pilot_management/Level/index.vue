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
          :complete="pilot.SkillsController.HasFullSkills"
          :color="pilot.SkillsController.HasFullSkills ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="2"
        >
          <span>Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.TalentsController.HasFullTalents"
          :color="
            pilot.TalentsController.HasFullTalents ? 'success' : 'primary'
          "
          edit-icon="mdi-check"
          step="3"
        >
          <span>Talents</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.MechSkillsController.HasFullHASE"
          :color="
            pilot.MechSkillsController.HasFullHASE ? 'success' : 'primary'
          "
          edit-icon="mdi-check"
          step="4"
        >
          <span>Mech Skills</span>
        </v-stepper-step>
        <v-divider />

        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.LicenseController.HasLicenses"
          :color="pilot.LicenseController.HasLicenses ? 'success' : 'primary'"
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
          :color="
            pilot.cbEligible
              ? pilot.HasFullCB
                ? 'success'
                : 'primary'
              : 'grey'
          "
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
          <overview-page
            :pilot="pilot"
            :cb-eligible="cbEligible"
            @next="step++"
          />
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
          <core-bonus-page
            :pilot="pilot"
            :cb-eligible="cbEligible"
            @next="step++"
            @back="step--"
          />
        </v-stepper-content>
        <v-stepper-content step="7">
          <confirm-page
            :pilot="pilot"
            :original="currentPilot"
            @back="step--"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import OverviewPage from './pages/OverviewPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import TalentsPage from './pages/TalentsPage.vue';
import MechSkillsPage from './pages/MechSkillsPage.vue';
import LicensePage from './pages/LicensePage.vue';
import CoreBonusPage from './pages/CoreBonusPage.vue';
import ConfirmPage from './pages/ConfirmPage.vue';

import { PilotStore } from '@/stores';
import { Pilot } from '@/class';

export default {
  name: 'level-wizard',
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
    cbEligible: false,
  }),
  computed: {
    currentPilot(): Pilot {
      return PilotStore().Pilots.find(
        (p) => p.ID === this.$route.params.pilotID
      );
    },
  },
  watch: {
    step() {
      window.scrollTo(0, 0);
    },
  },
  created() {
    this.pilot = Pilot.Deserialize(Pilot.Serialize(this.currentPilot));
    this.pilot.Level++;
    this.cbEligible = this.pilot.CoreBonusController.IsMissingCBs;
  },
};
</script>
