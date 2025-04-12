<template>
  <stepper-content
    :complete="canContinue()"
    :exit="`/pilot/${pilot.ID}`"
    back
    no-confirm
    @back="$emit('back')">
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <cc-alert v-if="!pilotReady" color="error">
      <div class="stat-text">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following issue(s):
      </div>
      <ul class="flavor-text text-stark">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS incomplete or invalid
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">PILOT TALENTS incomplete or invalid</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS incomplete or invalid
        </li>
        <li v-if="!pilot.LicenseController.HasLicenses">PILOT LICENSES incomplete or invalid</li>
        <li v-if="!pilot.CoreBonusController.HasCBs">PILOT CORE BONUSES incomplete or invalid</li>
      </ul>
    </cc-alert>
    <cc-button block color="success" class="my-6" prepend-icon="cc:orbital" @click="savePilot()">
      Update Pilot Record // {{ pilot.Callsign }} ({{ pilot.Name }})
    </cc-button>
  </stepper-content>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { PilotStore } from '@/stores';
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue';
import StepperContent from '../../_components/StepperContent.vue';
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';

export default {
  name: 'confirm-page',
  components: { PilotRegistrationCard, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    original: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pilotReady(): boolean {
      return (
        this.pilot.HasIdent &&
        this.pilot.SkillsController.HasFullSkills &&
        this.pilot.TalentsController.HasFullTalents &&
        this.pilot.MechSkillsController.HasFullHASE
      );
    },
  },
  methods: {
    savePilot() {
      const originalIndex = PilotStore().Pilots.findIndex((p) => p.ID === this.pilot.ID);
      PilotStore().SetPilot(originalIndex, this.pilot as Pilot);

      if (this.pilot.Level === 12) {
        // if (this.pilot.Level === 12 && !this.pilot.IsLevelEdit) {
        AchievementEventSystem.emit('levelup_total', 12);
      }

      this.$router.push({
        name: 'pilot_sheet_redirect',
        params: { pilotID: this.pilot.ID, callsign: this.pilot.Callsign },
      });
    },
    canContinue() {
      return (
        this.pilot.Callsign &&
        this.pilot.Name &&
        this.pilot.SkillsController.HasFullSkills &&
        this.pilot.TalentsController.HasFullTalents &&
        this.pilot.MechSkillsController.HasFullHASE &&
        this.pilot.LicenseController.HasLicenses &&
        this.pilot.CoreBonusController.HasCBs
      );
    },
  },
};
</script>
