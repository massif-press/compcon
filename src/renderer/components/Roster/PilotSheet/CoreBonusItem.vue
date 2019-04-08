<template>
 <v-flex>
    <v-toolbar class="mb-2" v-if="cb.err">
      <span class="subheading grey--text">// MISSING CORE BONUS DATA //</span>
    </v-toolbar>    
    <v-toolbar v-else>
      <v-toolbar-title>{{cb.name}}&nbsp;<span class="caption">{{cb.source}}</span></v-toolbar-title>
    </v-toolbar>
    <v-card class="mb-2" v-if="!cb.err">
      <v-card-title class="pb-0">
        <em v-html="cb.description" />
      </v-card-title>
      <v-card-text>
        <p v-html="cb.effect" />
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'cb-item',
    props: {
      cb: Object
    }
  }
</script>