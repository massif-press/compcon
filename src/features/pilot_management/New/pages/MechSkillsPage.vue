<template>
  <cc-stepper-content
    :complete="canContinue"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Pilot Mech Skills&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
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
        <div class="mt-n2">
          The RM-4b PILOT SELF ASSESSMENT (Mech Skills) will be transmitted to print staff to
          finalize the configuration of your issued GMS-SP1 EVEREST. This configuration data will be
          remitted to your personal Omninet vault on the validation and acceptance of the RM-4 form
          along with the issuance of your IDENT fingerprint, which then may be applied to any future
          Frame(s) at your discretion.
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>Add two (2) Mech Skill Points.</b>
          <br />
          <div class="overline" style="line-height: 13px">
            By submitting this form you attest that your responses are truthful and accurate to the
            best of your knowledge. Knowingly providing false or or incomplete information is
            punishable under DoJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
    <cc-mech-skills-selector level-up :pilot="pilot" />
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
    quickstart: { type: Boolean },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.IsMissingHASE
    },
  },
})
</script>
