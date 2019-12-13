<template>
  <div class="wrapper">
    <cc-nav pilot-management />
    <v-fade-transition leave-absolute>
      <router-view />
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CCNav from '@/features/nav/index.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from './store'

export default Vue.extend({
  name: 'pilot-management',
  components: { 'cc-nav': CCNav },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

.wrapper {
  display: flex;
  width: 100%;
}
</style>
