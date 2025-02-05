<template>
  <div>
    <landing-page-mobile v-if="$vuetify.display.mdAndDown" />
    <landing-page-desktop v-else />
    <welcome-message />
    <storage-warning />
    <router-view />
  </div>
</template>

<script lang="ts">
import LandingPageMobile from './mobile.vue';
import LandingPageDesktop from './desktop.vue';
import WelcomeMessage from './welcome.vue';
import StorageWarning from './_components/StorageWarning.vue';

export default {
  name: 'landing-page',
  components: {
    LandingPageMobile,
    LandingPageDesktop,
    WelcomeMessage,
    StorageWarning,
  },
};
</script>
