<template>
  <div
    style="
      background-color: rgb(var(--v-theme-primary));
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
    "
  />
  <v-tabs v-model="step" bg-color="primary">
    <v-tab :value="1">
      <v-icon v-if="step > 1" icon="mdi-check" />
      <span>Overview</span>
    </v-tab>
    <v-divider />
    <v-tab :value="2">
      <v-icon v-if="pilot.SkillsController.HasFullSkills" icon="mdi-check" />
      <span>Skills</span>
    </v-tab>
    <v-divider />
    <v-tab :value="3">
      <v-icon v-if="pilot.TalentsController.HasFullTalents" icon="mdi-check" />
      <span>Talents</span>
    </v-tab>
    <v-divider />
    <v-tab :value="4">
      <v-icon v-if="pilot.MechSkillsController.HasFullHASE" icon="mdi-check" />
      <span>Mech Skills</span>
    </v-tab>
    <v-divider />

    <v-divider />
    <v-tab :value="5">
      <v-icon v-if="pilot.LicenseController.HasLicenses" icon="mdi-check" />
      <span>Licenses</span>
    </v-tab>
    <v-divider />

    <v-divider />
    <v-tab :value="6">
      <v-icon v-if="pilot.CoreBonusController.HasCBs" icon="mdi-check" />
      <span>CORE Bonuses</span>
    </v-tab>
    <v-divider />
    <v-tab :value="7">Confirm</v-tab>
  </v-tabs>

  <v-window v-model="step" class="px-5 pb-1">
    <v-window-item :value="1">
      <overview-page :pilot="pilot" :cb-eligible="cbEligible" @next="step++" />
    </v-window-item>
    <v-window-item :value="2">
      <skills-page :pilot="pilot" @next="step++" @back="step--" />
    </v-window-item>
    <v-window-item :value="3">
      <talents-page :pilot="pilot" @next="step++" @back="step--" />
    </v-window-item>
    <v-window-item :value="4">
      <mech-skills-page :pilot="pilot" @next="step++" @back="step--" />
    </v-window-item>
    <v-window-item :value="5">
      <license-page :pilot="pilot" @next="step++" @back="step--" />
    </v-window-item>
    <v-window-item :value="6">
      <core-bonus-page :pilot="pilot" :cb-eligible="cbEligible" @next="step++" @back="step--" />
    </v-window-item>
    <v-window-item :value="7">
      <confirm-page :pilot="pilot" :original="currentPilot" @back="step--" />
    </v-window-item>
  </v-window>
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
  props: {
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    step: 1,
    pilot: {} as Pilot,
    cbEligible: false,
  }),
  computed: {
    currentPilot(): Pilot {
      return PilotStore().Pilots.find((p) => p.ID === this.$route.params.pilotID) as Pilot;
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
