<template>
  <card v-for="s in statuses"
    :key="s.Name">
    <div class="caption heading text-center mt-n1 warning-stripes mx-n5 pa-1">
      <v-chip size="x-small"
        variant="outlined"
        class="bg-white">
        <span style="letter-spacing: 4px; font-size: 11px">
          {{ s.StatusType.toLocaleUpperCase() }}
        </span>
      </v-chip>
    </div>
    <v-row style="position: relative; height: 3in"
      align="center"
      justify="center">
      <v-col cols="auto">
        <div v-if="s.Svg"
          v-html-safe="cleanSvg(s.Svg)"
          class="d-inline-block"
          :style="{
            width: s.IconSize(),
            height: s.IconSize(),
            filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
          }" />
        <v-icon v-else
          :icon="s.Icon"
          size="280"
          color="rgba(0,0,0,0.1)"
          style="padding: 0; margin-left: -32px" />
      </v-col>
      <div style="position: absolute; top: 0; left: 0; right: 0"
        class="caption pt-5 pa-3">
        <span v-html-safe="s.Effects" />
      </div>
    </v-row>
    <div style="position: absolute; bottom: 1px; right: 1px">
      <v-icon :icon="s.Icon"
        color="red-darken-2"
        size="40" />
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';
import DOMPurify from 'dompurify';
import card from './components/PrintCard.vue';
function cleanSvg(svg: string) {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
}
const statuses = computed(() => {
  return CompendiumStore().Statuses;
})
</script>

<style scoped>
.warning-stripes {
  background: repeating-linear-gradient(45deg, #bcba60, #bcba60 10px, #46474e 10px, #46474e 20px);
}

.caption {
  font-size: 11px;
}
</style>
