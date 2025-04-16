<template>
  <div
    v-if="source.Svg"
    class="d-inline-block"
    v-html="cleanSvg(source.Svg)"
    :style="{
      width: iconSize,
      height: iconSize,
      filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
    }" />
  <div
    v-else-if="source.Logo"
    class="d-inline-block"
    v-html="svgContent"
    :style="{
      width: iconSize,
      height: iconSize,
      fill: source.Color,
    }"
    :aria-label="source.Name"
    role="img" />
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
    width: {
      type: String,
      required: false,
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
    svgContent: '',
  }),
  watch: {
    'source.Logo': {
      immediate: true,
      handler(newLogo) {
        if (newLogo) {
          fetch(newLogo)
            .then((res) => res.text())
            .then((text) => {
              text = text.replace(/fill:#/g, ``);
              this.svgContent = text;
            })
            .catch(() => {
              this.svgContent = '';
            });
        }
      },
    },
  },
  computed: {
    iconSize(): string {
      if (this.width) {
        return this.width;
      }
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
