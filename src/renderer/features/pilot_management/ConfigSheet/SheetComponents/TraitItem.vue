<template>
  <v-layout>
    <v-flex class="ml-4 mr-4 mt-1 mb-1">
      <v-card dark>
        <v-card-title class="title pb-0">{{trait.name}}</v-card-title>
        <v-card-text class="pt-2 pb-2 m-2 pr-5">{{ trait.description }}</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'trait-item',
    props: {
      trait: Object
    }
  })
</script>
