<template>
  <selector title="Pilot Licenses">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div
            v-for="plicense in pilot.Licenses"
            :key="`summary_${plicense.License.Name}`"
          >
            <v-layout v-if="!licenseExists(plicense.License)">
              <v-flex shrink>
                <span class="grey--text">// MISSING DATA //</span>
                <br />
              </v-flex>
              <v-flex shrink>
                <v-btn
                  icon
                  flat
                  color="error"
                  @click="this.pilot.RemoveLicense(plicense.License)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex xs12>
                <v-icon color="primary" small>
                  cc-rank-{{ plicense.Rank }}
                </v-icon>
                <strong>{{ plicense.License.name }}</strong>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-layout>
        <v-flex xs12>
          <v-alert
            outline
            color="success"
            icon="check_circle"
            :value="selectionComplete"
          >
            License Selection Complete
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="points.pointsMax > points.pointsCurrent"
          >
            {{ points.pointsMax - points.pointsCurrent }} License Points
            remaining
          </v-alert>
          <v-btn
            block
            flat
            small
            :disabled="!pilot.Licenses.length"
            @click="resetLicenses"
          >
            Reset
          </v-btn>
        </v-flex>
      </v-layout>
    </template>
    <template v-slot:right-column>
      <div v-for="m in Object.keys(licenseData)" :key="`summary_block_m${m}`">
        <v-layout>
          <v-flex class="text-xs-center pa-3">
            <span class="display-2 text-uppercase font-weight-light">
              {{ manufacturer(m).name }}
            </span>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-expansion-panel focusable>
              <license-item
                v-for="l in licenseData[m]"
                :key="`${l.Name}_data'`"
                :pilotRank="pilotRank(l)"
                :licenseData="l"
                selectable
                :available="!selectionComplete"
                @add="addLicense(l)"
                @remove="pilot.RemoveLicense(l)"
              />
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <br />
      </div>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { PilotLicense, License, Manufacturer, Pilot } from '@/class'
import { LicenseItem } from '../SheetComponents'
import Selector from './Selector.vue'

export default Vue.extend({
  name: 'license-selector',
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  components: { LicenseItem, Selector },
  data: () => ({
    licenses: [],
    licenseData: [] as any,
  }),
  computed: {
    points(): {
      pointsCurrent: number
      pointsMax: number
      selectedCurrent: number
    } {
      var vm = this as any
      return {
        pointsCurrent: vm.pilot.Licenses.reduce(
          (a: any, b: any) => +a + +b.Rank,
          0
        ),
        pointsMax: vm.pilot.Level,
        selectedCurrent: vm.pilot.Licenses.length,
      }
    },
    selectionComplete(): boolean {
      var vm = this as any
      return vm.points.pointsCurrent === vm.points.pointsMax
    },
  },
  methods: {
    pilotRank(license: License): number {
      const l = this.pilot.Licenses.find(
        x => x.License.FrameID === license.FrameID
      )
      return l ? l.Rank : 0
    },
    manufacturer(id: string): Manufacturer {
      return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
    },
    licenseExists(license: License): boolean {
      if (!this.licenseData[license.Source]) return false
      return this.licenseData[license.Source].some(
        (x: License) => x.ToString === license.ToString
      )
    },
    addLicense(license: any) {
      var vm = this as any
      vm.pilot.AddLicense(license)

      if (vm.levelUp && vm.selectionComplete) {
        vm.$emit('set-licenses', vm.licenses)
        window.scrollTo(0, document.body.scrollHeight)
      }
    },
    removeLicense(license: any) {
      this.pilot.RemoveLicense(license)
    },
    resetLicenses() {
      this.pilot.ClearLicenses()
    },
  },
  created() {
    this.licenseData = _.groupBy(
      this.$store.getters.getItemCollection('Licenses'),
      'source'
    )
  },
})
</script>
