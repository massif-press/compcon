<template>
  <div style="display: inline-flex">
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 18}px; display: inline-flex;`">
          <b v-if="dmg[0].override"><v-icon>more_horiz</v-icon></b>
          <div v-else v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_activator'">
            <b :class="color(dmg[n - 1].type)">{{dmg[n - 1].val}} ¤</b>
            <span v-if="dmg.length > n" class="grey--text">//</span>
          </div>    
        </span>
        <span>
          <b v-if="dmg[0].override" class="text-capitalize"> {{dmg[0].val}} </b>
          <div v-else v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_tooltip'">
            <b class="text-capitalize">{{dmg[n - 1].val}} {{dmg[n - 1].type}} damage</b>
          </div>    
        </span>
      </v-tooltip>

      <span v-if="!small" :style="`font-size: ${size || 18}px;`">
        <b v-if="dmg[0].override" class="text-capitalize"> {{dmg[0].val}} </b>
        <div v-else v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_damageEle'" style="display: inline">
          <b :class="color(dmg[n - 1].type)">{{dmg[n - 1].val}} {{dmg[n - 1].type}} damage</b>
          <i v-if="dmg.length > n" class="grey--text">//</i>
        </div>
      </span>
  </div>
</template>

<script>
  export default {
    name: 'damage-element',
    props: {
      dmg: Array,
      small: Boolean,
      dark: Boolean,
      size: String
    },
    methods: {
      color: function (damageType) {
        switch (damageType.toLowerCase()) {
          case 'kinetic':
            return this.dark ? 'grey--text text--lighten-1  text-capitalize' : 'grey--text text--darken-1  text-capitalize'
          case 'explosive':
            return this.dark ? 'orange--text text--lighten-1 text-capitalize' : 'orange--text text--darken-4 text-capitalize'
          case 'energy':
            return this.dark ? 'blue--text text--lighten-2 text-capitalize' : 'blue--text text--darken-3 text-capitalize'
          case 'variable':
            return this.dark ? 'purple--text text--lighten-2 text-capitalize' : 'deep-purple--text text--darken-3 text-capitalize'
          case 'heat':
            return this.dark ? 'deep-orange--text text--lighten-1 text-capitalize' : 'deep-orange--text text--lighten-4 text-capitalize'
          case 'burn':
            return this.dark ? 'red--text text--lighten-1 text-capitalize' : 'red--text text--darken-1 text-capitalize'
          default:
            return this.dark ? 'white text-capitalize' : 'black text-capitalize'
        }
      }
    }
  }
</script>