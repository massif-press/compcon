<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-chip
        :highlight="!pilot.HasLicenses"
        :current="pilot.CurrentLicensePoints"
        :max="pilot.MaxLicensePoints"
        :label="`Edit Pilot Licenses (${pilot.CurrentLicensePoints}/${pilot.MaxLicensePoints})`"
        @open-selector="$refs.licenseSelector.show()"
      />
      Licenses
    </cc-title>
    <cc-solo-dialog
      ref="licenseSelector"
      icon="cci-frame"
      no-confirm
      title="Set Pilot Licenses"
      fullscreen
    >
      <cc-license-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-container fluid>
      <no-data-block v-if="!pilot.Licenses.length" />
      <v-row v-else :style="$vuetify.breakpoint.lgAndUp ? `width: calc(100vw - 250px)` : ''">
        <v-col v-for="(l, i) in pilot.Licenses" :key="`l_${i}`" cols="4">
          <cc-pilot-license-item :pilot-license="l" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'license-block',
  components: { SectionEditChip, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
