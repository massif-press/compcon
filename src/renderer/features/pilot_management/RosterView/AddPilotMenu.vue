<template>
  <v-dialog v-model="dialogModel" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Add New Pilot
      </v-card-title>

      <v-card-text class="text-xs-center">
        <v-btn block large color="primary" @click="goToNew">
          Create New Pilot
        </v-btn>
        <v-divider />
        <v-btn block flat color="primary" @click="importFile">
          Import from File
        </v-btn>

        <v-btn block flat color="primary" @click="importClipboard">
          Import from Clipboard
        </v-btn>

        <v-layout>
          <v-flex>
            <v-dialog width="600" v-model="cloudDialog">
              <v-btn slot="activator" block flat color="primary">
                Import from Cloud
              </v-btn>
              <v-card>
                <v-card-title class="title">Enter Share ID</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="shareIDText"
                    label="Share ID"
                    outline
                    clearable
                  />
                  <span class="effect-text red--text">{{ errorText }}</span>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn flat @click="closeCloudDialog" color="primary">
                    Close
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    large
                    color="success"
                    :disabled="!shareIDText"
                    :loading="cloudLoading"
                    @click="importCloud"
                  >
                    Import
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
          <v-flex shrink>
            <v-dialog width="600" v-model="cloudInfoDialog">
              <v-btn
                slot="activator"
                icon
                small
                right
                absolute
                style="right: 150px;"
              >
                <v-icon color="grey" small>help</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="title">
                  Cloud Save Importer
                </v-card-title>
                <v-card-text>
                  This tool imports LANCER pilots saved to the cloud via the
                  "Save to Cloud" export button. Imported characters generate
                  new Share IDs, so any changes will be uploaded to a
                  <strong>new</strong>
                  cloud save.
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn flat @click="cloudInfoDialog = false" color="primary">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" flat @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import io from '@/features/_shared/data_io'
import validator from '../logic/validator'
import apis from '../logic/apis'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'add-pilot-menu',
  props: ['dialogModel'],
  data: () => ({
    cloudDialog: false,
    cloudInfoDialog: false,
    cloudLoading: false,
    shareIDText: '',
    errorText: '',
  }),
  methods: {
    close() {
      this.errorText = ''
      this.shareIDText = ''
      this.$emit('close')
    },
    goToNew() {
      this.$router.push('/new')
    },
    importFile() {
      var vm = this as any
      const { dialog } = require('electron').remote
      var path = dialog.showOpenDialog({
        title: 'Load Pilot Data',
        buttonLabel: 'Load',
        properties: ['openFile'],
        filters: [{ name: 'Pilot Data', extensions: ['json'] }],
      })
      var pilotData = io.importFile(path[0])
      if (validator.pilot(pilotData)) {
        let newPilot = Pilot.Deserialize(pilotData)
        newPilot.RenewID()
        vm.$store.dispatch('addPilot', newPilot)
        vm.close()
      } else {
        alert('Pilot data validation failed')
        vm.addDialog = false
      }
    },
    importClipboard() {
      var vm = this as any
      const { clipboard } = require('electron')
      validator.clipboardPilot(clipboard.readText(), function(err, result) {
        if (err) {
          alert(err)
        } else {
          let newPilot = Pilot.Deserialize(result)
          newPilot.RenewID()
          vm.$store.dispatch('addPilot', newPilot)
        }
      })
      vm.addDialog = false
      vm.close()
    },
    importCloud() {
      var vm = this as any
      vm.cloudLoading = true
      apis
        .importPilotGist(vm.shareIDText)
        .then((gist: any) => {
          let newPilotData = JSON.parse(gist.files['pilot.txt'].content)
          let newPilot = Pilot.Deserialize(newPilotData)
          newPilot.RenewID()
          vm.$store.dispatch('addPilot', newPilot)
          vm.cloudDialog = false
          vm.cloudLoading = false
          vm.close()
        })
        .catch(function(err: any) {
          vm.errorText = 'Pilot Import Failed! Cannot resolve this Share ID'
          vm.cloudLoading = false
        })
    },
    closeCloudDialog() {
      this.cloudDialog = false
      this.errorText = ''
      this.shareIDText = ''
    },
  },
})
</script>
