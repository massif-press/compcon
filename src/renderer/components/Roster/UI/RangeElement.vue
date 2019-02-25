<template>
  <div>
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 16}px; display: inline-flex;`">
          <div v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_activator'">
            <span v-if="range[n - 1].override"><v-icon>more_horiz</v-icon></span>
            <span v-else class="text-capitalize">{{range[n - 1].type}}: {{range[n - 1].val}}</span>
            <span v-if="range.length > n" class="grey--text">&nbsp;//&nbsp;</span>
          </div>    
        </span>
        <span>
          Range  
        </span>
      </v-tooltip>

      <span v-if="!small" :style="`font-size: ${size || 16}px; display: inline-flex;`">
        Range:&nbsp;
        <div v-for="n in range.length" :key="n + range[n-1].type + range[n-1].val + '_range'">
          <b v-if="range[n - 1].override" class="text-capitalize"> {{range[n - 1].val}} </b>
          <b v-else class="text-capitalize">{{range[n - 1].type}}: {{range[n - 1].val}}</b>
          <span v-if="range.length > n" class="grey--text">&nbsp;//&nbsp;</span>
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


