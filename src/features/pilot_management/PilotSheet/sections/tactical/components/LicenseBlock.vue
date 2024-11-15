<template>
  <div>
    <section-header title="Licenses">
      <section-edit-chip
        v-if="!pilot.IsRemote"
        :highlight="!pilot.LicenseController.HasLicenses"
        :current="pilot.LicenseController.CurrentLicensePoints"
        :max="pilot.LicenseController.MaxLicensePoints"
        :label="`Edit Pilot Licenses (${pilot.LicenseController.CurrentLicensePoints}/${pilot.LicenseController.MaxLicensePoints})`"
        @open-selector="($refs as any).licenseSelector.show()" />
    </section-header>
    <cc-solo-dialog
      ref="licenseSelector"
      icon="cc:frame"
      no-confirm
      title="Set Pilot Licenses"
      fullscreen>
      <license-selector :pilot="<Pilot>pilot" modal />
    </cc-solo-dialog>
    <v-container style="padding-right: 180px">
      <no-data-block v-if="!pilot.LicenseController.Licenses.length" />
      <v-row v-else>
        <v-col v-for="l in pilot.LicenseController.Licenses" cols="12" md="4">
          <cc-pilot-license-item :pilot-license="l" title />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import LicenseSelector from '@/features/pilot_management/_components/selectors/LicenseSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'license-block',
  components: { SectionHeader, SectionEditChip, NoDataBlock, LicenseSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
