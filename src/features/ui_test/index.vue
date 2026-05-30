<template>
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 48px" class="bg-primary" />
  <cc-tabs>
    <template #tabs>
      <v-tab>Buttons</v-tab>
      <v-tab>Inputs</v-tab>
      <v-tab>Panels</v-tab>
      <v-tab>Titles</v-tab>
      <v-tab>Modals</v-tab>
      <v-tab>Chips</v-tab>
      <v-tab>Typography</v-tab>
      <v-tab disabled>Other</v-tab>
    </template>
    <v-container>
      <buttons />
      <inputs />
      <panels />
      <titles />
      <modals />
      <chips />
      <textpage />
      <textpage />
    </v-container>
  </cc-tabs>

  <div class="text-right">
    <router-link to="/">
      <v-btn variant="text" x-large>back</v-btn>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import buttons from './pages/buttons.vue';
import inputs from './pages/inputs.vue';
import panels from './pages/panels.vue';
import titles from './pages/titles.vue';
import modals from './pages/modals.vue';
import chips from './pages/chips.vue';
import textpage from './pages/text.vue';

defineOptions({ name: 'ui-test-new' })

const tab = ref(0)
</script>
