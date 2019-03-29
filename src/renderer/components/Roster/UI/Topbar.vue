<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title class="font-weight-regular">C O M P / C O N&emsp;<span class="grey--text" style="font-size:16px">v{{ ver || '1.0.0' }}</span></v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat :to="'/compendium'">Compendium</v-btn>

        <v-btn @click="aboutModal = true" flat>Options</v-btn>
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

        <v-btn @click="goBack" flat>Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  import HelpPage from './Pages/HelpPage'
  import AboutPage from './Pages/AboutPage'
  import OptionsPage from './Pages/OptionsPage'

export default {
    name: 'topbar',
    components: { HelpPage, AboutPage, OptionsPage },
    data: () => ({
      aboutModal: false,
      helpModal: false,
      optionsModal: false,
      ver: 0
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goBack: function () {
        this.$router.push('/roster')
      }
    },
    created: function () {
      this.ver = process.env.npm_package_version
    }
  }
</script>

<style scoped>
  p {
    margin-left: 8px;
  }
</style>

