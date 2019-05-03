<template>
  <div>
    <!-- Small Element -->
    <div top v-if="small">
      <v-tooltip top v-if="range[0].override">
        <span slot="activator"><v-icon>more_horiz</v-icon></span>
        <span class="text-capitalize"> {{range[0].val}}</span>
      </v-tooltip>

      <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n - 1].val + '_activator'" style="display:inline">
        <v-tooltip top v-if="small">      
          <span slot="activator" :style="`font-size: ${size || 16}px; display: inline-flex;`">
            <span class="text-capitalize">{{getRange(range[n - 1], true)}}</span>
            <v-icon >cc-{{range[n-1].type}}</v-icon>&nbsp;
          </span>
          <span class="text-capitalize">
            {{range[n-1].type}} {{getRange(range[n - 1], true)}}
          </span>
        </v-tooltip>
      </div> 
    </div>


  <!-- Regular Element -->
    <div v-if="!small">
    <span :style="`font-size: ${size || 16}px; display: inline-flex;`">
      <b v-if="range[0].override" class="text-capitalize"> {{range[0].val}} </b>
      <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n - 1].val + '_range'">
        <b class="text-capitalize"> {{getRange(range[n - 1], false)}} </b>
        <span v-if="range.length > n" class="grey--text">//&nbsp;</span>
      </div>
    </span>
      <div v-if="showCb">
        <v-card v-if="bonuses && bonuses.gyges" color="grey darken-1" class="ml-5 mr-5 mt-3 mb-3">
          <v-card-text class="text-xs-center ma-0 pa-2">
            <span class="blockquote">GYGES Frame Reinforcement</span><br>
            <span>+1 Melee Weapon Threat</span>
          </v-card-text>
        </v-card>
        <v-card v-if="bonuses && bonuses.neurolinked" color="grey darken-1" class="ml-5 mr-5 mt-3 mb-3">
          <v-card-text class="text-xs-center ma-0 pa-2">
            <span class="blockquote">Neuro-linked Targeting</span><br>
            <span>+3 Range</span>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'range-element',
    props: {
      range: Array,
      small: Boolean,
      size: String,
      bonuses: Object,
      showCb: Boolean
    },
    methods: {
      getRange(range: {type: string, val: any}, small: boolean): string {
        var vm = this as any
        var rType = range.type
        var rVal = parseInt(range.val)
        var rBonusArr = []

        if (vm.bonuses) {
          if (range.type === 'range') {
            if (vm.bonuses.stabilizer) rBonusArr.push(5)
            if (vm.bonuses.neurolinked) rBonusArr.push(3)
          } else if (range.type === 'threat') {
            if (vm.bonuses.gyges) rBonusArr.push(1)   
          }
        }

        var sum = rBonusArr.reduce(function(a: number, b: number) { return a + b; }, 0);
        if (small) return rBonusArr.length ? `${rVal + sum}*` : `${rVal}`
        return rBonusArr.length ? `${rType} ${rVal + sum} (${rVal} + ${rBonusArr.join(' + ')})` : `${rType} ${rVal}`
      }
    }
  })
</script>
