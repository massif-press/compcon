<template>
  <v-tabs
    v-model="tab"
    :bg-color="color"
    slider-color="secondary"
    :height="mobile ? '24' : '32'"
    density="compact"
    style="position: sticky; top: 28px; z-index: 10"
    :style="!mobile ? { top: '40px!important' } : {}">
    <slot name="tabs" />
  </v-tabs>
  <v-window v-model="tab">
    <slot />
  </v-window>
</template>

<script lang="ts">
export default {
  name: 'cc-tabs',
  props: {
    color: { type: String, default: 'primary' },
    sliderColor: { type: String, default: 'secondary' },
    modal: { type: Boolean, default: false },
  },

  data: () => ({
    tab: 0,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
