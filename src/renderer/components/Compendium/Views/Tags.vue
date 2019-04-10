<template>
  <v-container>
    <span class="display-1 text-uppercase font-weight-thin">TAGS</span>
    <v-layout v-for="t in tags" :key="t.id">
      <v-flex class="text-xs-center pa-3">
        <v-hover>
          <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 3}`">
            <v-card-title primary-title class="title">{{t.name.replace(/{VAL}/g, 'X')}}</v-card-title>
            <v-card-text class="text-xs-left pt-0"><p class="blockquote ma-0 pa-0" v-html="t.description.replace(/{VAL}/g, '<b>X</b>')" /></v-card-text>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'tags',
    data: () => ({
      tags: [],
    }),
    created() {
      this.tags = this.$store.getters.getItemCollection('Tags')
    },
  })
</script>