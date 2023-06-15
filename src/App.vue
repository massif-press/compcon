<template>
  <v-app id="app">
    <cc-notify />
    <global-confirm ref="confirm" />
    <navbar />
    <div style="height: 40px" />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import CcNotify from '@/ui/notification/CCNotify.vue';
import GlobalConfirm from '@/ui/notification/GlobalConfirm.vue';
import Navbar from './features/nav/index.vue';

export default {
  name: 'compcon',
  components: {
    CcNotify,
    GlobalConfirm,
    Navbar,
  },
};
</script>
