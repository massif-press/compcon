<template>
  <img
    v-if="isExternal"
    :src="source.Logo"
    :alt="source.Name"
    :style="{
      maxWidth: iconSize,
      height: 'auto',
      filter: getFilter,
    }"
  />
  <img
    v-else
    :src="`https://compcon-image-assets.s3.amazonaws.com/icons/${source.Logo}.svg`"
    :style="`width:${iconSize}; height:${iconSize}; filter: invert(${
      $vuetify.theme.dark ? 1 : 0
    });`"
  />
  <!-- <svg
    v-else
    :data-src="source.Logo"
    :style="
      `width:${iconSize}; height:${iconSize}; fill:${iconColor}; stroke:${stroke}; ${
        stroke ? 'stroke-width: 25px;' : ''
      }`
    "
  ></svg> -->
</template>

<script lang="ts">
import Vue from 'vue'
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
      type: Object,
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
    stroke: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    iconSize(): string {
      return sizeMap[this.size] ? sizeMap[this.size] : sizeMap.default
    },
    iconColor(): string {
      return this.color || this.source.Color
    },
    isExternal(): string {
      return this.source.LogoIsExternal
    },
    getFilter(): string {
      if (this.$vuetify.theme.dark) return 'brightness(0) invert(1)'
      return 'brightness(0)'
    },
  },
})
</script>
