<template>
  <div>
    <cc-nav pilot-management />
    <div class="ma-3">
      <v-fade-transition leave-absolute>
        <router-view />
      </v-fade-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CCNav from '@/features/nav/index.vue'

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
</style>
