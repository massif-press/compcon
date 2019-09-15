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
      <cc-slashes />&nbsp;RM-4c Pilot Self Assessment (2/3)
    </h2>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>The RM-4b PILOT SELF ASSESSMENT (Talents) audit catalogs an individual pilot's self-reported combat operation aptitudes and confers requisition privileges for simulator time, training materials, and (in specific cases) GMS MM-pattern materiel licenses. Additional resources may be made available at your request in the course of field operations</span>
      <v-alert type="warning" color="primary" outlined class="mt-2">
        <b>Selct three (3) Pilot Talents.</b>
        <br />
        <span
          class="overline"
        >By submitting this form you attest that your responses are truthful and accurate to the best of your knowledge. Knowingly providing false or or incomplete information is punishable under DoJ/HR AR 303-J.</span>
      </v-alert>
    </v-container>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'identification-page',
  props: {
    newPilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !!(this.newPilot.Name && this.newPilot.Callsign)
    },
  },
})
</script>