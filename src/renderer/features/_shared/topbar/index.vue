<template>
  <v-container fluid>
    <v-toolbar dense style="z-index:10" fixed>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(-1)" flat>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Click to go back</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(1)" flat>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <span>Click to go forward</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="home()" flat>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <span>Return to the Main Menu</span>
      </v-tooltip>
      <v-divider vertical class="ml-2" />
      <v-toolbar-title class="font-weight-light" style="font-size:26px">
        C O M P / C O N&emsp;
        <span class="grey--text" style="font-size:16px">{{ ver }}</span>
      </v-toolbar-title>
      <v-divider class="ml-4 mr-4" />
      <v-toolbar-items>
        <v-btn flat to="/pilot_management">Pilot Roster</v-btn>
        <v-btn
          flat
          :color="zeroConfigs ? 'info' : ''"
          to="/hangar"
          :disabled="!hangarActive"
        >
          Mech Hangar
        </v-btn>
        <v-btn flat to="/compendium">Compendium</v-btn>

        <v-divider vertical class="ml-2 mr-2" />

        <v-btn @click="optionsModal = true" flat>Options</v-btn>
        <v-dialog v-model="optionsModal" width="80vw" scrollable>
          <v-card>
            <v-toolbar
              absolute
              class="primary white--text"
              style="position: sticky"
            >
              <v-toolbar-title>Options</v-toolbar-title>
              <v-btn
                flat
                icon
                color="white"
                class="ml-auto"
                @click="optionsModal = false"
              >
                <v-icon dark>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="px-4">
              <options-page />
            </v-card-text>
            <v-divider />
          </v-card>
        </v-dialog>

        <v-btn @click="aboutModal = true" flat>About</v-btn>
        <v-dialog v-model="aboutModal" width="80vw">
          <v-card>
            <v-toolbar
              absolute
              class="primary white--text"
              style="position: sticky"
            >
              <v-toolbar-title>About COMP/CON</v-toolbar-title>
              <v-btn
                flat
                icon
                color="white"
                class="ml-auto"
                @click="aboutModal = false"
              >
                <v-icon dark>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="px-4">
              <about-page />
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-btn @click="helpModal = true" flat>Help</v-btn>
        <v-dialog v-model="helpModal" width="85vw">
          <v-card>
            <v-toolbar
              absolute
              class="primary white--text"
              style="position: sticky"
            >
              <v-toolbar-title>Help</v-toolbar-title>
              <v-btn
                flat
                icon
                color="white"
                class="ml-auto"
                @click="helpModal = false"
              >
                <v-icon dark>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="px-4">
              <help-page />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" flat @click="helpModal = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar-items>
    </v-toolbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import HelpPage from './Pages/HelpPage.vue'
import AboutPage from './Pages/AboutPage.vue'
import OptionsPage from './Pages/OptionsPage.vue'
import { Route } from 'vue-router'

export default Vue.extend({
  name: 'top-bar',
  components: { HelpPage, AboutPage, OptionsPage },
  data: () => ({
    aboutModal: false,
    helpModal: false,
    optionsModal: false,
    ver: 0,
    hangarActive: false,
    zeroConfigs: false,
  }),
  methods: {
    home: function() {
      this.$router.push('/')
    },
    historyNav: function(dir: number) {
      this.$router.go(dir)
    },
  },
  created() {
    const vm = this as any
    vm.ver = process.env.npm_package_version
      ? `v${process.env.npm_package_version}`
      : `v${vm.version}`
    this.hangarActive = !!this.$store.getters.getPilot.Name
  },
  watch: {
    $route(to: Route, from: Route) {
      window.scrollTo(0, 0)
      const activePilot = this.$store.getters.getPilot
      this.hangarActive = !(
        to.path === '/pilot_management' || to.path === '/new'
      )
      if (!this.$store.getters.getPilot.Name) this.hangarActive = false
      this.zeroConfigs =
        activePilot && activePilot.Configs && activePilot.Configs.length === 0
    },
  },
})
</script>

<style scoped>
p {
  margin-left: 8px;
}
</style>
