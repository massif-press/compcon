<template>
<v-hover style="background-color: rgba(0,0,0,0)">
  <v-card slot-scope="{ hover }" :class="`inactive elevation-${hover ? 12 : 0}`">
    <v-layout row style="cursor: pointer;" @click="toConfigSheet()">
      <v-flex class="ma-0 pb-0 pt-0">
        <v-img v-if="config.custom_img" :src="`file://${userDataPath}/img/frame/${config.custom_img}`" position="top" :height="`${cardHeight}px`"/>
        <v-img v-else :src="`file://${userDataPath}/img/default_frames/${config.frame_id}.png`" position="top" :height="`${cardHeight}px`"/>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-card :color="panelColor(config.active)" dark flat>
          <v-layout>
            <v-flex xs9 class="ma-2">
              <span class="title">{{config.name}}</span>
              <br>
              <span class="caption">{{frame().source}} {{frame().name}}</span>
            </v-flex>
            <v-flex class="mt-2 mb-2 mr-1 text-xs-right">
                <v-tooltip top>
                  <v-btn slot="activator" icon class="ma-0" @click="activateConfig()">
                    <v-icon :color="config.active ? 'teal accent-3' : 'grey lighten-1'">mdi-power</v-icon>
                  </v-btn>
                  <div class="text-xs-center">
                    <span><b :class="activeColorClass(config.active)"> {{config.active ? 'Active' : 'Inactive'}}</b>
                      <br><i>Click to {{config.active ? 'deactivate' : 'activate'}} Mech</i></span>
                  </div>
                </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="exportDialog = true"><v-icon>mdi-export-variant</v-icon></v-btn>
                <span>Export Configuration</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" icon class="ma-0" @click="copyDialog = true"><v-icon>mdi-content-duplicate</v-icon></v-btn>
                <span>Duplicate Configuration</span>
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

      <lazy-dialog :model="deleteDialog" title="Delete Mech Configuration" acceptString="Delete"
        acceptColor="warning" @accept="deleteConfig" @cancel="deleteDialog = false">
        <template v-slot:modal-content>
          <v-card-text>Are you sure you want to delete {{config.name}}? This action cannot be undone</v-card-text>
        </template>
      </lazy-dialog>

      <lazy-dialog :model="exportDialog" title="Export Mech Configuration" hide-confirm @cancel="exportDialog = false">
        <template v-slot:modal-content>
          <v-btn large block flat color="primary" @click="exportConfig">Save to File</v-btn><br>
          <v-btn large block flat color="primary" @click="copyConfig">Copy Configuration Data to Clipboard</v-btn>   
        </template>
      </lazy-dialog>

      <lazy-dialog :model="copyDialog" title="Duplicate Mech Configuration" hide-confirm @cancel="copyDialog = false">
        <template v-slot:modal-content>
          <v-card-text slot="modal-content" class="text-xs-center">
            <v-btn large block color="indigo" @click="cloneConfig" dark>Duplicate Configuration</v-btn>
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
import {getStatic} from '@/mixins/static'
import {LazyDialog} from '../components/UI'

export default Vue.extend({
  name: 'config-card',
  components: {LazyDialog},
  props: {
    config: Object,
    cIdx: Number,
    cardHeight: Number,
  },
  data: () => ({
    deleteDialog: false,
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
    activeColorClass (isActive: boolean): string {
      return isActive ? 'success--text text--lighten-2' : 'grey--text text--lighten-1' 
    },
    panelColor (isActive: boolean): string {
      return isActive ? `rgba(4, 48, 114, 0.55)` : `rgba(0, 0, 0, 0.55)`
    },
    frame (): Frame {
      return this.$store.getters['getItemById']('Frames', this.config.frame_id)
    },
    getStaticPath (path: string): string {
      return getStatic(path)
    },
    toConfigSheet () {
      this.$store.dispatch('loadConfig', this.config.id)
      this.$router.push('./config')
    },
    activateConfig () {
      this.$emit('activate', {id: this.config.id, toggle: !this.config.active}) 
      this.$forceUpdate() 
      this.$parent.$forceUpdate() 
      this.notify(`${this.config.name} ${this.config.active ? 'Activated' : 'Deactivated'}`)
    },    
    deleteConfig () {
      this.deleteDialog = false
      this.$store.dispatch('deleteConfig', this.config.id)
      this.notify('Configuration Deleted')
    },
    cloneConfig () {
      this.$store.dispatch('cloneConfig', JSON.parse(JSON.stringify(this.config)))
      this.copyDialog = false
      this.$parent.$forceUpdate()
      this.notify('Configuration Duplicated')
    },
    exportConfig () {
      const { dialog } = require('electron').remote
      var path = dialog.showSaveDialog({
        defaultPath: this.config.name.toLowerCase().replace(/\W/g, ''),
        buttonLabel: 'Export Configuration'
      })
      io.saveFile(path + '.json', JSON.stringify(this.config))
      this.exportDialog = false
      this.notify('Configuration Exported Successfully')
    },
    copyConfig () {
      const {clipboard} = require('electron')
      clipboard.writeText(JSON.stringify(this.config))
      this.exportDialog = false
      this.notify('Configuration Copied to Clipboard')
    }
  }
})
</script>

<style scoped>
  .inactive {
   background: linear-gradient(#616161, #424242 80%);
   background-color: #424242;
 }

  .inactive:hover {
   background: linear-gradient(#546E7A, #616161 80%);
   border: 0px
 }
</style>
