<template>
  <v-tabs v-model="tab" class="mt-2" grow bg-color="primary" style="max-height: 50px">
    <v-tab>Buttons</v-tab>
    <v-tab>Inputs</v-tab>
    <v-tab>Modals</v-tab>
    <v-tab>Panels</v-tab>
    <v-tab>Chips</v-tab>
    <v-tab>Titles & Banners</v-tab>
    <v-tab>Typography</v-tab>
    <v-tab>Other</v-tab>
  </v-tabs>
  <v-container>
    <v-window v-model="tab">
      <buttons />
    </v-window>
  </v-container>

  <div class="text-right">
    <router-link to="/">
      <v-btn variant="text" x-large>back</v-btn>
    </router-link>
  </div>
</template>

<script lang="ts">
import buttons from './pages/buttons.vue';

export default {
  name: 'ui-test-new',
  components: {
    buttons,
  },
  data: () => ({
    tab: 0,
  }),
};
</script>
