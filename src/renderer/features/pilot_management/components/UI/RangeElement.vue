<template>
  <div>
    <!-- Small Element -->
    <div top v-if="small">
      <div
        v-for="(r, index) in range"
        :key="`range_${index}_activator`"
        style="display:inline"
      >
        <!-- <v-tooltip top v-if="r.override">
        <span slot="activator"><v-icon>more_horiz</v-icon></span>
        <span class="text-capitalize"> {{r.Value}}</span>
      </v-tooltip> -->
        <v-tooltip top>
          <span
            slot="activator"
            :style="`font-size: ${size || 16}px; display: inline-flex;`"
          >
            <b v-if="r.Override"><v-icon>more_horiz</v-icon></b>
            <span v-else class="text-capitalize">
              {{ r.Value }}
              <v-icon>{{ r.Icon }}</v-icon>
              <span v-if="range.length - 1 > index" class="grey--text">
                //&nbsp;
              </span>
            </span>
          </span>
          <span>{{ r.ToString }}</span>
        </v-tooltip>
      </div>
    </div>

    <!-- Regular Element -->
    <div v-if="!small">
      <span :style="`font-size: ${size || 16}px; display: inline-flex;`">
        <!-- <b v-if="range[0].override" class="text-capitalize"> {{range[0].val}} </b> -->
        <div v-for="(r, index) in range" :key="`range_${index}_element`">
          <b>{{ r.ToString }}</b>
          <span v-if="range.length - 1 > index" class="grey--text">
            //&nbsp;
          </span>
        </div>
      </span>
      <!-- <div v-if="showCb">
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
      </div> -->
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
    showCb: Boolean,
  },
  methods: {
    getRange(range: { type: string; val: any }, small: boolean): string {
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

      var sum = rBonusArr.reduce(function(a: number, b: number) {
        return a + b
      }, 0)
      if (small) return rBonusArr.length ? `${rVal + sum}*` : `${rVal}`
      return rBonusArr.length
        ? `${rType} ${rVal + sum} (${rVal} + ${rBonusArr.join(' + ')})`
        : `${rType} ${rVal}`
    },
  },
})
</script>
