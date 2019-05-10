<template>
  <div class="inline">
    <!-- Small Element -->
    <div v-if="small">
      <v-tooltip top>
        <span slot="activator" class="inline" :style="`font-size: ${size || 18}px;`">
          <b v-if="dmg[0].override"><v-icon>more_horiz</v-icon></b>
          <div v-else v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_activator'">
            <b class="text-capitalize" :style="'color: ' + color(dmg[n - 1].type)">{{dmg[n - 1].val}} 
              <v-icon v-if="dmg[n-1].type === 'variable'" :size="size" v-html="'mdi-flare'" :color="color(dmg[n - 1].type)" />
              <v-icon v-else size="20px" v-html="`cc-${dmg[n-1].type.toLowerCase()}`" :color="color(dmg[n - 1].type)" />
            </b>
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
    </div>

<!-- Regular Element -->
    <div v-else>
      <span :style="`font-size: ${size || 18}px;`">
        <b v-if="dmg[0].override" class="text-capitalize"> {{dmg[0].val}} </b>
        <div v-else v-for="n in dmg.length" :key="n + dmg[n-1].type + dmg[n-1].val + '_damageEle'" class="inline">
          <b class="text-capitalize" :style="'color: ' + color(dmg[n - 1].type)">{{dmg[n - 1].val}} {{dmg[n - 1].type}} damage</b>
          <i v-if="dmg.length > n" class="grey--text">// </i>
        </div>
      </span>    
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import colors from '@/features/_shared/UI/CCColors'

  export default Vue.extend({
    name: 'damage-element',
    props: {
      dmg: Array,
      small: Boolean,
      dark: Boolean,
      size: String
    },
    methods: {
      color (damageType: string): string {
        var c: any = colors.colors
        if (!damageType || ! c[damageType]) return (this as any).dark ? '#FFF' : '#000'
        return (this as any).dark ? c[damageType].dark : c[damageType].light
      }
    }
  })
</script>

<style scoped>
  .inline {
    display: inline-flex
  }
</style>

