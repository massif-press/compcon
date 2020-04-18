<template>
  <cc-stepper-content
    :complete="canContinue"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Pilot Talents&emsp;</cc-title>
    <h2 class="heading">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4c Pilot Self Assessment (2/3)
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest Talents</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The RM-4b PILOT SELF ASSESSMENT (Talents) audit catalogs an individual pilot's self-reported
        combat operation aptitudes and confers requisition privileges for simulator time, holofield
        and cortical sensorium training materials, battlefield telemetry data at classifications
        below GREY SIERRA SHARP, and (in specific cases) GMS MM-pattern materiel licenses.
        Additional resources may be made available at your request in the course of field
        operations.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Select three (3) Pilot Talents.</b>
        <br />
        <span class="overline">
          By submitting this form you attest that your responses are truthful and accurate to the
          best of your knowledge. Knowingly providing false or or incomplete information is
          punishable under DoJ/HR AR 303-J.
        </span>
      </v-alert>
    </v-container>
    <cc-talent-selector :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talents-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.IsMissingTalents
    },
  },
})
</script>
