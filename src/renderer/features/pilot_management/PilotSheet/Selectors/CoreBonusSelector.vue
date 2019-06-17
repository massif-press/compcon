<template>
  <selector title="Pilot CORE Bonuses">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div v-for="b in pilot.CoreBonuses" :key="`summary_${b.id}`">
            <v-layout>
              <v-flex>
                <strong>{{ b.Name }}</strong>
                &nbsp;
                <span class="caption">({{ b.Source }})</span>
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
            CORE Bonus Selection Complete
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="points.pointsCurrent !== points.pointsMax"
          >
            {{ points.pointsCurrent }} / {{ points.pointsMax }} CORE Bonuses
            selected
          </v-alert>
          <v-btn
            v-if="!levelUp"
            block
            flat
            small
            :disabled="!pilot.CoreBonuses.length"
            @click="pilot.ClearCoreBonuses()"
          >
            Reset
          </v-btn>
        </v-flex>
      </v-layout>
    </template>

    <template v-slot:right-column>
      <div v-for="m in Object.keys(bonusData)" :key="`summary_block_m${m}`">
        <v-layout>
          <v-flex class="text-xs-center pa-3">
            <span class="display-2 text-uppercase font-weight-light">
              {{ manufacturer(m).name }}
            </span>
            <br />
            <span class="caption grey--text" v-html="requirement(m)" />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-expansion-panel expand focusable>
              <v-expansion-panel-content
                v-for="cb in bonusData[m]"
                :key="`${cb.id}_data'`"
              >
                <v-toolbar-title slot="header" dense>
                  <v-icon v-if="!getAvailableCount(m) && !getSelectedCount(m)">
                    mdi-lock
                  </v-icon>
                  <v-icon v-else-if="getSelectedStatus(cb)">check</v-icon>
                  <span v-else class="mr-3" v-html="'&nbsp;'" />
                  &nbsp;
                  <span>{{ cb.name.toUpperCase() }}</span>
                </v-toolbar-title>
                <v-card>
                  <core-bonus-item
                    :cb="cb"
                    :key="cb.id"
                    :selectable="getSelectableStatus(cb)"
                    :isSelected="getSelectedStatus(cb)"
                    select-item
                    @added="addBonus(cb)"
                    @removed="pilot.RemoveCoreBonus(cb)"
                  />
                </v-card>
              </v-expansion-panel-content>
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
import Selector from './Selector.vue'
import { CoreBonusItem } from '../SheetComponents'
import { Pilot, License, PilotLicense, CoreBonus, Manufacturer } from '@/class'

export default Vue.extend({
  name: 'core-bonus-selector',
  components: { Selector, CoreBonusItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    bonusData: [],
  }),
  computed: {
    points() {
      var vm = this as any
      return {
        pointsCurrent: vm.pilot.CoreBonuses.length,
        pointsMax: Math.floor(vm.pilot.Level / 3),
      }
    },
    selectionComplete() {
      var vm = this as any
      return vm.points.pointsCurrent === vm.points.pointsMax
    },
  },
  methods: {
    manufacturer(id: string): Manufacturer {
      return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
    },
    requirement(m: string): string {
      var vm = this as any
      if (m === 'GMS')
        return `${vm.getSelectedCount(
          m
        )} ${m} CORE Bonuses Selected<br>GMS CORE Bonuses do not have a license requirement`
      var lvl = vm.getLevelCount(m)
      var output = `${lvl} ${m} Licenses Acquired &emsp;//&emsp; `
      output += `${vm.getAvailableCount(
        m
      )} ${m} CORE Bonuses Available &emsp;//&emsp; `
      output += `${vm.getSelectedCount(m)} ${m} CORE Bonuses Selected`
      if (vm.pilotLevel < 12)
        output += `<br>${
          lvl < 3 ? 'First' : 'Next'
        } ${m} CORE Bonus available in ${3 % lvl || 3} License Level${
          3 % lvl === 1 ? '' : 's'
        }`
      return output
    },
    getLevelCount(m: string): number {
      var vm = this as any
      return vm.pilot.Licenses.filter(
        (x: PilotLicense) => x.License.Source === m
      ).reduce((a: any, b: any) => +a + +b.Rank, 0)
    },
    getSelectedCount(m: string): number {
      var vm = this as any
      return vm.pilot.CoreBonuses.filter((x: CoreBonus) => x.Source === m)
        .length
    },
    getAvailableCount(m: string): number {
      var vm = this as any
      if (m === 'GMS') return Infinity
      return Math.floor(vm.getLevelCount(m) / 3) - vm.getSelectedCount(m)
    },
    getSelectedStatus(cb: CoreBonus): boolean {
      var vm = this as any
      return vm.pilot.CoreBonuses.filter((x: any) => x.id === cb.ID).length > 0
    },
    getSelectableStatus(cb: CoreBonus): boolean {
      var vm = this as any
      return vm.getAvailableCount(cb.Source) > 0 && !vm.selectionComplete
    },
    addBonus(cb: CoreBonus) {
      var vm = this as any
      vm.pilot.AddCoreBonus(cb)

      if (vm.levelUp && vm.selectionComplete) {
        window.scrollTo(0, document.body.scrollHeight)
      }
    },
  },
  created() {
    var vm = this as any
    vm.bonusData = _.groupBy(
      vm.$store.getters.getItemCollection('CoreBonuses'),
      'source'
    )
  },
})
</script>
