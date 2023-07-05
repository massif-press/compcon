<template>
  <v-app id="app">
    <cc-notify />
    <navbar />
    <div style="height: 40px" />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import CcNotify from '@/ui/notification/CCNotify.vue';
import Navbar from './features/nav/index.vue';

export default {
  name: 'compcon',
  components: {
    CcNotify,
    Navbar,
  },
};
</script>
