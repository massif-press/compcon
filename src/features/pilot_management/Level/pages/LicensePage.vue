<template>
  <stepper-content
    :complete="!pilot.LicenseController.IsMissingLicenses"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>Unlock License</cc-title>
    <div class="heading h2">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;MV-2//d Licensor/Licensee Transmit Record
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The MV-2 Licensor/Licensee Transmit Record registers the transmission and receipt of a
      UN-recognized FRAME License consisting of, but not limited to, Equipment Print Templates not
      exceeding 1.5EB, FRAME Print Templates not exceeding 3.75EB, and access protocols to
      FRAME-compliant system software.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">Unlock a License.</div>
      <p class="text-cc-overline">
        Union and its representatives are not liable for problems arising from the printing,
        installation, and/or use of unrecognized or prohibited License materials.
      </p>
    </v-alert>
    <license-selector level-up flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import LicenseSelector from '../../_components/selectors/LicenseSelector.vue';
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'license-page',
  components: { LicenseSelector, StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
