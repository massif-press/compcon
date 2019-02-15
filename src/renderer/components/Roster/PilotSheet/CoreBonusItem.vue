<template>
  <v-layout>
    <v-flex>
      <v-flex>
        <v-toolbar>
          <v-toolbar-title>{{cb.name}}&nbsp;<span class="caption">{{cb.source}}</span></v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-title class="pb-0">
            <em v-html="cb.description" />
          </v-card-title>
          <v-card-text>
            <p v-html="cb.effect" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'cb-item',
    props: [
      'cb'
    ]
  }
</script>