<template>
  <landing-page-mobile v-if="$vuetify.breakpoint.smAndDown" />
  <landing-page-desktop v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import LandingPageMobile from './mobile.vue'
import LandingPageDesktop from './desktop.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    LandingPageMobile,
    LandingPageDesktop,
  },
})
</script>
