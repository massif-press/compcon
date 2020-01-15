<template>
  <v-dialog width="90vw">
    <template v-slot:activator="{ on }">
      <v-btn x-large outlined :color="pilotLicense.License.Manufacturer.Color" block v-on="on">
        <v-icon large :color="pilotLicense.License.Manufacturer.Color">
          cci-rank-{{ pilotLicense.Rank }}
        </v-icon>
        <v-spacer />
        {{ pilotLicense.License.Source }}
        {{ pilotLicense.License.Name }}
        {{ 'I'.repeat(pilotLicense.Rank) }}
        <v-spacer />
        <cc-logo size="large" :source="pilotLicense.License.Manufacturer" />
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <cc-license-panel :license="pilotLicense.License" ranked :rank="pilotLicense.Rank" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-pilot-license-item',
  props: {
    pilotLicense: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    color: 'primary',
  }),
})
</script>
