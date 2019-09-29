<template>
  <v-dialog width="90vw">
    <template v-slot:activator="{ on }">
      <v-btn x-large outlined :color="color" block v-on="on">
        <v-icon large :color="color">cci-rank-{{ pilotLicense.Rank }}</v-icon>
        <v-spacer />
        {{ pilotLicense.License.Source }}
        {{ pilotLicense.License.Name }}
        {{ 'I'.repeat(pilotLicense.Rank) }}
        <v-spacer />
        <cc-logo size="large" :source="pilotLicense.License.Source" />
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
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'cc-core-bonus-item',
  props: {
    pilotLicense: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    color: 'primary',
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.color = compendium.getItemById(
      'Manufacturers',
      this.pilotLicense.License.source.toUpperCase()
    ).color
  },
})
</script>