<template>
  <v-layout>
    <div
      style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`">
      <cc-button
        :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="showNav = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav" :width="mobile ? 320 : 350">
      <slot name="sidebar" />
    </v-navigation-drawer>
    <v-main
      class="mt-2"
      style="height: calc(100vh - 100px); overflow-y: scroll; overflow-x: hidden">
      <slot />
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: 'CCSidebarLayout',
  props: {
    initialShowNav: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showNav: this.initialShowNav,
    };
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
