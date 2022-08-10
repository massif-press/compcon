<template>
  <div>
    <landing-page-mobile v-if="$vuetify.breakpoint.smAndDown" />
    <landing-page-desktop v-else />
    <storage-warning />
    <welcome-message />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LandingPageMobile from './mobile.vue'
import LandingPageDesktop from './desktop.vue'
import WelcomeMessage from './welcome.vue'
import StorageWarning from './_components/StorageWarning.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    LandingPageMobile,
    LandingPageDesktop,
    WelcomeMessage,
    StorageWarning,
  },
})
</script>
