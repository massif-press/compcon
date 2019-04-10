<template>
 <v-flex>
    <v-toolbar class="mb-2" dense v-if="cb.err">
      <span class="subheading grey--text">// MISSING CORE BONUS DATA //</span>
    </v-toolbar>    
    <v-toolbar v-else dense color="grey lighten-2">
      <v-toolbar-title>
        <span>{{cb.name}}&nbsp;</span>
        <span class="caption">{{cb.source}}</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-card class="mb-2" v-if="!cb.err">
      <v-card-title class="pb-0 mb-0 mt-0 pt-2">
        <p class="fluff-text" v-html="cb.description" />
      </v-card-title>
      <v-card-text class="pb-2 mt-0 pt-0">
        <p class="effect-text" v-html="cb.effect" />
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'cb-item',
    props: {
      cb: Object
    }  
  })
</script>