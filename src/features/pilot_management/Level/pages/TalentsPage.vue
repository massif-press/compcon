<template>
  <cc-stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Improve Talents&emsp;</cc-title>
    <h2 class="heading">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2//b COA Resource Requisition
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest Talents</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The Combat Operation Ability Requisition, on the approval of a NHP-guided automated request
        approval system, confers UNI simulator privileges, holofield and cortical sensorium training
        materials, battlefield telemetry data at classifications below GREY SIERRA SHARP, and (in
        specific cases) GMS MM-pattern materiel licenses.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Add or Upgrade a Talent.</b>
        <br />
        <span class="overline">
          By submitting this form you acknowledge your responsibility to prevent unauthorized
          disclosure by ensuring any and all training materials, field report data, and print
          templates are always stored and transmitted under NDL-DISCORDANT//BREATH or higher
          NDL-DISCORDANT-class UNI encryption protocols. The reproduction, extraction, and
          transmission of these materials, in whole or in part, is forbidden without the express
          permission of Union Naval Intelligence.
        </span>
      </v-alert>
    </v-container>
    <cc-talent-selector level-up :pilot="pilot" />
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
