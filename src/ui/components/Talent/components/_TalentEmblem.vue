<template>
  <div>
    <div
      v-if="talent.Svg"
      v-html="cleanSvg(talent.Svg)"
      style="float: right; max-width: 22vw; max-height: 22vw; stroke: #fff; stroke-width: 8px" />

    <v-img
      v-else
      ref="img"
      :src="src"
      class="pa-2"
      :width="iconSize"
      min-height="100%"
      contain
      :class="$vuetify.theme.current.dark ? 'white-emblem' : 'black-emblem'"
      @error="imageLoadFailed()" />
    <div v-if="backup" :class="`banner text-cc-overline`">
      {{ backup }}
    </div>
  </div>
</template>

<script lang="ts">
import DOMPurify from 'dompurify';

export default {
  name: 'talent-emblem',
  props: {
    talent: { type: Object, required: true },
    size: { type: String, default: 'default' },
  },
  data: () => ({
    backup: '',
    src: '',
  }),
  computed: {
    iconSize() {
      if (this.size === 'large') return '100px';
      if (this.size === 'small') return '50px';
      return 'calc(30px + 1vw)';
    },
  },
  created() {
    this.src = this.talent.Image;
  },
  methods: {
    imageLoadFailed() {
      this.src = '/public/talent/GENERIC TALENT.svg';
      this.backup = this.talent.Name;
    },
    getImageLoc() {
      return new URL(this.src, import.meta.url).href;
    },
    cleanSvg(svg: string): string {
      return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
    },
  },
};
</script>

<style scoped>
.white-emblem {
  filter: invert(100%);
}

.black-emblem {
  filter: invert(0%);
}

.banner {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 0;
  width: 100%;
  font-size: 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
