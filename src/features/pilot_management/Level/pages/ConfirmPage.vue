<template>
  <cc-stepper-content
    :complete="canContinue()"
    :exit="`/pilot/${pilot.ID}`"
    back
    no-confirm
    @back="$emit('back')"
  >
    <pilot-registration-card :pilot="pilot" :pilot-ready="pilotReady" />
    <br />
    <v-alert type="error" variant="outlined" :value="!pilotReady">
      <span class="stat-text accent--text">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following
        issue(s):
      </span>
      <ul class="flavor-text error--text">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS incomplete or invalid
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">
          PILOT TALENTS incomplete or invalid
        </li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS incomplete or invalid
        </li>
        <li v-if="!pilot.LicenseController.HasLicenses">
          PILOT LICENSES incomplete or invalid
        </li>
        <li v-if="!pilot.CoreBonusController.HasCBs">
          PILOT CORE BONUSES incomplete or invalid
        </li>
      </ul>
    </v-alert>
    <v-btn
      x-large
      block
      color="secondary"
      tile
      class="mx-2 my-8"
      @click="savePilot()"
    >
      Update Pilot Record // {{ pilot.Callsign }} ({{ pilot.Name }})
    </v-btn>
  </cc-stepper-content>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue';

export default {
  name: 'confirm-page',
  components: { PilotRegistrationCard },
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
      this.original.ApplyLevel(Pilot.Serialize(this.pilot));
      this.$router.push({ name: 'pilot_sheet', params: { id: this.pilot.ID } });
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
