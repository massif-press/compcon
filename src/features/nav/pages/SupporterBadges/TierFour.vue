<template>
  <v-col md="12" lg="6">
    <v-alert prominent dark border="left" color="deep-purple darken-4" icon="mdi-atom-variant">
      <div class="heading h2">
        {{ info.name }}
      </div>
      <div v-if="info.website || info.twitter || info.github" class="mt-1 mb-n3">
        <v-btn v-if="info.website" target="_blank" :href="`${info.website}`" icon>
          <v-icon color="cyan lighten-2">mdi-web</v-icon>
        </v-btn>
        <v-btn
          v-if="info.twitter"
          target="_blank"
          :href="`https://twitter.com/${info.twitter}`"
          icon
          class="mb-n2"
        >
          <v-icon color="cyan lighten-2">mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          v-if="info.github"
          target="_blank"
          :href="`https://github.com/${info.github}`"
          icon
          class="mb-n2"
        >
          <v-icon color="cyan lighten-2">mdi-github-circle</v-icon>
        </v-btn>
      </div>
    </v-alert>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 't4-badge',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
})
</script>
