<template>
  <cc-stepper-content
    :complete="!pilot.IsMissingLicenses"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Unlock License&emsp;</cc-title>
    <h2 class="heading">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2//d Licensor/Licensee Transmit Record
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest License</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The MV-2 Licensor/Licensee Transmit Record registers the transmission and receipt of a
        UN-recognized FRAME License consisting of, but not limited to, Equipment Print Templates not
        exceeding 1.5EB, FRAME Print Templates not exceeding 3.75EB, and access protocols to
        FRAME-compliant system software.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Unlock a License.</b>
        <br />
        <span class="overline">
          Union and its representatives are not liable for problems arising from the printing,
          installation, and/or use of unrecognized or prohibited License materials.
        </span>
      </v-alert>
    </v-container>
    <cc-license-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'license-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
