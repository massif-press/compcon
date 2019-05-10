<template>
  <div>
    <v-tabs v-model="tabModel" color="blue-grey" dark  slider-color="warning" grow>
      <v-tab ripple >
        Content and Homebrew Packages
      </v-tab>
      <v-tab ripple >
        Other
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <h4>Importing Content</h4>
            <p>
              Compcon can load personal and community created content ("homebrew" content), as well as additional official LANCER modules, by using the button below and selecting the data folder (this must be extracted first -- no .zip files). For additonal information regarding the structure and contents of these packages, where to find more, and how to make your own, please see <a @click="open('https://github.com/jarena3/compcon/wiki/Homebrew-Content')">the  COMP/CON wiki page on the subject</a>
            </p>
            <v-alert icon="error" outline type="warning" :value="true">
              <span class="black--text">Pilots and Configurations that are saved with items from content packages will only work correctly when those packages are activated. If a content package is deactivated or deleted, equipment, attributes, and items from those packages will be shown as "missing content" in COMP/CON until those packages are reactivated, or the items removed.</span> 
            </v-alert>
          </v-card-text>
          <v-btn block @click="importBrew()" color="primary" large>Import Content</v-btn>
          <v-divider class="ma-4" />
          <h2 class="mb-2">Installed Content</h2>
          <v-card v-for="b in brews" :key="b.name" class="pl-2 pr-2">
            <v-layout row>
              <v-flex shrink>
                <v-switch :value="b.info.active" :input-value="b.info.active" :disabled="b.info.name === 'LANCER Core'" @change="toggleBrew(b)"/>
              </v-flex>
              <v-flex xs3 class="mt-2 pt-1 ml-2">
                <span class="title">{{b.info.name}}</span>
                <br>
                 <span class="caption">ver.{{b.info.version}}</span>&nbsp; //&nbsp;<i>{{b.info.author}}</i>
              </v-flex>
              <v-divider vertical class="mr-2 ml-2" />
              <v-flex xs9 class="mt-2 pt-1"><p>{{b.info.description}}</p></v-flex>
              <v-flex shrink class="mt-2 pt-1">
                <v-tooltip top>
                  <v-btn slot="activator" icon color="primary" @click="open(b.info.website)"><v-icon>mdi-open-in-new</v-icon></v-btn>
                  <span>Content Homepage</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-card>
      </v-tab-item>
      <v-tab-item>        
        <v-card flat>
          <v-card-text class="text-xs-center">
            <v-btn large @click="forceReload()" color="primary">Force Data Reload</v-btn>
            <v-btn large @click="forceHardReload()" color="primary">Force Restart</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { remote } from 'electron'
  import {mapGetters} from 'vuex'
  import io from '@/features/_shared/data_io'
  import lancerData from 'lancer-data'

  export default Vue.extend({
    name: 'options-page',
    data: () => ({
      tabModel: 0,
      brews: [] as Brew[]
    }),
    computed: {
      ...mapGetters({
        itemCollection: 'getItemCollection'
      })
    },
    methods: {
      open (link: string) {
        remote.shell.openExternal(link)
      },
      importBrew () {
        const { dialog } = require('electron').remote
        var path = dialog.showOpenDialog({
          title: 'Load Homebrew Folder',
          buttonLabel: 'Load',
          properties: [
            'openDirectory'
          ]
        })
        if (path && path[0]) {
          io.saveBrewData(path[0], (this as any).userDataPath)
          this.$store.dispatch('loadData')
          this.$store.dispatch('loadBrews')
          this.$store.dispatch('buildLicenses')
          this.detectBrews()
        }
      },
      detectBrews () {
        this.brews = [] as Brew[]
        // base game
        var coreData = {info: lancerData.info}
        this.brews.push(coreData as Brew)
        // find all brews
        this.brews = this.brews.concat(this.itemCollection('Brews'))
      },
      toggleBrew (brew: Brew) {
        this.$store.dispatch('setBrewActive', { dir: brew.dir, active: !brew.info.active })
        this.$store.dispatch('loadData')
        this.$store.dispatch('loadBrews')
        this.$store.dispatch('buildLicenses')
        this.detectBrews()
      },
      forceReload () {
        this.$store.dispatch('loadData')
        this.$store.dispatch('loadBrews')
        this.$store.dispatch('buildLicenses')
        this.detectBrews()
      },
      forceHardReload () {
        const remote = require('electron').remote
        remote.app.relaunch()
        remote.app.exit(0)
      }
    },
    created () {
      this.detectBrews()
    }
  })
</script>
