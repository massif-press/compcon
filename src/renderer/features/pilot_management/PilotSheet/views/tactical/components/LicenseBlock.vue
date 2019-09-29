<template>
  <div>
    <cc-title small>
      <section-edit-chip
        :highlight="!pilot.HasLicenses"
        :current="pilot.CurrentLicensePoints"
        :max="pilot.MaxLicensePoints"
        :label="`Edit Pilot Licenses (${pilot.CurrentLicensePoints}/${pilot.MaxLicensePoints})`"
        @open-selector="$refs.licenseSelector.show()"
      />Licenses
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
    <v-container>
      <v-row dense justify="center">
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

export default Vue.extend({
  name: 'skill-block',
  components: { SectionEditChip },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>