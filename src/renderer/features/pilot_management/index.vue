<template>
  <div>
    <top-bar />
    <div class="wrapper">
      <v-fade-transition leave-absolute>
        <router-view />
      </v-fade-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import store from '../../store'
import { mapGetters } from 'vuex'
import { TopBar } from '@/features/_shared/topbar'
import { getModule } from 'vuex-module-decorators';
import { PilotManagementStore } from './store';

export default Vue.extend({
  name: 'pilot_management',
  components: { TopBar },
  created() {
    const pilotStore = getModule(PilotManagementStore, this.$store)
    pilotStore.loadPilots()
  },
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
