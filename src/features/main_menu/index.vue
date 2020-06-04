<template>
  <landing-page-mobile v-if="$vuetify.breakpoint.smAndDown" />
  <landing-page-desktop v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import LandingPageMobile from './mobile.vue'
import LandingPageDesktop from './desktop.vue'
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

export default Vue.extend({
  name: 'landing-page',
  components: {
    LandingPageMobile,
    LandingPageDesktop,
  },
  beforeMount() {
    const ns = getModule(NavStore, this.$store)
    ns.initDarkMode()
    this.$vuetify.theme.dark = ns.DarkMode
  },
})
</script>
