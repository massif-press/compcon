<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title class="font-weight-regular">C O M P / C O N&emsp;<span class="grey--text" style="font-size:16px">v{{ versionNumber }}</span></v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat disabled>Compendium</v-btn>

        <v-btn @click="aboutModal = true" flat>About</v-btn>
        <v-dialog v-model="aboutModal" width="80vw">
          <v-card>
            <v-card-title class="title">About COMP/CON</v-card-title>
            <v-card-text>
              <h2>COMP/CON</h2>
              <p>A digital toolkit for 
                <a flat color="primary" class="ma-0 pa-1" @click="open('https://massif-press.itch.io/lancer-core-book')">Massif Press' LANCER Tabletop RPG.</a>
              </p>
              <p>More information about LANCER can be found at The official 
                <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/Lancer_RPG')">LANCER Twitter</a>, 
                the <a flat color="primary" class="ma-0 pa-1" @click="open('https://www.reddit.com/r/LancerRPG/')">LANCER subreddit</a>, 
                and the <a flat color="primary" class="ma-0 pa-1" @click="open('https://discord.gg/hQyBzmK')">LANCER Discord Server</a>.
              <br>
              <p>This is a piece of open source software under the GNU Public License — feel free to contribute via the GitHub repository or yell at me directly on Twitter at <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/jarena2')">@jarena2</a>. COMP/CON is now and will always be free, but if you want to support development of this software monetarily, please consider paying (what you want) for it.</p>
              <br>
              <p class="text-xs-center"><v-btn flat outline color="primary" @click="open('https://twitter.com/jarena2')">Project Roadmap</v-btn> &emsp;&mdash;&emsp;
              <v-btn flat color="primary" outline @click="open('https://twitter.com/jarena2')">Contributor's Guide</v-btn> &emsp;&mdash;&emsp;
              <v-btn flat color="primary" outline @click="open('https://beeftime.itch.io/compcon')">itch.io page</v-btn>
              </p>
              <br>
              <h2>Thanks</h2>
              <p><a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/hellwife0')">Ari</a> for contributing the time and code to help track down bugs and bad compendium data<br>
              As well as everyone who helped by submitting a bug report or alerting me of an issue on the Discord.</p>
              <h2>Attributions</h2>

              <p>The frame name generator contains many names lifted from the <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/cultureshipname')">Culture Ship Name Twitter account</a><br>

              <p>This project was generated with <a flat color="primary" class="ma-0 pa-1" @click="open('https://github.com/SimulatedGREG/electron-vue')">electron-vue</a>using vue-cli.</p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="aboutModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>       

        <!-- <v-btn flat disabled>Options</v-btn> -->
        <v-btn @click="helpModal = true" flat>Help</v-btn>
        <v-dialog v-model="helpModal" width="75vw">
          <v-card>
            <v-card-title class="title">Help</v-card-title>
            <v-card-text>
              <h1>Overview</h1>
              <p>
                
              </p>
              <h1>Pilots</h1>
              <h1>Configurations (Mechs)</h1>
              <h1>Misc.</h1>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="helpModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>        

        <v-btn @click="goBack" flat>Back</v-btn>
        <!-- <v-btn @click="goBack" flat>Main Menu</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    data: () => ({
      aboutModal: false,
      helpModal: false
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goBack: function () {
        this.$router.push('/roster')
      }
    }
  }
</script>

<style scoped>
  p {
    margin-left: 8px;
  }
</style>

