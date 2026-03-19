<template>
  <v-tabs v-model="tab"
    class="px-2"
    :class="`tabs ${fixed ? 'fixed' : 'sticky'} ${portrait ? 'portrait' : mobile ? 'mobile' : 'desktop'}`"
    :bg-color="color"
    slider-color="secondary"
    :height="mobile ? '24px' : '32px'"
    density="compact"
    grow
    style="margin-top: -1px"
    :style="modal && 'left: 1px; width: calc(100% - 2px);'">
    <slot name="tabs"
      v-bind="{ setTab }" />
  </v-tabs>
  <div v-if="fixed"
    style="position: fixed; top: 0; left: 0; right: 0; height: 45px"
    :class="`bg-${color}`" />
  <div v-if="fixed"
    :class="mobile ? 'mt-4' : 'mt-6'" />

  <v-window v-model="tab">
    <slot v-bind="{ setTab }" />
  </v-window>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
export default {
  name: 'CcTabs',
  mixins: [useMobile],
  props: {
    color: { type: String, default: 'primary' },
    sliderColor: { type: String, default: 'secondary' },
    fixed: { type: Boolean, default: false },
    modal: { type: Boolean, default: false },
  },
  emits: ['changed'],
  data: () => ({
    tab: 0,
  }),
  watch: {
    tab() {
      this.$emit('changed', this.tab);
    },
  },
  methods: {
    setTab(tab: number) {
      this.tab = tab;
    },
  },
};
</script>

<style scoped>
.tabs {
  z-index: 901;
  height: 32px;
  max-height: 32px;
}

.fixed {
  position: fixed;
  width: 100%;
}

.sticky {
  position: sticky;
}

.portrait {
  top: 28px;
  height: 24px;
  max-height: 24px;
}

.mobile {
  top: 45px;
  height: 24px;
  max-height: 24px;
}

.desktop {
  top: 42px !important;
}
</style>
