<template>
  <div class="bordered">
    <v-card v-if="loading" class="mx-4" width="75vw" height="85vh">
      <v-card-text class="text-center">
        <v-progress-circular :size="120" :width="12" color="secondary" indeterminate />
        <p class="heading h3 mt-3">LOADING...</p>
      </v-card-text>
    </v-card>
    <v-card
      v-else-if="changelog && changelog.news"
      height="85vh"
      width="75vw"
      style="overflow-y: scroll; overflow-x: hidden"
    >
      <v-card-title class="heading h2">
        Updated {{ changelog.news.date }}&nbsp;
        <span class="caption">(v{{ changelog.news.version }})</span>
        <v-spacer />
        <span class="heading h3">
          Stable:
          <span class="primary--text">{{ changelog.stable }}</span>
        </span>
        &emsp;
        <span class="heading h3">
          Beta:
          <span class="primary--text">{{ changelog.beta }}</span>
        </span>
      </v-card-title>
      <p class="text-center">
        <span class="title">
          Visit
          <a @click="toUpdate">
            https://massif-press.itch.io/compcon
          </a>
          for update information and desktop apps
        </span>
      </p>
      <v-card-text class="mt-1 pt-1 ml-3 pr-5 body-text" v-html="changelog.news.body" />
      <v-divider class="mt-2 mb-2" />
      <div v-for="(i, idx) in changelog.changelog" :key="idx">
        <v-card-title class="heading h3 mb-1 pb-1">Changelog for: {{ i.version }}</v-card-title>
        <v-card-text class="mt-1 pt-1 ml-3 pr-5 flavor-text" v-html="i.changes" />
        <v-divider class="mt-2 mb-2" />
      </div>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <v-alert :value="true" type="error">Error: Could not communicate with server</v-alert>
        <br />
        <p class="text-center">
          <span class="title">
            Check
            <a @click="toUpdate">https://massif-press.itch.io/compcon for updates</a>
          </span>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Plugins } from '@capacitor/core'
const { Browser } = Plugins

export default Vue.extend({
  name: 'changelog-panel',
  props: {
    changelog: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toUpdate() {
      Browser.open({
        url: 'https://massif-press.itch.io/compcon',
      })
    },
  },
})
</script>
