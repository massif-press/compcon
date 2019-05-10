<template>
  <selector title="Pilot Licenses">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div v-for="license in licenses" :key="`summary_${license.name}`">
            <v-layout v-if="!licenseExists(license.source, license.name)">
              <v-flex shrink>
                <span class="grey--text">// MISSING DATA //</span><br>
                <span v-if="license.brew" class="caption grey--text">({{license.brew}})</span>
              </v-flex>
              <v-flex shrink>
                <v-btn icon flat color="error" @click="deleteLicense(license.name)"><v-icon>delete</v-icon></v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex xs12>
                <strong>{{ license.name }}</strong>
                <v-icon v-for="n in license.level" :key="license.level + n" small>star</v-icon>
              </v-flex>
            </v-layout>
          </div>
        </v-flex> 
      </v-layout>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-layout>
        <v-flex xs12>
          <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
            License Selection Complete
          </v-alert>
          <v-alert outline color="warning" icon="priority_high" :value="points.pointsMax > points.pointsCurrent">
            {{points.pointsMax  - points.pointsCurrent}} License Points remaining
          </v-alert>
          <v-btn v-if="!newPilot && !levelUp" block :disabled="!selectionComplete" @click="saveLicenses" color="primary">Save</v-btn>
          <v-btn block flat small :disabled="!licenses.length" @click="resetLicenses">Reset</v-btn>
        </v-flex>
      </v-layout>
    </template>
    <template v-slot:right-column>
      <div v-for="m in Object.keys(licenseData)" :key="`summary_block_m${m}`">
        <v-layout>
          <v-flex class="text-xs-center pa-3">
            <span class="display-2 text-uppercase font-weight-light">{{manufacturer(m).name}}</span>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-expansion-panel focusable>
              <license-item v-for="l in licenseData[m]" :key="`${l.license}_data'`" :pilotRank="pilotRank(l.license)" :licenseData="l" 
                selectable :available="!selectionComplete" @add="addLicense(l)" @remove="removeLicense(l)" />
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <br>
      </div>
    </template>    
  </selector>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import {LicenseItem} from '../SheetComponents'
  import Selector from './Selector.vue'

  function licenseSort (licenses: PilotLicense[]) {
    return licenses.sort(function (a, b) {
      return a.level === b.level ? 0 : a.level > b.level ? -1 : 1
    })
  }

  export default Vue.extend({
    name: 'license-selector',
    props: {
      pilotLicenses: Array,
      pilotLevel: Number,
      newPilot: Boolean,
      levelUp: Boolean
    },
    components: { LicenseItem, Selector },
    data: () => ({
      licenses: [],
      pLevel: 0,
      licenseData: [],
    }),
    computed: {
      points (): {pointsCurrent: number, pointsMax: number, selectedCurrent: number} {
        var vm = this as any
        return {
          pointsCurrent: (vm.licenses.reduce((a: any, b: any) => +a + +b.level, 0)),
          pointsMax: vm.pLevel,
          selectedCurrent: vm.licenses.length
        }
      },
      selectionComplete (): boolean {
        var vm = this as any
        return vm.points.pointsCurrent === vm.points.pointsMax
      }
    },
    methods: {
      pilotRank (name: string): number {
        var vm = this as any
        var t = vm.licenses.find((x: any) => x.name.toUpperCase() === name)
        return t ? t.level : 0
      },
      manufacturer (id): Manufacturer {
        return this.$store.getters['getItemById']('Manufacturers', id.toUpperCase())
      },
      licenseExists (source: string, name: string): boolean {
        var vm = this as any
        if (!vm.licenseData[source.toUpperCase()]) return false
        if (!vm.licenseData[source.toUpperCase()].find((x: any) => x.license === name.toUpperCase())) return false
        return true
      },
      addLicense (license: any) {
        var vm = this as any
        var idx = vm.licenses.findIndex((x: any) => x.name.toUpperCase() === license.license.toUpperCase())
        if (idx === -1) {
          vm.licenses.push({
            name: license.license.toUpperCase(),
            source: license.source.toUpperCase(),
            level: 1,
            brew: license.brew || null
          })
        } else {
          vm.licenses[idx].level++
        }
        vm.licenses = licenseSort(vm.licenses)

        if (vm.levelUp && vm.selectionComplete) {
          vm.$emit('set-licenses', vm.licenses)
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      removeLicense (license: any) {
        var vm = this as any
        var idx = vm.licenses.findIndex((x: any) => x.name === license.license.toUpperCase())
        if (idx !== -1) {
          vm.licenses[idx].level--
          if (vm.licenses[idx].level === 0) vm.licenses.splice(idx, 1)
        }
        vm.licenses = licenseSort(vm.licenses)
      },
      saveLicenses () {
        var vm = this as any
        vm.$emit('set-licenses', vm.licenses)
      },
      resetLicenses () {
        var vm = this as any
        vm.licenses.splice(0, vm.licenses.length)
        vm.$forceUpdate()
      }
    },
    created () {
      var vm = this as any
      vm.pLevel = vm.pilotLevel
      vm.licenseData = _.groupBy(vm.$store.getters['getItemCollection']('Licenses'), 'source')
      vm.licenses = licenseSort(JSON.parse(JSON.stringify(vm.pilotLicenses)))
    }
  })
</script>
