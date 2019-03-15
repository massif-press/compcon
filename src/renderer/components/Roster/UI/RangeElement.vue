<template>
  <div>
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 16}px; display: inline-flex;`">
          <span v-if="range[0].override"><v-icon>more_horiz</v-icon></span>
          <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_activator'">
            <span v-if="neurolinked && range[n-1].type === 'range'" class="text-capitalize">
              {{range[n - 1].type}} {{range[n - 1].val + 3}}*
            </span>
            <span v-else class="text-capitalize">{{range[n - 1].type}} {{range[n - 1].val}}</span>
            <span v-if="range.length > n" class="grey--text">//</span>
          </div>    
        </span>
        <span>
          Range  
        </span>
      </v-tooltip>

      <div v-if="!small">
      <span :style="`font-size: ${size || 16}px; display: inline-flex;`">
        <b v-if="range[0].override" class="text-capitalize"> {{range[n - 1].val}} </b>
        <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_range'">
          <b v-if="neurolinked && range[n-1].type === 'range'" class="text-capitalize">
            {{range[n - 1].type}} {{range[n - 1].val + 3}} ({{range[n - 1].val}} +3 )
          </b>
          <b v-else class="text-capitalize">{{range[n - 1].type}} {{range[n - 1].val}}</b>
          <span v-if="range.length > n" class="grey--text">//</span>
        </div>
      </span>
        <v-card v-if="neurolinked" color="grey darken-1" class="ml-5 mr-5 mt-3 mb-3">
          <v-card-text class="text-xs-center ma-0 pa-2">
            <span class="blockquote">Neuro-linked Targeting</span><br>
            <span>+3 Range</span>
            <!-- <v-btn color="grey lighten-1" flat outline small @click="shLockModal = true">Change Bracing Mount</v-btn> -->
          </v-card-text>
        </v-card>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'damage-element',
    props: {
      range: Array,
      small: Boolean,
      size: String,
      neurolinked: Boolean
    }
  }
</script>


