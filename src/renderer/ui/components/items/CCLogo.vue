<template>
  <svg :style="`width:${iconSize}; height:${iconSize}; fill:${iconColor}`" v-html="svg" />
</template>

<script lang="ts">
import Vue from 'vue'
import fs from 'fs'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

enum sizeMap {
  xSmall = '16px',
  small = '20px',
  default = '28px',
  medium = '32px',
  large = '40px',
  xLarge = '56px',
}

export default Vue.extend({
  name: 'cc-logo',
  props: {
    source: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: 'default',
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    svg: '',
    mColor: '',
  }),
  computed: {
    iconSize(): string {
      return sizeMap[this.size] ? sizeMap[this.size] : sizeMap.default
    },
    iconColor(): string {
      return this.color ? this.color : this.mColor
    },
  },
  created() {
    const s = getModule(CompendiumStore, this.$store)
    const m = s.Manufacturers.find(x => x.id.toLowerCase() === this.source.toLowerCase())
    this.mColor = m.color
    this.svg = fs.readFileSync(`${Vue.prototype.userDataPath}/img/default_logo/${m.logo}.svg`)
  },
})
</script>