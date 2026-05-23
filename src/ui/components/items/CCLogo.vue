<template>
  <div v-if="source.Svg"
    v-html-safe="cleanSvg(source.Svg)"
    class="d-inline-block"
    :style="{
      width: iconSize,
      height: iconSize,
      filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
    }" />
  <div v-else-if="isLinkedSvg"
    v-html-safe="svgContent"
    class="d-inline-block"
    :style="{
      width: iconSize,
      height: iconSize,
      fill: source.Color,
    }"
    :aria-label="source.Name"
    role="img" />
  <v-img v-else-if="source.Logo"
    :src="source.Logo"
    :width="iconSize"
    :height="iconSize"
    :style="{ filter: getFilter }"
    :alt="source.Name"
    :aria-label="source.Name"
    role="img" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import DOMPurify from 'dompurify';

enum sizeMap {
  xSmall = '16px',
  small = '20px',
  default = '28px',
  medium = '32px',
  large = '35px',
  xLarge = '56px',
}

const props = withDefaults(defineProps<{
  source: object
  size?: string
  width?: string
  color?: string
  stroke?: string
}>(), {
  size: 'default',
  color: '',
  stroke: '',
})

const theme = useTheme()

const svgContent = ref('')

const iconSize = computed((): string => {
  if (props.width) {
    return props.width;
  }
  return sizeMap[props.size] ? sizeMap[props.size] : sizeMap.default;
})

const iconColor = computed((): string => {
  return props.color || props.source.Color;
})

const getFilter = computed((): string => {
  if (theme.current.value.dark) return 'brightness(0) invert(1)';
  return 'brightness(0)';
})

const isLinkedSvg = computed((): boolean => {
  return props.source.Logo && props.source.Logo.endsWith('svg');
})

function cleanSvg(svg: string): string {
  return sizeSvg(
    DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } })
  );
}

function sizeSvg(svg: string): string {
  const size = props.width ? props.width : iconSize.value.replace(/px|vw/g, '');
  return svg
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`);
}

watch(() => props.source.Logo, (newLogo) => {
  if (newLogo) {
    fetch(newLogo)
      .then((res) => res.text())
      .then((text) => {
        text = text.replace(/fill:#/g, ``);
        svgContent.value = sizeSvg(text);
      })
      .catch(() => {
        svgContent.value = '';
      });
  }
}, { immediate: true })
</script>
