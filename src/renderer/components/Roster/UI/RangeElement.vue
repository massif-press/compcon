<template>
  <div>
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 16}px; display: inline-flex;`">
          <span v-if="range[0].override"><v-icon>more_horiz</v-icon></span>
          <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_activator'">
            <span class="text-capitalize">{{range[n - 1].type}} {{range[n - 1].val}}</span>
            <span v-if="range.length > n" class="grey--text">//</span>
          </div>    
        </span>
        <span>
          Range  
        </span>
      </v-tooltip>

      <span v-if="!small" :style="`font-size: ${size || 16}px; display: inline-flex;`">
        <b v-if="range[0].override" class="text-capitalize"> {{range[n - 1].val}} </b>
        <div v-else v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_range'">
          <b  class="text-capitalize">{{range[n - 1].type}} {{range[n - 1].val}}</b>
          <span v-if="range.length > n" class="grey--text">//</span>
        </div>
      </span>
  </div>
</template>

<script>
  export default {
    name: 'damage-element',
    props: {
      range: Array,
      small: Boolean,
      size: String
    }
  }
</script>


