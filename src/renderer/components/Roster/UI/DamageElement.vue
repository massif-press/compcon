<template>
  <div style="display: inline-flex">
      <v-tooltip top v-if="small">
        <span slot="activator" :style="`font-size: ${size || 18}px; display: inline-flex;`">
          <div v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_activator'">
            <b v-if="dmg[n - 1].override"><v-icon>more_horiz</v-icon></b>
            <b v-else :class="color(dmg[n - 1].type)">{{dmg[n - 1].val}} ¤</b>
            <span v-if="dmg.length > n" class="grey--text">&nbsp;//&nbsp;</span>
          </div>    
        </span>
        <span>
          <div v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_tooltip'">
            <b v-if="dmg[n - 1].override" class="text-capitalize"> {{dmg[n - 1].val}} </b>
            <b v-else class="text-capitalize">{{dmg[n - 1].val}} {{dmg[n - 1].type}} damage</b>
          </div>    
        </span>
      </v-tooltip>

      <span v-if="!small" :style="`font-size: ${size || 18}px`">
        <div v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_damageEle'">
          <b v-if="dmg[n - 1].override" class="text-capitalize"> {{dmg[n - 1].val}} </b>
          <b v-else :class="color(dmg[n - 1].type)">{{dmg[n - 1].val}} {{dmg[n - 1].type}} damage</b>
          <span v-if="dmg.length > n" class="grey--text">&nbsp;//&nbsp;</span>
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
      size: String
    },
    methods: {
      color: function (damageType) {
        switch (damageType.toLowerCase()) {
          case 'kinetic':
            return 'grey--text text--darken-1  text-capitalize'
          case 'explosive':
            return 'orange--text text--darken-4 text-capitalize'
          case 'energy':
            return 'blue--text text--darken-3 text-capitalize'
          case 'variable':
            return 'deep-purple--text text--darken-3 text-capitalize'
          case 'heat':
            return 'deep-orange--text text--lighten-4 text-capitalize'
          case 'burn':
            return 'red--text text--darken-1 text-capitalize'
          default:
            return 'black text-capitalize'
        }
      }
    }
  }
</script>