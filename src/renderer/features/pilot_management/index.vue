<template>
  <div class="wrapper">
    <cc-nav />
    <v-fade-transition leave-absolute>
      <router-view />
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import store from '../../store'
import { mapGetters } from 'vuex'
import CCNav from '@/features/nav/index.vue'

export default Vue.extend({
  name: 'pilot_management',
  components: { 'cc-nav': CCNav },
  created() {
    this.$store.dispatch('loadPilots')
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
