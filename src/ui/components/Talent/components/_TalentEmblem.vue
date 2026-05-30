<template>
  <div>
    <div v-if="talent.Svg"
      v-html-safe="cleanSvg(talent.Svg)"
      :style="`width: ${iconSize}; height: ${iconSize}; fill: #fff`" />

    <v-img v-else
      ref="img"
      :src="src"
      class="pa-2"
      :width="iconSize"
      min-height="100%"
      contain
      :class="!dark ? 'white-emblem' : 'black-emblem'"
      @error="imageLoadFailed()" />
    <div v-if="backup"
      :class="`banner text-cc-overline`">
      {{ backup }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DOMPurify from 'dompurify';

const props = withDefaults(defineProps<{
  talent: object
  size?: string
  dark?: boolean
}>(), {
  size: 'default',
  dark: false
})

const img = ref<any>(null)

const backup = ref('')
const src = ref('')

src.value = props.talent.Image;

const iconSize = computed(() => {
      if (props.size === 'large') return '100px';
      if (props.size === 'small') return '50px';
      return 'calc(30px + 1vw)';
    })

function imageLoadFailed() {
      src.value = '/talent/GENERIC%20TALENT.svg';
      backup.value = props.talent.Name;
    }
function getImageLoc() {
      return new URL(src.value, import.meta.url).href;
    }
function cleanSvg(svg: string) {
      return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
    }
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
