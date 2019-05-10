<template>
  <selector title="Pilot CORE Bonuses">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div v-for="b in bonuses" :key="`summary_${b.id}`">
            <v-layout>
              <v-flex>
                <strong>{{ b.name }}</strong>&nbsp;
                <span class="caption">({{ b.source }})</span>
              </v-flex>
            </v-layout>
          </div>
        </v-flex> 
      </v-layout>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-layout>
        <v-flex xs12>
          <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
            CORE Bonus Selection Complete
          </v-alert>
          <v-alert outline color="warning" icon="priority_high" :value="points.pointsCurrent !== points.pointsMax">
            {{points.pointsCurrent}} / {{points.pointsMax}} CORE Bonuses selected
          </v-alert>
          <v-btn v-if="!levelUp" block :disabled="!selectionComplete" @click="saveBonuses" color="primary">Save</v-btn>
          <v-btn v-if="!levelUp" block flat small :disabled="!bonuses.length" @click="resetBonuses">Reset</v-btn>
        </v-flex>
      </v-layout>
    </template>

    <template v-slot:right-column>
      <div v-for="m in Object.keys(bonusData)" :key="`summary_block_m${m}`">
        <v-layout>
          <v-flex class="text-xs-center pa-3">
            <span class="display-2 text-uppercase font-weight-light">{{manufacturer(m).name}}</span>
            <br>
            <span class="caption grey--text" v-html="requirement(m)" />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-expansion-panel expand focusable>
              <v-expansion-panel-content v-for="cb in bonusData[m]" :key="`${cb.id}_data'`" >
                <v-toolbar-title slot="header" dense>
                <v-icon v-if="!getAvailableCount(m) && !getSelectedCount(m)">mdi-lock</v-icon>
                <v-icon v-else-if="getSelectedStatus(cb)">check</v-icon>
                <span v-else class="mr-3" v-html="'&nbsp;'"/>
                &nbsp;<span>{{cb.name.toUpperCase()}}</span>
                </v-toolbar-title>
                <v-card>
                  <core-bonus-item :cb="cb" :key="cb.id" :selectable="getSelectableStatus(cb)" :isSelected="getSelectedStatus(cb)" 
                    select-item @added="addBonus(cb)" @removed="removeBonus(cb)" />
                </v-card>
              </v-expansion-panel-content>
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
  import Selector from './Selector.vue'
  import {CoreBonusItem} from '../SheetComponents'

  export default Vue.extend({
    name: 'core-bonus-selector',
    components: {Selector, CoreBonusItem},
    props: {
      pilotBonuses: Array,
      pilotLicenses: Array,
      pilotLevel: Number,
      levelUp: Boolean,
    },
    data: () => ({
      bonuses: [],
      licenses: {},
      bonusData: [],
    }),
    computed: {
      points () {
        var vm = this as any
        return {
          pointsCurrent: vm.bonuses.length,
          pointsMax: Math.floor(vm.pilotLevel / 3)
        }
      },
      selectionComplete () {
        var vm = this as any
        return vm.points.pointsCurrent === vm.points.pointsMax
      }
    },
    methods: {
      manufacturer (id: string): Manufacturer {
        return this.$store.getters['getItemById']('Manufacturers', id.toUpperCase())
      },
      requirement(m: string): string {
        var vm = this as any
        if (m === 'GMS') return `${vm.getSelectedCount(m)} ${m} CORE Bonuses Selected<br>GMS CORE Bonuses do not have a license requirement`
        var lvl = vm.getLevelCount(m)
        var output = `${lvl} ${m} Licenses Acquired &emsp;//&emsp; `
        output += `${vm.getAvailableCount(m)} ${m} CORE Bonuses Available &emsp;//&emsp; `
        output += `${vm.getSelectedCount(m)} ${m} CORE Bonuses Selected`
        if (vm.pilotLevel < 12) output += `<br>${lvl < 3 ? 'First' : 'Next'} ${m} CORE Bonus available in ${3 % lvl || 3} License Level${3 % lvl === 1 ? '' : 's'}`
        return output
      },
      getLevelCount(m: string): number {
        var vm = this as any
        return vm.pilotLicenses.filter((x: any) => x.source === m).reduce((a: any, b: any) => +a + +b.level, 0)
      },
      getSelectedCount(m: string): number {
        var vm = this as any
        return vm.bonuses.filter((x: any) => x.source === m).length
      },
      getAvailableCount(m: string): number {
        var vm = this as any
        if (m === "GMS") return Infinity
        return Math.floor(vm.getLevelCount(m) / 3) - vm.getSelectedCount(m)
      },
      getSelectedStatus(cb: CoreBonus): boolean {
        var vm = this as any
        return vm.bonuses.filter((x: any) => x.id === cb.id).length > 0
      },
      getSelectableStatus(cb: CoreBonus): boolean {
        var vm = this as any
        return vm.getAvailableCount(cb.source) > 0 && !vm.selectionComplete
      },
      addBonus (cb: CoreBonus) {
        var vm = this as any
        vm.bonuses.push(cb)

        if (vm.levelUp && vm.selectionComplete) {
          vm.$emit('set-bonuses', vm.bonuses.map((x: CoreBonus) => x.id))
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      removeBonus (cb: CoreBonus) {
        var vm = this as any
        var idx = vm.bonuses.findIndex((x: CoreBonus) => x.id === cb.id)
        if (idx !== -1) {
          vm.bonuses.splice(idx, 1)
        }
      },
      saveBonuses () {
        var vm = this as any
        vm.$emit('set-bonuses', vm.bonuses.map((x: CoreBonus) => x.id))
      },
      resetBonuses () {
        var vm = this as any
        vm.bonuses = []
      }
    },
    created () {
      var vm = this as any
      vm.bonusData = _.groupBy(vm.$store.getters['getItemCollection']('CoreBonuses'), 'source')
      vm.bonuses = vm.pilotBonuses.map((x: string) => vm.$store.getters['getItemById']('CoreBonuses', x))
    }
  })
</script>
