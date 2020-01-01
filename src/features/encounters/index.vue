<template>
  <div class="wrapper">
    <cc-nav encounter />
    <v-fade-transition leave-absolute>
      <router-view />
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CcNav from '@/features/nav/index.vue'

export default Vue.extend({
  name: 'encounter-toolkit',
  components: { CcNav },
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
