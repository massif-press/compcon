<template>
  <selector title="Pilot Licenses" height="60vh" :success="!pilot.IsMissingLicenses">
    <template v-slot:left-column>
      <v-row v-for="pl in pilot.Licenses" :key="`summary_${pl.License.Name}`">
        <missing-item v-if="pl.License.err" @remove="remove(pl)" />
        <span v-else>
          <v-icon :color="manufacturer(pl.License.Source).Color">cci-rank-{{ pl.Rank }}</v-icon>
          <strong>{{ pl.License.Name }}</strong>
        </span>
      </v-row>
      <v-divider v-if="pilot.Licenses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          outlined
          color="success"
          icon="check_circle"
          class="stat-text"
          :value="!pilot.IsMissingLicenses"
        >
          License Selection Complete
        </v-alert>
        <v-alert
          outlined
          color="accent"
          icon="warning"
          class="stat-text"
          :value="pilot.IsMissingLicenses"
        >
          {{ pilot.CurrentLicensePoints }} / {{ pilot.MaxLicensePoints }} Licenses selected
        </v-alert>
        <v-btn block text small :disabled="!pilot.Licenses.length" @click="pilot.ClearLicenses()">
          Reset
        </v-btn>
      </v-row>
    </template>

    <template v-slot:right-column>
      <v-row v-for="m in Object.keys(licenses)" :key="m">
        <v-col class="text-center pa-3">
          <span class="heading mech" :style="`color: ${manufacturer(m).color}`">
            <cc-logo :source="manufacturer(m)" size="xLarge" class="pt-4" />
            {{ manufacturer(m).name }}
          </span>
          <v-expansion-panels accordion focusable active-class="border-primary">
            <license-select-item
              v-for="l in licenses[m]"
              :key="l.FrameID"
              :license="l"
              :is-selectable="pilot.IsMissingLicenses"
              :rank="pilot.getLicenseRank(l.Name)"
              @add="pilot.AddLicense(l)"
              @remove="pilot.RemoveLicense(l)"
            />
          </v-expansion-panels>
          <v-divider class="mt-5 mb-0" />
        </v-col>
      </v-row>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import LicenseSelectItem from './components/_LicenseSelectItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'cc-license-selector',
  components: { Selector, LicenseSelectItem, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    licenses: [],
  }),
  computed: {
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.IsMissingLicenses
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight)
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.licenses = this.$_.groupBy(compendium.Licenses, 'Source')
  },
  methods: {
    manufacturer(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID('Manufacturers', id.toUpperCase())
    },
  },
})
</script>
