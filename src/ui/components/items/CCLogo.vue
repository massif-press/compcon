<template>
  <div
    v-if="source.Svg"
    v-html="cleanSvg(source.Svg)"
    :style="{
      width: iconSize,
      height: iconSize,
      filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
    }" />
  <svg
    v-else-if="source.isExternalSvg && source.isCorsSafe"
    :data-src="source.Logo + '#Content'"
    :style="`width:${iconSize}; height:${iconSize}; fill:${iconColor}; stroke:${stroke}; ${
      stroke ? 'stroke-width: 25px;' : ''
    }`"></svg>
  <img
    v-else-if="source.Logo"
    :src="source.Logo"
    :alt="source.Name"
    :style="{
      maxWidth: iconSize,
      height: 'auto',
      filter: getFilter,
    }" />
</template>

<script lang="ts">
import DOMPurify from 'dompurify';

enum sizeMap {
  xSmall = '16px',
  small = '20px',
  default = '28px',
  medium = '32px',
  large = '35px',
  xLarge = '56px',
}

export default {
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
  data: () => ({
    corsSafe: false,
  }),
  computed: {
    iconSize(): string {
      return sizeMap[this.size] ? sizeMap[this.size] : sizeMap.default;
    },
    iconColor(): string {
      return this.color || this.source.Color;
    },
    getFilter(): string {
      if (this.$vuetify.theme.current.dark) return 'brightness(0) invert(1)';
      return 'brightness(0)';
    },
  },
  methods: {
    cleanSvg(svg: string): string {
      return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
    },
  },
};
</script>
