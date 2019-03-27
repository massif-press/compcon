<template>
  <div>
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 16}px; display: inline-flex;`">
          <span v-if="range[0].override"><v-icon>more_horiz</v-icon></span>
          <div v-else v-for="n in range.length" :key="n + range[n-1].type + parseInt(range[n - 1].val) + '_activator'">
            <span v-if="bonuses && bonuses.neurolinked && range[n-1].type === 'range'" class="text-capitalize">
              {{range[n - 1].type}} {{parseInt(range[n - 1].val) + 3}}*
            </span>
            <span v-if="bonuses && bonuses.gyges && range[n-1].type === 'threat'" class="text-capitalize">
              {{range[n - 1].type}} {{parseInt(range[n - 1].val) + 1}}*
            </span>
            <span v-else class="text-capitalize">{{range[n - 1].type}} {{parseInt(range[n - 1].val)}}</span>
            <span v-if="range.length > n" class="grey--text">//</span>
          </div>    
        </span>
        <span>
          Range  
        </span>
      </v-tooltip>

      <div v-if="!small">
      <span :style="`font-size: ${size || 16}px; display: inline-flex;`">
        <b v-if="range[0].override" class="text-capitalize"> {{range[0].val}} </b>
        <div v-else v-for="n in range.length" :key="n + range[n-1].type + parseInt(range[n - 1].val) + '_range'">
          <b v-if="bonuses && bonuses.neurolinked && range[n-1].type === 'range'" class="text-capitalize">
            {{range[n - 1].type}} {{parseInt(range[n - 1].val) + 3}} ({{parseInt(range[n - 1].val)}} +3 )
          </b>
          <b v-if="bonuses && bonuses.gyges && range[n-1].type === 'threat'" class="text-capitalize">
            {{range[n - 1].type}} {{parseInt(range[n - 1].val) + 1}} ({{parseInt(range[n - 1].val)}} +1 )
          </b>
          <b v-else class="text-capitalize">{{range[n - 1].type}} {{parseInt(range[n - 1].val)}}</b>
          <span v-if="range.length > n" class="grey--text">//</span>
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

<script>
  export default {
    name: 'range-element',
    props: {
      range: Array,
      small: Boolean,
      size: String,
      bonuses: Object,
      showCb: Boolean
    }
  }
</script>


