<template>
  <div>
    <section-header title="Licenses">
      <cc-modal title="Set Pilot Licenses" icon="cc:frame" ref="licenseSelector">
        <template #activator="{ open }">
          <section-edit-chip
            v-if="!pilot.IsRemote"
            :highlight="!pilot.LicenseController.HasLicenses"
            :current="pilot.LicenseController.CurrentLicensePoints"
            :max="pilot.LicenseController.MaxLicensePoints"
            :label="`Edit Pilot Licenses (${pilot.LicenseController.CurrentLicensePoints}/${pilot.LicenseController.MaxLicensePoints})`"
            @open-selector="open" />
        </template>
        <license-selector :pilot="<Pilot>pilot" />
      </cc-modal>
    </section-header>

    <div class="mt-4 mb-6" :style="!mobile && 'padding-right: 180px'">
      <no-data-block v-if="!pilot.LicenseController.Licenses.length" />
      <v-row v-else>
        <v-col v-for="l in pilot.LicenseController.Licenses" cols="12" md="4">
          <cc-pilot-license-item :pilot-license="l" title />
        </v-col>
      </v-row>
    </div>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
