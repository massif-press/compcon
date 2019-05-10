<template>
  <selector title="Pilot Talents">
    <template v-slot:left-column>
       <v-layout>
          <v-flex xs12>
            <div v-for="talent in talents" :key="`summary_${talent.id}`">
              <v-layout v-if="talentById(talent.id).err">
                <v-flex shrink>
                 <span class="grey--text">// MISSING DATA //</span>
                 <span v-if="talent.brew" class="caption grey--text"><br>({{talent.brew}})</span>
                </v-flex>
                <v-flex shrink>
                  <v-btn icon flat color="error" @click="deleteTalent(talent.id)"><v-icon>delete</v-icon></v-btn>
                </v-flex>
              </v-layout>
              <v-layout v-else>
                <v-flex xs12>
                  <strong>{{ talentById(talent.id).name }}</strong>
                  <v-icon v-for="n in talent.rank" :key="talent.rank + n" small>star</v-icon>
                </v-flex>
              </v-layout>
            </div>
          </v-flex> 
        </v-layout>
        <v-divider class="ma-2 ml-4 mr-4" />
        <v-layout>
          <v-flex xs12>
            <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
              Talent Selection Complete
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.pointsMax > points.pointsCurrent">
              {{points.pointsMax  - points.pointsCurrent}} Talent Points remaining
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.selectedCurrent < points.selectedMin">
              Must select a minimum of {{points.selectedMin}} talents
            </v-alert>
            <v-btn v-if="!newPilot && !levelUp" block :disabled="!selectionComplete" @click="saveTalents" color="primary">Save</v-btn>
            <v-btn block flat small :disabled="!talents.length" @click="resetTalents">Reset</v-btn>
          </v-flex>
        </v-layout>
    </template>
    
    <template v-slot:right-column>
        <v-expansion-panel expand focusable v-model="panels">
          <talent-item v-for="talent in talentData" :key="talent.id" selectable :available="points.pointsMax > points.pointsCurrent"
            :talentData="talent" :talent="pilotTalent(talent.id)" @add="addTalent(talent)" @remove="removeTalent(talent)" :new-pilot="newPilot"/>
        </v-expansion-panel>
    </template>
  </selector>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {TalentItem} from '../SheetComponents'
  import Selector from './Selector.vue'

  function talentSort (talents: PilotTalent[]) {
    return talents.sort(function (a, b) {
      return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1
    })
  }

  export default Vue.extend({
    name: 'talent-selector',
    props: {
      pilotTalents: Array,
      pilotLevel: Number,
      newPilot: Boolean,
      levelUp: Boolean,
    },
    components: { Selector, TalentItem },
    data: () => ({
      talents: [],
      talentData: [],
      pLevel: 0,
      panels: [],
    }),
    computed: {
      points () {
        var vm = this as any
        return {
          pointsCurrent: vm.talents.reduce((a: any, b: any) => +a + +b.rank, 0),
          pointsMax: 3 + vm.pLevel,
          selectedCurrent: vm.talents.length,
          selectedMin: 3
        }
      },
      selectionComplete () {
        var vm = this as any
        return vm.points.pointsCurrent === vm.points.pointsMax &&
          vm.points.selectedCurrent >= vm.points.selectedMin
      },
      pointLimit (): boolean {
        var vm = this as any
        return vm.talents.reduce((a: any, b: any) => +a + +b.rank, 0) >= vm.points.pointsMax
      }
    },
    methods: {
      playerRank (id: string): number {
        var vm = this as any
        var t = vm.talents.find((x: any) => x.id === id)
        return t ? t.rank : 0
      },
      pilotTalent (id: string): any {
        var vm = this as any
        return vm.talents.find((x: any) => x.id === id) || {rank: 0}
      },
      addTalent (talent: PilotTalent) {
        var vm = this as any
        var idx = vm.talents.findIndex((x: any) => x.id === talent.id)
        if (idx === -1) {
          vm.talents.push({
            id: talent.id,
            rank: 1,
            brew: talent.brew || null
          })
        } else {
          vm.talents[idx].rank++
        }
        vm.talents = talentSort(vm.talents)
        if (vm.newPilot) vm.panels = []

        if ((vm.newPilot || vm.levelUp) && vm.pointLimit) {
          if (vm.levelUp) vm.$emit('set-talents', vm.talents)
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      removeTalent (talent: PilotTalent) {
        var vm = this as any
        var idx = vm.talents.findIndex((x: any) => x.id === talent.id)
        if (idx !== -1) {
          vm.talents[idx].rank--
          if (vm.talents[idx].rank === 0) vm.talents.splice(idx, 1)
        }
        vm.talents = talentSort(vm.talents)
      },
      saveTalents () {
        var vm = this as any
        vm.$emit('set-talents', vm.talents)
      },
      resetTalents () {
        var vm = this as any
        vm.talents.splice(0, vm.talents.length)
        vm.$forceUpdate()
        vm.panels = []
      },
      talentById (id: string): PilotTalent {
        var vm = this as any
        return vm.$store.getters['getItemById']('Talents', id)
      }
    },
    created () {
      var vm = this as any
      vm.pLevel = vm.newPilot ? 0 : vm.pilotLevel
      vm.talentData = vm.$store.getters['getItemCollection']('Talents')
      vm.talents = vm.newPilot ? talentSort(vm.pilotTalents) : talentSort(JSON.parse(JSON.stringify(vm.pilotTalents)))
    }
  })
</script>
