<template>
  <v-col cols="4">
    <v-alert prominent dense color="deep-purple">
      <div class="heading h3">
        Firstname Lastname
      </div>
      <v-icon>mdi-web</v-icon>
      &emsp; | &emsp;
      <v-icon>mdi-twitter</v-icon>
    </v-alert>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'dev-badge',
})
</script>
