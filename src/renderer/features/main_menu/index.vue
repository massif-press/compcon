<template>
  <div id="wrapper">
    <v-container fluid class="mb-0 pb-0">
      <v-layout>
        <v-flex>
          <span class="display-3">COMP/CON</span>
          &emsp;
          <span class="minor-title">
            v.{{ ver }} // LANCER Core {{ lancerVer }}
          </span>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <h3 class="display-1 grey--text">
            &emsp; A digital toolset for the LANCER TTRPG
          </h3>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout style="height: 100%" align-v="center" class="mt-0 pt-0">
        <v-flex>
          <v-btn block color="primary" large to="/pilot_management">
            Pilot Roster
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn block color="primary" large to="/compendium">COMPENDIUM</v-btn>
        </v-flex>
        <v-flex>
          <v-tooltip bottom>
            <v-btn slot="activator" block large :to="'/gm'" disabled>
              GM Toolkit
            </v-btn>
            <span>WIP</span>
          </v-tooltip>
        </v-flex>
        <v-flex>
          <v-btn slot="activator" block large :to="'/mods'" disabled>
            Homebrew Editor
          </v-btn>
        </v-flex>
      </v-layout>

      <v-divider class="ma-2" />

      <v-layout>
        <v-flex>
          <v-card v-if="loading">
            <v-card-text class="text-xs-center">
              <v-progress-circular
                :size="120"
                :width="12"
                color="primary"
                indeterminate
              />
              <p class="minor-title mt-3">LOADING...</p>
            </v-card-text>
          </v-card>
          <v-card
            v-else-if="changelog && changelog.news"
            height="65vh"
            style="overflow-y: scroll; overflow-x: hidden"
          >
            <v-card-title class="major-title">
              Updated {{ changelog.news.date }}&nbsp;
              <span class="caption">(v{{ changelog.news.version }})</span>
              <v-spacer />
              <span class="minor title">
                Stable:
                <span class="primary--text">{{ changelog.stable }}</span>
              </span>
              &emsp;
              <span class="minor title">
                Beta:
                <span class="primary--text">{{ changelog.beta }}</span>
              </span>
            </v-card-title>
            <div
              v-if="ver !== changelog.beta && ver !== changelog.stable"
              class="ma-0 ml-5 mr-5"
            >
              <v-btn block large color="warning" @click="toUpdate">
                Update COMP/CON
              </v-btn>
            </div>
            <v-card-text
              class="mt-1 pt-1 ml-3 pr-5"
              v-html="changelog.news.body"
            />
            <v-divider class="mt-2 mb-2" />
            <div v-for="(i, idx) in changelog.changelog" :key="idx">
              <v-card-title class="minor-title mb-1 pb-1">
                Changelog for: {{ i.version }}
              </v-card-title>
              <v-card-text class="mt-1 pt-1 ml-3 pr-5" v-html="i.changes" />
              <v-divider class="mt-2 mb-2" />
            </div>
          </v-card>
          <v-card v-else>
            <v-card-text>
              <v-alert :value="true" type="error">
                Error: Could not communicate with server
              </v-alert>
              <br />
              <p class="text-xs-center">
                <span class="title">
                  Check
                  <a @click="toUpdate">
                    https://massif-press.itch.io/compcon for updates
                  </a>
                </span>
              </p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- <v-footer fixed>
      <span href="#">&emsp;v. {{ ver }}</span>
      <v-spacer/>
      <v-btn flat small disabled>About</v-btn>
      <v-btn flat small disabled>Help</v-btn>
      <v-btn color="warning" small disabled>Support This Project</v-btn>
    </v-footer> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '../pilot_management/logic/apis'
import { remote } from 'electron'
import { info } from 'lancer-data'

export default Vue.extend({
  name: 'landing-page',
  data: () => ({
    ver: '1.3.7',
    changelog: {},
    err: false,
    loading: true,
    lancerVer: info.version,
  }),
  methods: {
    toUpdate() {
      remote.shell.openExternal('https://massif-press.itch.io/compcon')
    },
  },
  created: function() {
    if (Vue.prototype.version) this.ver = Vue.prototype.version
    apis
      .getChangelog()
      .then((response: any) => {
        this.loading = false
        if (!response || !response.files) {
          this.err = true
        } else {
          this.err = false
          this.changelog = JSON.parse(response.files['changelog.json'].content)
        }
      })
      .catch(() => {
        this.loading = false
        this.err = true
      })
    this.$store.dispatch('setDatapath', Vue.prototype.userDataPath)
    this.$store.dispatch('loadData')
    this.$store.dispatch('buildLicenses')
  },
})
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;

  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
}
</style>

<style>
body {
  overflow: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
</style>
