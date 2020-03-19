<template>
  <cc-stepper-content
    :complete="canContinue"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Pilot Mech Skills&emsp;</cc-title>
    <h2 class="heading">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4d Pilot Self Assessment (3/3)
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest Mech Skills</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The RM-4b PILOT SELF ASSESSMENT (Mech Skills) will be transmitted to print staff to finalize
        the configuration of your issued GMS-SP1 EVEREST. This configuration data will be remitted
        to your personal Omninet vault on the validation and acceptance of the RM-4 form along with
        the issuance of your IDENT fingerprint, which then may be applied to any future Frame(s) at
        your discretion.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Add two (2) Mech Skill Points.</b>
        <br />
        <span class="overline">
          By submitting this form you attest that your responses are truthful and accurate to the
          best of your knowledge. Knowingly providing false or or incomplete information is
          punishable under DoJ/HR AR 303-J.
        </span>
      </v-alert>
    </v-container>
    <cc-mech-skills-selector :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mech-skills-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.IsMissingHASE
    },
  },
})
</script>
