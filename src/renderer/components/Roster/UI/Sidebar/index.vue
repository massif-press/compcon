<template>
  <v-navigation-drawer :mini-variant.sync="mini" stateless touchless :value="isVisible" dark fixed class="pt-5" disable-route-watcher v-click-outside="minimize">
    <v-toolbar flat class="transparent pt-2">
      <v-list>

        <v-list-tile v-if="!mini" class="ma-0 pa-0">
          <v-list-tile-title class="title ">Pilots</v-list-tile-title>
        </v-list-tile>

        <!-- <v-list class="mt-0 pt-0"> -->
            <sidebar-item v-for="(pilot, index) in pilots" :key="pilot.title" @click.stop="mini = !mini" :isMini="mini" :pilot="pilot" @set-active="setActivePilot(pilot, index)" @set-config="setActiveConfig" />
        <!-- </v-list> -->

        <div>
        <v-divider />
        <v-dialog v-model="addDialog" width="500" >
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon large dark>add</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title class="title">Add Pilot</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title >
              Add New Pilot
            </v-card-title>

            <v-card-text>
              <v-btn block large color="primary" @click="goToNew">Create New Pilot</v-btn>
              <v-divider />
              <v-btn block flat color="primary" @click="importFile">Import from File</v-btn>
              <v-btn block flat color="primary" @click="importSheet">Import from GSheet</v-btn>
              <v-btn block flat color="primary" @click="importClipboard">Import from Clipboard</v-btn>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="addDialog = false" >Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </div>
      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import SidebarItem from './SidebarItem'
import io from '@/store/data_io'
import validator from '@/logic/validator'
import { loadSheetFile, gsheetToObject } from '@/logic/gsheet-converter'

export default {
  name: 'sidebar',
  components: { SidebarItem },
  data: () => ({
    mini: true,
    isVisible: true,
    activeIndex: null,
    addDialog: false
  }),
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  },
  methods: {
    setActivePilot (pilot, index) {
      this.activeIndex = index
      // TODO: async load with overlay
      this.$store.dispatch('loadPilot', pilot.id)
      this.$router.push('/roster')
    },
    setActiveConfig (config) {
      // TODO: async load with overlay
      this.$store.dispatch('loadConfig', config)
      this.$router.push('/config')
    },
    item: function (type, id) {
      return this.$store.getters.getItemById(type, id)
    },
    goToNew () {
      this.$router.push('/new')
    },
    importFile () {
      const { dialog } = require('electron').remote
      var path = dialog.showOpenDialog({
        title: 'Load Pilot Data',
        buttonLabel: 'Load',
        properties: [
          'openFile'
        ],
        filters: [
          { name: 'Pilot Data', extensions: ['json'] }
        ]
      })
      var pilotData = io.importFile(path[0])
      if (validator.pilot(pilotData)) {
        this.$store.dispatch('importPilot', pilotData)
        this.$store.dispatch('loadPilot', pilotData.id)
        this.activeIndex = this.pilots.length - 1
        this.addDialog = false
      } else {
        alert('Pilot data validation failed')
        this.addDialog = false
      }
    },
    importSheet () {
      const { dialog } = require('electron').remote
      var path = dialog.showOpenDialog({
        title: 'Load Character GSheet',
        buttonLabel: 'Load',
        properties: [
          'openFile'
        ],
        filters: [
          { name: 'Pilot Data', extensions: ['xlsx'] }
        ]
      })
      const { output } = gsheetToObject(loadSheetFile(path[0]))
      if (validator.pilot(output)) {
        this.$store.dispatch('importPilot', output)
        this.$store.dispatch('loadPilot', output.id)
        this.activeIndex = this.pilots.length - 1
        this.addDialog = false
      } else {
        alert('Pilot data validation failed')
        this.addDialog = false
      }
    },
    importClipboard () {
      var vm = this
      const {clipboard} = require('electron')
      validator.clipboardPilot(clipboard.readText(), function (err, result) {
        if (err) {
          alert(err)
        } else {
          vm.$store.dispatch('importPilot', result)
          vm.$store.dispatch('loadPilot', result.id)
          vm.activeIndex = vm.pilots.length - 1
        }
      })
      this.addDialog = false
    },
    minimize () {
      setTimeout(() => {
        this.mini = true
      }, 5)
    },
    toggle () {
      this.mini = !this.mini
    }
  }
}
</script>