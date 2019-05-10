<template>
  <v-hover style="background-color: rgba(0,0,0,0)">
    <v-card slot-scope="{ hover }" :class="`${pilot.active ? 'active' : 'inactive'} elevation-${hover ? 12 : 0}`">
      <v-layout row style="cursor: pointer;" @click="toPilotSheet()">
        <v-flex v-if="pilot.cloud_portrait" class="ma-0 pb-0 pt-0">
          <v-img :src="pilot.cloud_portrait" position="top" :height="`${cardHeight}px`"/>
        </v-flex>
        <v-flex v-else-if="pilot.portrait" class="ma-0 pb-0 pt-0">
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
          <v-card :color="panelColor(pilot.active)" dark flat>
            <v-layout>
              <v-flex xs9 class="ma-2">
                <span class="title">{{pilot.callsign}}</span>
                <br>
                <span class="caption">{{pilot.name}}<br>{{background(pilot)}}, LL{{pilot.level}}</span>
              </v-flex>
              <v-spacer />
              <v-flex class="mt-2 mb-2 mr-1 text-xs-right">
                <v-tooltip top>
                  <v-btn slot="activator" icon class="ma-0" @click="activatePilot">
                    <v-icon :color="pilot.active ? 'teal accent-3' : 'grey darken-1'">mdi-power</v-icon>
                  </v-btn>
                  <div class="text-xs-center">
                    <span><b :class="activeColorClass(pilot.active)"> {{pilot.active ? 'Active' : 'Inactive'}}</b>
                      <br><i>Click to {{pilot.active ? 'deactivate' : 'activate'}} Pilot</i></span>
                  </div>
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

        <lazy-dialog :model="deleteDialog" title="Delete Pilot" acceptString="Delete"
          acceptColor="warning" @accept="deletePilot" @cancel="deleteDialog = false">
          <template v-slot:modal-content>
            <v-card-text>Are you sure you want to delete {{pilot.callsign}}? This action cannot be undone</v-card-text>
          </template>
        </lazy-dialog>

        <lazy-dialog :model="exportDialog" title="Export Pilot" hide-confirm @cancel="exportDialog = false">
          <template v-slot:modal-content>
            <v-card-text class="text-xs-center">
            <v-btn large flat color="primary" @click="exportPilot">Save to File <v-icon right dark>save</v-icon></v-btn><br>
            <v-btn large flat color="primary" @click="copyPilot">Copy Pilot Data to Clipboard <v-icon right dark>mdi-clipboard-text</v-icon></v-btn><br>
            <div v-if="pilot.gistID && !uploadFailed">
              <v-btn large flat color="success" :loading="cloudLoading" :disabled="cloudLoading" 
                @click="cloudLoading = true; cloudUpdatePilot()">Update Cloud Save <v-icon right dark>mdi-cloud-sync</v-icon></v-btn><br>
            </div>
            <div v-if="!pilot.gistID || uploadFailed">
              <v-btn large flat color="primary" :loading="cloudLoading" :disabled="cloudLoading" 
              @click="cloudLoading = true; cloudSavePilot()">Save Pilot to Cloud <v-icon right dark>cloud_upload</v-icon></v-btn>
            </div>
            </v-card-text>
            <div v-if="pilot.gistID">
              <v-divider />
              <v-card-text class="text-xs-center">
              <span class="effect-text" style="vertical-align: middle">Share ID:&emsp;</span><code>{{pilot.gistID}}</code>
              <v-tooltip top>
                <v-btn small icon slot="activator" color="grey lighten-3" @click="copyShareID"><v-icon small>mdi-clipboard-text</v-icon></v-btn>
                <span>Copy Share ID to Clipboard</span>
              </v-tooltip>
              </v-card-text>
            </div>
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
  import io from '@/features/_shared/data_io'
  import {LazyDialog} from '../components/UI'
  import {clipboard} from 'electron'
  import apis from '../logic/apis'

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
    snackbar: false,
    cloudLoading: false,
    uploadFailed: false,
  }),
  methods: {
    notify (alert: string) {
      this.notification = alert
      this.snackbar = true
    },
    activeColorClass (isActive: boolean): string {
      return isActive ? 'success--text text--lighten-2' : 'grey--text text--lighten-1' 
    },
    panelColor (isActive: boolean): string {
      return isActive ? `rgba(4, 48, 114, ${this.overlayOpacity})` : `rgba(0, 0, 0, ${this.overlayOpacity})`
    },
    background () {
      if (this.pilot.custom_background) return this.pilot.custom_background
      else return this.$store.getters['getItemById']('Backgrounds', this.pilot.background).name
    },
    toPilotSheet () {
      this.$store.dispatch('loadPilot', this.pilot.id)
      this.$router.push('./pilot')
    },
    activatePilot () {
      this.$store.dispatch('loadPilot', this.pilot.id)
      this.$store.dispatch('editPilot', {
        attr: `active`,
        val: !this.pilot.active
      })   
      this.$forceUpdate() 
      this.$parent.$forceUpdate() 
      this.notify(`${this.pilot.callsign} ${this.pilot.active ? 'Activated' : 'Deactivated'}`)
    },
    deletePilot () {
      this.deleteDialog = false
      this.$store.dispatch('deletePilot', this.pilot.id)
      this.notify('Pilot Deleted')
    },
    clonePilot (isFlashclone: boolean) {
      if (isFlashclone) {
        var quirks = this.$store.getters['getItemCollection']('Quirks')
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
      clipboard.writeText(JSON.stringify(this.pilot))
      this.exportDialog = false
      this.notify('Pilot Data Copied to Clipboard')
    },
    cloudSavePilot () {
      var vm = this as any
      vm.$store.dispatch('loadPilot', this.pilot.id)
      vm.cloudLoading = true
      apis.createPilotGist(this.pilot).then((newGist: any) => {
        var gistID = newGist.id
        vm.$store.dispatch('editPilot', {
          attr: `gistID`,
          val: gistID
        })
        clipboard.writeText(gistID)
        vm.notify('Pilot Uploaded Successfully!<br>Share ID copied to Clipboard')
        vm.uploadFailed = false
        vm.cloudLoading = false
        vm.exportDialog = false
      }).catch(function (err: any) {
        vm.notify('Pilot Upload Failed')
        vm.cloudLoading = false
        vm.exportDialog = false
      })
    },
    cloudUpdatePilot () {
      var vm = this as any
      vm.$store.dispatch('loadPilot', this.pilot.id)
      vm.cloudLoading = true
      apis.updatePilotGist(this.pilot).then((newGist: any) => {
        clipboard.writeText(newGist.id)
        vm.notify('Pilot Updated Successfully!<br>Share ID copied to Clipboard')
        vm.uploadFailed = false
        vm.cloudLoading = false
      }).catch(function (err: any) {
        vm.notify('Pilot Upload Failed!<br>Try re-uploading.')
        vm.uploadFailed = true
        vm.cloudLoading = false
      })
    },
    copyShareID () {
      clipboard.writeText(this.pilot.gistID)
      this.notify('Share ID copied to Clipboard')
    }
  },
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
