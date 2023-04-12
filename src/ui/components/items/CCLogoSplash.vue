<template>
  <svg
    v-if="isSvg && isCorsSafe"
    :data-src="source.Logo + '#Content'"
    :style="`width:22vw; height:22vw; fill:${iconColor}; stroke:#fff; stroke-width: 8px;`"
  ></svg>
  <img
    v-else
    :src="source.Logo"
    :alt="source.Name"
    :style="{
      maxWidth: '22vw',
      height: '22vw',
      filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
    }"
  />
</template>

<script lang="ts">
// import 'external-svg-loader';

export default {
  name: 'cc-logo-splash',
  props: {
    source: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    corsSafe: false,
  }),
  computed: {
    iconColor(): string {
      return this.color || this.source.Color;
    },
    isSvg(): boolean {
      return this.source.isSvg;
    },
    isCorsSafe(): boolean {
      return this.source.isCorsSafe;
    },
  },
};
</script>
