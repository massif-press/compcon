<template>
  <v-row dense align="center">
    <v-col v-if="line" cols="auto" style="width: 2.5vw; min-width: 20px"><v-divider /></v-col>
    <v-col cols="auto">
      <div class="text-overline" :style="`${compact ? 'line-height: 1.2' : ''}`"><slot /></div>
    </v-col>
    <v-col v-if="line"><v-divider /></v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    density: { type: String, default: '' },
    line: { type: Boolean, default: false },
  },
  computed: {
    compact() {
      return this.density === 'compact';
    },
  },
};
</script>
