<template>
<v-hover>
  <v-card slot-scope="{ hover }" :class="`${config.active ? 'active' : 'inactive'} elevation-${hover ? 12 : 0}`">
    <v-layout row style="cursor: pointer;" @click="toConfigSheet()">
      <v-flex class="ma-0 pb-0 pt-0">
        <v-img v-if="config.custom_img" :src="`file://${userDataPath}/img/frame/${config.custom_img}`" position="top" height="300px"/>
        <v-img v-else :src="getStaticPath(`img/frames/${config.frame_id}.png`)" position="top" height="300px"/>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-card color="rgba(0, 0, 0, .55)" dark flat>
          <v-layout>
            <v-flex xs8 class="ma-2">
              <span class="title">{{config.name}}</span>
              <br>
              <span class="caption">{{frame().source}} {{frame().name}}</span>
            </v-flex>
            <v-flex xs4 class="mt-2 mb-2">
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" disabled @click="toggleActive()"><v-icon>mdi-power</v-icon></v-btn>
                <span>Activate Mech<br>(feature in development)</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="copyDialog = true"><v-icon>mdi-content-duplicate</v-icon></v-btn>
                <span>Duplicate Configuration</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="exportDialog = true"><v-icon>mdi-export-variant</v-icon></v-btn>
                <span>Export Configuration</span>
              </v-tooltip>
              <v-tooltip top>
              <v-btn slot="activator" icon class="ma-0" @click="deleteDialog = true"><v-icon>delete</v-icon></v-btn>
                <span>Delete Configuration</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>

      <v-snackbar v-model="snackbar" :timeout="5000" >
        <span v-html="notification" />
        <v-btn color="pink" flat @click="snackbar = false" > Close </v-btn>
      </v-snackbar>

      <v-dialog v-model="deleteDialog" width="500" >
        <v-card>
          <v-card-text>
            Are you sure you want to delete {{config.name}}? This action cannot be undone
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" flat @click="deleteDialog = false"> Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteConfig"> Delete Configuration </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="exportDialog" width="500" >
        <v-card>
          <v-card-title class="title">Export Configuration &mdash; {{config.name}}</v-card-title>
          <v-card-text>
            <v-btn large block flat color="primary" @click="exportConfig">Save to File</v-btn>
            <br>
            <v-btn large block flat color="primary" @click="copyConfig">Copy Configuration Data to Clipboard</v-btn>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" flat @click="exportDialog = false"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="copyDialog" width="650" >
        <v-card>
          <v-card-title class="title">Duplicate Configuration &mdash; {{config.name}}</v-card-title>
          <v-card-text class="text-xs-center">
              <v-btn large block color="indigo" @click="cloneConfig" dark>Duplicate Configuration</v-btn>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" flat @click="copyDialog = false"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-card>
</v-hover>
</template>

<script>
import io from '@/store/data_io'

export default {
  name: 'config-card',
  props: {
    config: Object,
    cIdx: Number
  },
  data: () => ({
    deleteDialog: false,
    exportDialog: false,
    copyDialog: false,
    notification: '',
    snackbar: false
  }),
  methods: {
    frame: function () {
      return this.$store.getters.getItemById('Frames', this.config.frame_id)
    },
    getStaticPath: function (path) {
      return `static/${path}`
    },
    toggleActive: function () {
      // this.$store.dispatch('loadPilot', this.pilot.id)
      // this.$store.dispatch('editPilot', {
      //   attr: `active`,
      //   val: !this.pilot.active
      // })
    },
    toConfigSheet: function () {
      this.$store.dispatch('loadConfig', this.config.id)
      this.$router.push('./config')
    },
    deleteConfig: function () {
      this.deleteDialog = false
      this.$store.dispatch('deleteConfig', this.config.id)
    },
    cloneConfig: function () {
      this.$store.dispatch('cloneConfig', JSON.parse(JSON.stringify(this.config)))
      this.copyDialog = false
      this.$parent.$forceUpdate()
      this.notification = 'Configuration Duplicated'
      this.snackbar = true
    },
    exportConfig: function () {
      const { dialog } = require('electron').remote
      var path = dialog.showSaveDialog({
        defaultPath: this.config.name.toLowerCase().replace(/\W/g, ''),
        buttonLabel: 'Export Configuration'
      })
      io.saveFile(path + '.json', JSON.stringify(this.config), function (err) {
        if (err) {
          alert(`Error: COMP/CON could not save a file to ${path}`)
        }
      })
      this.exportDialog = false
      this.notification = 'Configuration Exported Successfully'
      this.snackbar = true
    },
    copyConfig: function () {
      const {clipboard} = require('electron')
      clipboard.writeText(JSON.stringify(this.config))
      this.exportDialog = false
      this.notification = 'Configuration Copied to Clipboard'
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
 .active {
   background: linear-gradient(#283593, #424242 80%);
   background-color: #424242;
 }

  .inactive {
   background: linear-gradient(#616161, #424242 80%);
   background-color: #424242;
 }

  .inactive:hover {
   background: linear-gradient(#546E7A, #616161 80%);
   border: 0px
 }
</style>
