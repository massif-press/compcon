<template>
  <div>
    <section-header title="Licenses">
      <cc-modal title="Set Pilot Licenses"
        icon="cc:frame"
        ref="licenseSelector">
        <template #activator="{ open }">
          <section-edit-chip v-if="!pilot.IsRemote"
            :highlight="!pilot.LicenseController.HasLicenses"
            :current="pilot.LicenseController.CurrentLicensePoints"
            :max="pilot.LicenseController.MaxLicensePoints"
            :label="`Edit Pilot Licenses (${pilot.LicenseController.CurrentLicensePoints}/${pilot.LicenseController.MaxLicensePoints})`"
            @open-selector="open" />
        </template>
        <template #default>
          <div id="content">
            <license-selector :pilot="<Pilot>pilot"
              modal />
          </div>
        </template>
      </cc-modal>
    </section-header>

    <div class="mt-4 mb-6"
      :style="!mobile && 'padding-right: 180px'">
      <no-data-block v-if="!pilot.LicenseController.Licenses.length" />
      <v-row v-else>
        <v-col v-for="l in pilot.LicenseController.Licenses"
          :key="l.Stub.ID"
          cols="12"
          md="4">
          <CCPilotLicenseItem v-if="inCompendium(l)"
            :pilot-license="l"
            title />
          <CCPilotLicenseStub v-else
            :pilot-license="l" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import CCPilotLicenseItem from '@/ui/components/items/CCPilotLicenseItem.vue'
import CCPilotLicenseStub from '@/ui/components/items/CCPilotLicenseStub.vue'
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import LicenseSelector from '@/features/pilot_management/_components/selectors/LicenseSelector.vue';
import { Pilot } from '@/classes/pilot/Pilot'
import { CompendiumStore } from '@/stores';

const props = defineProps({
  pilot: {
    type: Pilot,
    required: true,
  },
})

const { smAndDown: mobile, xs: portrait } = useDisplay()

function inCompendium(license) { return CompendiumStore().has('Frames', license.Stub.ID); }
</script>
