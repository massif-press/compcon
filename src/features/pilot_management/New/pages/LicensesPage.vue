<template>
  <stepper-content
    :complete="canContinue"
    mandatory
    exit="../pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>Pilot Talents&emsp;</cc-title>
    <div class="heading h2">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4c (S-1) Licensing Authorization Supplemental
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The RM-4α Supplemental I (Licensing Authorization) registers an individual pilot's Frame Print
      and Operation (FP/O) Licenses under the Union Licensing Authority. The following catalog
      represents all licenses currently validated as FAB-COMPLETE by the ULA Registrar and Data
      Validation Services. Access to license data confers print rights to all license materiel
      included within license data, though the Union Licensing Authority does not guarantee the
      availability of any license materiel, nor does it confer requisition privileges for any
      license materiel. The Union Licensing Authority reserves the right to audit license data at
      any time.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2" tile>
      <div class="heading">Select {{ word }} ({{ count }}) License Rank(s).</div>
      <p class="text-cc-overline">
        The Union Licensing Authority bears no responsibility or liability, express or implied, for
        any injury, damage, loss, or harm arising from, related to, or resulting from the printing,
        deployment, or operation of any license-related materiel not directly issued by General
        Massive Systems. This exclusion of liability expressly encompasses, without limitation,
        physical injury or destruction, existential or ontological disturbances, and any full or
        partial impairment, degradation, or cessation of subjectivity, including but not limited to
        loss of life, personal identity, self-awareness, volition, or agency.
      </p>
    </v-alert>
    <license-selector flat :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';
import LicenseSelector from '../../_components/selectors/LicenseSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'talents-page',
  components: {
    StepperContent,
    LicenseSelector,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return this.pilot.LicenseController.HasLicenses;
    },
    count(): number {
      return this.pilot.LicenseController.MaxLicensePoints;
    },
    word(): string {
      const words = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
      ];
      return words[this.count];
    },
  },
};
</script>
