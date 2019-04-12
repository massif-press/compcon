<template>
<v-hover>
  <v-card slot-scope="{ hover }" :class="`${pilot.active ? 'active' : 'inactive'} elevation-${hover ? 12 : 0}`">
    <v-layout row style="cursor: pointer;" @click="toPilotSheet()">
      <v-flex v-if="pilot.portrait" class="ma-0 pb-0 pt-0">
        <v-img :src="`file://${userDataPath}/img/portrait/${pilot.portrait}`" position="top" :height="`${cardHeight}px`"/>
      </v-flex>
      <v-flex v-else class="ma-0 pb-0 pt-0 text-xs-center">
        <div :style="`height: ${cardHeight}px; display:table; width:100%`">
          <span class="pilot-letter white--text">{{pilot.callsign.substring(0, 1).toUpperCase()}}</span>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-card :color="`rgba(0, 0, 0, ${overlayOpacity})`" dark flat>
          <v-layout>
            <v-flex xs8 class="ma-2">
              <span class="title">{{pilot.callsign}}</span>
              <br>
              <span class="caption">{{pilot.name}}<br>{{background(pilot)}}, LL{{pilot.level}}</span>
            </v-flex>
            <v-spacer />
            <v-flex class="mt-2 mb-2 mr-1 text-xs-right">
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" disabled @click="toggleActive()"><v-icon>mdi-power</v-icon></v-btn>
                <span>Activate Pilot<br>(feature in development)</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="exportDialog = true"><v-icon>mdi-export-variant</v-icon></v-btn>
                <span>Export Pilot</span>
              </v-tooltip>              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="copyDialog = true"><v-icon>mdi-content-duplicate</v-icon></v-btn>
                <span>Clone Pilot</span>
              </v-tooltip>
              <v-tooltip top>
              <v-btn slot="activator" icon class="ma-0" @click="printDialog = true"><v-icon>print</v-icon></v-btn>
                <span>Print Pilot Sheet</span>
              </v-tooltip>
              <v-tooltip top>
              <v-btn slot="activator" icon class="ma-0" @click="deleteDialog = true"><v-icon>delete</v-icon></v-btn>
                <span>Delete Pilot</span>
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
            Are you sure you want to delete {{pilot.callsign}}? This action cannot be undone
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" flat @click="deleteDialog = false"> Cancel </v-btn>
            <v-spacer />
            <v-btn color="error" @click="deletePilot"> Delete Pilot </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="exportDialog" width="500" >
        <v-card>
          <v-card-title class="title">Export Pilot &mdash; {{pilot.callsign}}</v-card-title>
          <v-card-text>
            <v-btn large block flat color="primary" @click="exportPilot">Save to File</v-btn>
            <br>
            <v-btn large block flat color="primary" @click="copyPilot">Copy Pilot Data to Clipboard</v-btn>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" flat @click="exportDialog = false"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="copyDialog" width="650" >
        <v-card>
          <v-card-title class="title">Clone Pilot &mdash; {{pilot.callsign}}</v-card-title>
          <v-card-text class="text-xs-center">
              <v-btn large block color="indigo" @click="clonePilot()" dark>Duplicate Pilot</v-btn>
              <span>Copy Pilot data into a new Pilot, without generating a <b>Quirk</b></span>
            <v-divider class="ma-4"/>
              <v-btn large block color="indigo" dark @click="clonePilot(true)">Flash Clone Pilot</v-btn>
              <span>Flash Clones this Pilot, and generates a <b>Quirk</b> &mdash; a complication resulting from the cloning process
              <br>
              <i>(Quirks can be edited or removed on the Pilot Sheet)</i></span>
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

<script lang="ts">
  import Vue from 'vue'
  import io from '@/store/data_io'

  export default Vue.extend({
  name: 'pilot-card',
  props: {
    pilot: Object,
    pIdx: Number,
    cardHeight: Number,
  },
  data: () => ({
    overlayOpacity: 0.55,
    deleteDialog: false,
    printDialog: false,
    exportDialog: false,
    copyDialog: false,
    notification: '',
    snackbar: false
  }),
  methods: {
    background () {
      if (this.pilot.custom_background) return this.pilot.custom_background
      else return this.$store.getters.getItemById('Backgrounds', this.pilot.background).name
    },
    toggleActive () {
      this.$store.dispatch('loadPilot', this.pilot.id)
      this.$store.dispatch('editPilot', {
        attr: `active`,
        val: !this.pilot.active
      })
    },
    toPilotSheet () {
      this.$store.dispatch('loadPilot', this.pilot.id)
      this.$router.push('./pilot')
    },
    deletePilot () {
      this.deleteDialog = false
      this.$store.dispatch('deletePilot', this.pilot.id)
      this.notification = 'Pilot Deleted'
      this.snackbar = true
    },
    clonePilot (isFlashclone: boolean) {
      if (isFlashclone) {
        var quirks = this.$store.getters.getItemCollection('Quirks')
        var quirk = quirks[Math.floor(Math.random() * quirks.length)]
        this.$store.dispatch('clonePilot', {id: this.pilot.id, quirk: quirk})
        this.notification = 'Pilot Cloned'
      } else {
        this.$store.dispatch('clonePilot', {id: this.pilot.id})
        this.notification = 'Pilot Duplicated'
      }
      this.snackbar = true
      this.copyDialog = false
    },
    exportPilot () {
      const { dialog } = require('electron').remote
      var path = dialog.showSaveDialog({
        defaultPath: this.pilot.callsign.toLowerCase().replace(/\W/g, ''),
        buttonLabel: 'Save Pilot'
      })
      io.saveFile(path + '.json', JSON.stringify(this.pilot))
        this.exportDialog = false
        this.notification = 'Pilot Export Successful'
        this.snackbar = true
      },
    copyPilot () {
      const {clipboard} = require('electron')
      clipboard.writeText(JSON.stringify(this.pilot))
      this.exportDialog = false
      this.notification = 'Pilot Data Copied to Clipboard'
      this.snackbar = true
    }
  }
})
</script>

<style scoped>
 .pilot-letter {
   display:table-cell; 
   vertical-align:middle; 
   text-align:center;
   font-size: 20vw;
   line-height: 0;
 }

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
