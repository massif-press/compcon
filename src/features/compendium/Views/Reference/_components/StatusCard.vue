<template>
  <v-card class="parent cc-panel-clip"
    flat
    tile
    border>
    <v-toolbar flat
      density="compact"
      color="primary"
      class="ma-0 pa-0">
      <div class="mt-n1 px-2 pt-2 pb-1">
        <div class="heading h3">
          <div v-if="status?.Svg"
            v-html-safe="cleanSvg(status.Svg)"
            class="d-inline-block"
            :style="{
              width: status.IconSize(),
              height: status.IconSize(),
              filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
            }" />
          <v-icon v-else
            :icon="status?.Icon"
            start
            class="mt-n1" />
          <span v-text="status?.Name" />
        </div>
      </div>
      <v-spacer />
    </v-toolbar>
    <v-card-text class="py-2 px-4">
      <p v-text="status?.Terse"
        class="text-center font-weight-bold body-text" />
      <v-divider class="my-1" />
      <p v-html-safe="status?.Effects" />
    </v-card-text>
    <div class="clip-fix" />
  </v-card>
</template>

<script setup lang="ts">
import type { Status } from '@/classes/Status'
import DOMPurify from 'dompurify';

defineOptions({ name: 'cc-panel' })
function cleanSvg(svg: string) {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
}
const props = defineProps<{
  status?: Status
}>()
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}

.clip-fix {
  position: absolute;
  width: 38px;
  height: 2px;
  background-color: rgba(126, 126, 126, 0.3);
  transform-origin: 10 0;
  bottom: 8px;
  right: -6px;
  transform: rotate(-45deg);
}

.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}
</style>
