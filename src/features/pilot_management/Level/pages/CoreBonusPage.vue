<template>
  <cc-stepper-content
    :complete="!pilot.IsMissingCBs"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Add CORE Bonus&emsp;</cc-title>
    <h2 class="heading">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2(a) CORE Supplemental
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest CORE Bonus</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The MV-2(a) Supplemental Amendment registers a major CORE modification, upgrade, retrofit,
        or enhancement. The Union Naval Intelligence Board, the Union Naval Licensing Board, the
        Union Administrative Pilot Advocacy Council, and The Union Department of Justice and Human
        Resources Ethical Engineering Subcommittee only recognize CORE augmentation from a
        Union-approved and registered Lincensor.
      </span>
      <v-alert v-if="cbEligible" color="accent" outlined dense border="left" class="mt-2">
        <b>Select a CORE Bonus</b>
        <br />
        <span class="overline">
          Implementing CORE augmentation protocols from a nonrecognized, phohibited, or unregistered
          Licensor or Licensors renders the operating pilot liable for any and all damages resultant
          from CORE malfunction, up to and including reactor meltdown.
        </span>
      </v-alert>
    </v-container>
    <cc-core-bonus-selector v-if="cbEligible" level-up :pilot="pilot" />
    <v-card v-else flat tile color="panel">
      <v-card-text class="flavor-text text-center py-5 px-3">
        <span class="heading h2 subtle--text text--darken-1">PILOT INELIGIBLE FOR CORE BONUS</span>
        <br />
        <span class="subtle--text text--darken-2">
          NEXT CORE BONUS IN {{ 3 - (pilot.Level % 3) }} LICENSE LEVELS
        </span>
      </v-card-text>
    </v-card>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'core-bonus-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
})
</script>
