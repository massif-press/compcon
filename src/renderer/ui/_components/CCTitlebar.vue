<template>
  <v-toolbar color="primary" class="clipped-large">
    <v-toolbar-title class="heading h2 white--text">
      <slot></slot>
    </v-toolbar-title>
    <v-toolbar-items>
      <slot name="items"></slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-titlebar',
})
</script>

<style scoped>
.clipped-large {
  clip-path: polygon(100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 0);
}
</style>

