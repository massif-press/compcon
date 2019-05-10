<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs2>
        <div class="sidebar">
          <ul class="menu" v-scroll-spy-active="{class: 'customActive'}" v-scroll-spy-link>
            <li v-for="t in tags" :key="'key_' + t.id" class="minor-title pt-1 pb-1">
              <a>{{t.name.replace(/{VAL}/g, 'X')}}</a>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex shrink>
        <v-divider class="ml-0 mr-5" vertical />
      </v-flex>
      <v-flex xs9>   
        <span class="display-1 text-uppercase font-weight-thin">EQUIPMENT TAGS</span>
        <div v-scroll-spy="{offset: 60, time:0}">
          <div v-for="t in tags" :key="t.id" class="text-xs-center pa-1">
            <v-card flat>
            <v-card-title primary-title class="title">{{t.name.replace(/{VAL}/g, 'X')}}</v-card-title>
            <v-card-text class="text-xs-left pt-0"><p class="blockquote ma-0 pa-0" v-html="t.description.replace(/{VAL}/g, '<b>X</b>')" /></v-card-text>
            </v-card>
          </div>
        </div>
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
      this.tags = this.$store.getters['getItemCollection']('Tags')
    },
  })
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: 60px;
    left: 15px;
    height: 90vh;
    width: 16.6vw;
    overflow-y: scroll;
  }

  .customActive {
    color: #0091EA;
    border-left: 5px solid #178ce6;
    padding-left: 5px;
    transition: all 0.5s;
  }

  .menu {
    display: contents;
  }

  .menu a {
    color:#424242;
  }
</style>
