<template>
  <div class="inline">
    <!-- Small Element -->
    <div v-if="small">
      <v-tooltip top>
        <span
          slot="activator"
          class="inline"
          :style="`font-size: ${size || 18}px;`"
        >
          <div v-for="(d, index) in dmg" :key="`dmg_${index}_activator`">
            <b v-if="d.Override"><v-icon>more_horiz</v-icon></b>
            <b v-else :style="'color: ' + d.Color(dark)">
              {{ d.Value }}
              <v-icon :size="size" v-html="d.Icon" :color="d.Color(dark)" />
            </b>
            <i v-if="dmg.length - 1 > index" class="grey--text">//&nbsp;</i>
          </div>
        </span>
        <span>
          <div v-for="(d, index) in dmg" :key="`dmg_${index}_tooltip`">
            <b class="text-capitalize">{{ d.ToString }}</b>
          </div>
        </span>
      </v-tooltip>
    </div>

    <!-- Regular Element -->
    <div v-else>
      <span :style="`font-size: ${size || 18}px;`">
        <div
          v-for="(d, index) in dmg"
          :key="`dmg_${index}_dmgElement`"
          class="inline"
        >
          <b :style="'color: ' + d.Color(dark)">{{ d.ToString }}</b>
          <i v-if="dmg.length - 1 > index" class="grey--text">//&nbsp;</i>
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
    size: String,
  },
})
</script>

<style scoped>
.inline {
  display: inline-flex;
}
</style>
