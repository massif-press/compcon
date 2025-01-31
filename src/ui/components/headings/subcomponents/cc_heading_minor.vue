<template>
  <v-card :class="[paddingClass, clipClass]" :color="filled ? color : 'transparent'" flat tile>
    <v-row dense align="center" :class="!filled && `text-${color}`">
      <v-col v-if="isLine" cols="auto" style="width: 2.5vw; min-width: 20px"><v-divider /></v-col>
      <v-col cols="auto">
        <div class="text-overline" :style="`${compact ? 'line-height: 1.2' : ''}`">
          <slot />
        </div>
      </v-col>
      <v-col v-if="isLine"><v-divider /></v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: '' },
    density: { type: String, default: '' },
    line: { type: Boolean, default: false },
    filled: { type: Boolean, default: false },
  },
  computed: {
    compact() {
      return this.density === 'compact';
    },
    isLine() {
      return this.line && !this.filled;
    },
    paddingClass() {
      let classes = '';
      switch (this.density) {
        case 'compact':
          classes += '';
        case 'normal':
        case 'default':
          classes += 'py-1';
        case 'comfortable':
          classes += 'py-2';
        default:
          classes += '';
      }
      if (!this.line) {
        classes += ' px-2';
      }
      return classes;
    },
    clipClass() {
      if (this.line) return '';
      switch (this.density) {
        case 'compact':
          return 'cc-panel-slice';
        case 'comfortable':
          return 'cc-panel-clip-comfortable';
        default:
          return 'cc-panel-clip';
      }
    },
  },
};
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%);
}

.cc-panel-slice {
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, calc(100% - 24px) 100%, 0% 100%);

  /* clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), 0% calc(100% - 24px)); */
}

.cc-panel-clip-comfortable {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}
</style>
