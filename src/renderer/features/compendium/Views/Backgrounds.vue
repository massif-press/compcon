<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs2>
        <div class="sidebar">
          <ul
            class="menu"
            v-scroll-spy-active="{ class: 'customActive' }"
            v-scroll-spy-link
          >
            <li
              v-for="b in backgrounds"
              :key="'key_' + b.ID"
              class="minor-title pt-1 pb-1"
            >
              <a>{{ b.Name }}</a>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex shrink>
        <v-divider class="ml-0 mr-5" vertical />
      </v-flex>
      <v-flex xs9>
        <span class="display-1 text-uppercase font-weight-thin">
          PILOT BACKGROUNDS
        </span>
        <div v-scroll-spy="{ offset: 60, time: 0 }">
          <div
            v-for="b in backgrounds"
            :key="`summary_block_m${b.ID}`"
            class="mt-3"
          >
            <v-card flat>
              <v-toolbar-title dense flat color="grey lighten-3">
                <span class="title text-uppercase font-weight-light">
                  {{ b.Name.toUpperCase() }}
                </span>
              </v-toolbar-title>
              <v-card-text class="pb-1 mt-0 pt-0">
                <p class="effect-text pb-0" v-html="b.description" />
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Background } from '@/class'

export default Vue.extend({
  name: 'backgrounds',
  data: () => ({
    backgrounds: [],
    section: 0,
  }),
  created() {
    var vm = this as any
    vm.backgrounds = vm.$store.getters.getItemCollection('Backgrounds')
  },
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 60px;
  left: 15px;
  width: 16.6vw;
  height: 90vh;
  overflow-y: scroll;
}

.customActive {
  color: #0091ea;
  border-left: 5px solid #178ce6;
  padding-left: 5px;
  transition: all 0.5s;
}

.menu {
  display: contents;
}

.menu a {
  color: #424242;
}
</style>
