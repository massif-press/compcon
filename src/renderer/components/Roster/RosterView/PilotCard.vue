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
              <v-flex xs9 class="ma-2">
                <span class="title">{{pilot.callsign}}</span>
                <br>
                <span class="caption">{{pilot.name}}<br>{{background(pilot)}}, LL{{pilot.level}}</span>
              </v-flex>
              <v-spacer />
              <v-flex class="mt-2 mb-2 mr-1 text-xs-right">
                <v-tooltip top>
                  <v-btn slot="activator" icon class="ma-0" @click="activateDialog = true"><v-icon>mdi-power</v-icon></v-btn>
                  <span>Activate Pilot</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" icon class="ma-0" @click="exportDialog = true"><v-icon>mdi-export-variant</v-icon></v-btn>
                  <span>Export Pilot</span>
                </v-tooltip>              <v-tooltip top>
                  <v-btn slot="activator" icon class="ma-0" @click="copyDialog = true"><v-icon>mdi-content-duplicate</v-icon></v-btn>
                  <span>Clone Pilot</span>
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

        <lazy-dialog :model="activateDialog" :title="`Activate ${pilot.callsign}`" acceptString="Activate"
          acceptColor="success" @accept="activatePilot" @cancel="activateDialog = false">
          <template v-slot:modal-content>
            <v-card-text class="text-xs-center">
              <span>This will enable Active Mode for {{pilot.callsign}}. While in Active Mode, stat tracking is enabled, but 
              pilot attributes cannot be freely edited or reallocated, except on level up.</span>
              <v-divider />
              
            </v-card-text>
          </template>
        </lazy-dialog>

        <lazy-dialog :model="deleteDialog" title="Delete Pilot" acceptString="Delete"
          acceptColor="warning" @accept="deletePilot" @cancel="deleteDialog = false">
          <template v-slot:modal-content>
            <v-card-text>Are you sure you want to delete {{pilot.callsign}}? This action cannot be undone</v-card-text>
          </template>
        </lazy-dialog>

        <lazy-dialog :model="exportDialog" title="Export Pilot" hide-confirm @cancel="exportDialog = false">
          <template v-slot:modal-content>
            <v-btn large block flat color="primary" @click="exportPilot">Save to File</v-btn><br>
            <v-btn large block flat color="primary" @click="copyPilot">Copy Pilot Data to Clipboard</v-btn>          
          </template>
        </lazy-dialog>

        <lazy-dialog :model="copyDialog" title="Clone Pilot" hide-confirm @cancel="copyDialog = false">
          <template v-slot:modal-content>
            <v-card-text class="text-xs-center">
              <v-btn large block color="indigo" @click="clonePilot()" dark>Duplicate Pilot</v-btn>
              <span>Copy Pilot data into a new Pilot, without generating a <b>Quirk</b></span>
              <v-divider class="ma-4"/>
              <v-btn large block color="indigo" dark @click="clonePilot(true)">Flash Clone Pilot</v-btn>
              <span>Flash Clones this Pilot, and generates a <b>Quirk</b> &mdash; a complication resulting from the cloning process
              <br>
              <i>(Quirks can be edited or removed on the Pilot Sheet)</i></span>
            </v-card-text>
          </template>
        </lazy-dialog>

      </v-layout>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/store/data_io'
  import {LazyDialog} from '@/components/UI'

  export default Vue.extend({
  name: 'pilot-card',
  components: {LazyDialog},
  props: {
    pilot: Object,
    pIdx: Number,
    cardHeight: Number,
  },
  data: () => ({
    overlayOpacity: 0.55,
    activateDialog: false,
    deleteDialog: false,
    printDialog: false,
    exportDialog: false,
    copyDialog: false,
    notification: '',
    snackbar: false
  }),
  methods: {
    notify (alert: string) {
      this.notification = alert
      this.snackbar = true
    },
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
      this.notify('Pilot Deleted')
    },
    clonePilot (isFlashclone: boolean) {
      if (isFlashclone) {
        var quirks = this.$store.getters.getItemCollection('Quirks')
        var quirk = quirks[Math.floor(Math.random() * quirks.length)]
        this.$store.dispatch('clonePilot', {id: this.pilot.id, quirk: quirk})
        this.notify('Pilot Cloned')
      } else {
        this.$store.dispatch('clonePilot', {id: this.pilot.id})
        this.notify('Pilot Duplicated')
      }
      this.copyDialog = false
    },
    exportPilot () {
      const { dialog } = require('electron').remote
      var path = dialog.showSaveDialog({
        defaultPath: this.pilot.callsign.toUpperCase().replace(/\W/g, ''),
        buttonLabel: 'Save Pilot'
      })
      io.saveFile(path + '.json', JSON.stringify(this.pilot))
        this.exportDialog = false
        this.notify('Pilot Export Successful')
      },
    copyPilot () {
      const {clipboard} = require('electron')
      clipboard.writeText(JSON.stringify(this.pilot))
      this.exportDialog = false
      this.notify('Pilot Data Copied to Clipboard')
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
