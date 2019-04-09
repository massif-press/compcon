<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
        <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(-1)" flat><v-icon>mdi-arrow-left</v-icon></v-btn>
        <span>Click to go back</span>
        </v-tooltip>
        <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(1)" flat><v-icon>mdi-arrow-right</v-icon></v-btn>
        <span>Click to go forward</span>
        </v-tooltip>
        <v-divider vertical class="ml-2"/>
      <v-toolbar-title class="font-weight-light" style="font-size:26px">C O M P / C O N&emsp;<span class="grey--text" style="font-size:16px">{{ ver }}</span></v-toolbar-title>
        <v-divider class="ml-4 mr-4"/>
      <v-toolbar-items>
        <v-btn flat to="roster">Pilot Roster</v-btn>
        <v-btn flat :color="zeroConfigs ? 'info' : ''" to="hangar" :disabled="!hangarActive">Mech Hangar</v-btn>
        <v-btn flat to="compendium">Compendium</v-btn>

        <v-divider vertical class="ml-2 mr-2"/>

        <v-btn @click="optionsModal = true" flat>Options</v-btn>
        <v-dialog v-model="optionsModal" width="80vw">
          <v-card>
            <v-card-title class="title">Options</v-card-title>
            <v-card-text>
              <options-page />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="optionsModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>       

        <v-btn @click="aboutModal = true" flat>About</v-btn>
        <v-dialog v-model="aboutModal" width="80vw">
          <v-card>
            <v-card-title class="title">About COMP/CON</v-card-title>
            <v-card-text>
              <about-page />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="aboutModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>       

        <!-- <v-btn flat disabled>Options</v-btn> -->
        <v-btn @click="helpModal = true" flat >Help</v-btn>
        <v-dialog v-model="helpModal" width="85vw">
          <v-card>
            <v-card-title class="title">Help</v-card-title>
            <v-card-text>
              <help-page />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="helpModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  import HelpPage from './Pages/HelpPage'
  import AboutPage from './Pages/AboutPage'
  import OptionsPage from './Pages/OptionsPage'

export default {
    name: 'top-bar',
    components: { HelpPage, AboutPage, OptionsPage },
    data: () => ({
      aboutModal: false,
      helpModal: false,
      optionsModal: false,
      ver: 0,
      hangarActive: true,
      zeroConfigs: false
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      historyNav: function (dir) {
        this.$router.go(dir)
      }
    },
    created: function () {
      this.ver = process.env.npm_package_version ? `v${process.env.npm_package_version}` : ''
    },
    watch: {
      $route (to, from) {
        window.scrollTo(0, 0)
        this.hangarActive = !(to.path === '/roster' || to.path === '/new')
        var activePilot = this.$store.getters.getPilot
        this.zeroConfigs = activePilot && activePilot.configs && activePilot.configs.length === 0
      }
    }
  }
</script>

<style scoped>
  p {
    margin-left: 8px;
  }

</style>
