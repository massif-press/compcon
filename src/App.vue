<template>
  <v-app id="app">
    <!-- <global-confirm ref="confirm" /> -->
    <!-- <global-notifier ref="notifier" /> -->
    <navbar />
    <div style="height: 40px" />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import GlobalConfirm from '@/ui/GlobalConfirm.vue';
import GlobalNotifier from '@/ui/GlobalNotifier.vue';
import Navbar from './features/nav/index.vue';

export default {
  name: 'compcon',
  components: {
    GlobalConfirm,
    GlobalNotifier,
    Navbar,
  },
  mounted() {
    // Vue.prototype.$confirm = (this.$refs.confirm as any).open;
    // Vue.prototype.$notify = (this.$refs.notifier.notify as any).bind(
    //   this.$refs.notifier
    // );
    // // TODO: disable in dev
    // Vue.prototype.$notifyError = (this.$refs.notifier.notifyError as any).bind(
    //   this.$refs.notifier
    // );
  },
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
