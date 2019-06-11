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
              v-for="s in statuses.Status"
              :key="'key_' + s.name"
              class="effect-text text-uppercase pt-1 pb-1"
            >
              <a>{{ s.name }}</a>
            </li>
            <li
              v-for="s in statuses.Condition"
              :key="'key_' + s.name"
              class="effect-text text-uppercase pt-1 pb-1"
            >
              <a>{{ s.name }}</a>
            </li>
          </ul>
        </div>
      </v-flex>
      <v-flex shrink>
        <v-divider class="ml-0 mr-5" vertical />
      </v-flex>
      <v-flex xs9>
        <span class="display-1 text-uppercase font-weight-thin">
          STATUSES AND CONDITIONS
        </span>
        <br />
        <br />
        <div v-scroll-spy="{ offset: 60, time: 0 }">
          <span class="major-title">Statuses</span>
          <div
            v-for="s in statuses.Status"
            :key="s.name"
            class="text-xs-center pa-1"
          >
            <v-card flat>
              <v-card-title
                primary-title
                class="title text-uppercase font-weight-light"
              >
                {{ s.name }}
              </v-card-title>
              <v-card-text class="text-xs-left pt-0">
                <ul>
                  <li
                    v-for="e in s.effects"
                    :key="e"
                    class="blockquote ma-0 pa-0"
                  >
                    {{ e }}
                  </li>
                </ul>
              </v-card-text>
            </v-card>
          </div>
          <v-divider class="ma-3" />
          <span class="major-title">Conditions</span>
          <div
            v-for="s in statuses.Condition"
            :key="s.name"
            class="text-xs-center pa-1"
          >
            <v-card flat>
              <v-card-title
                primary-title
                class="title text-uppercase font-weight-light"
              >
                {{ s.name }}
              </v-card-title>
              <v-card-text class="text-xs-left pt-0">
                <ul>
                  <li
                    v-for="e in s.effects"
                    :key="e"
                    class="blockquote ma-0 pa-0"
                  >
                    {{ e }}
                  </li>
                </ul>
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

export default Vue.extend({
  name: 'statuses',
  data: () => ({
    statuses: [],
    section: 0,
  }),
  created() {
    this.statuses = _.groupBy(
      this.$store.getters.getItemCollection('Statuses'),
      'type'
    )
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
