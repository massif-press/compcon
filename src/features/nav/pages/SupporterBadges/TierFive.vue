<template>
  <v-col cols="12">
    <v-alert prominent left color="amber accent-4">
      <div class="heading h3">
        Firstname Lastname
      </div>
      <v-icon>mdi-web</v-icon>
      www.site.com &emsp; | &emsp;
      <v-icon>mdi-twitter</v-icon>
      @twitter
    </v-alert>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'dev-badge',
})
</script>
