<template>
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 48px" class="bg-primary" />
  <v-tabs v-model="tab" class="mt-2" grow bg-color="primary" style="max-height: 50px">
    <v-tab>Buttons</v-tab>
    <v-tab>Inputs</v-tab>
    <v-tab>Panels</v-tab>
    <v-tab>Titles</v-tab>
    <v-tab disabled>Chips</v-tab>
    <v-tab disabled>Typography</v-tab>
    <v-tab disabled>Modals</v-tab>
    <v-tab disabled>Other</v-tab>
  </v-tabs>
  <v-container>
    <v-window v-model="tab">
      <buttons />
      <inputs />
      <panels />
      <titles />
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
import inputs from './pages/inputs.vue';
import panels from './pages/panels.vue';
import titles from './pages/titles.vue';

export default {
  name: 'ui-test-new',
  components: {
    buttons,
    inputs,
    panels,
    titles,
  },
  data: () => ({
    tab: 0,
  }),
};
</script>
