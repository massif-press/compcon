<template>
  <div>
    <div class="ma-3">
      <v-fade-transition leave-absolute>
        <router-view />
      </v-fade-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'pilot-management',
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
