<template>
  <v-tabs
    v-model="tab"
    :class="`tabs ${fixed ? 'fixed' : 'sticky'} ${mobile ? 'mobile' : 'desktop'}`"
    :bg-color="color"
    slider-color="secondary"
    :height="mobile ? '24px' : '32px'"
    density="compact"
    grow
    :style="modal && 'left: 1px; width: calc(100% - 2px);'">
    <slot name="tabs" v-bind="{ setTab }" />
  </v-tabs>
  <div
    v-if="fixed"
    style="position: absolute; top: 0; left: 0; right: 0; height: 45px"
    :class="`bg-${color}`" />
  <div v-if="fixed" :class="mobile ? 'mt-4' : 'mt-6'" />

  <v-window v-model="tab" v-bind="{ setTab }">
    <slot />
  </v-window>
</template>

<script lang="ts">
export default {
  name: 'cc-tabs',
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
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
  z-index: 10;
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

.mobile {
  top: 28px;
  height: 24px;
  max-height: 24px;
}

.desktop {
  top: 42px !important;
}
</style>
