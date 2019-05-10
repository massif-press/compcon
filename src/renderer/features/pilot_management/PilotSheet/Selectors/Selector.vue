<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3 class="pr-4">
        <v-layout>
          <v-flex class="text-xs-center">
            <span class="minor-title">{{title}}</span>
            <v-divider class="ma-2 ml-4 mr-4" />
          </v-flex>
        </v-layout>
        <slot name="left-column"></slot>
      </v-flex>
      <v-flex xs9>
        <slot name="right-column"></slot>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  
  export default Vue.extend({
    name: 'selector',
    props: {
      title: String
    }
  })
</script>
