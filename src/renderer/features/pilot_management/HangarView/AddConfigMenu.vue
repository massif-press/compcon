<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex class="mt-5">
        <v-stepper v-model="nc_step" vertical>
          <v-stepper-step :complete="nc_step > 1" step="1">
            Editor Mode
            <small v-if="nc_step > 1">Create New</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-text>
                <div class="ml-5 mr-5">
                  <v-btn large color="primary" block @click="nc_step = 2">
                    Create New
                  </v-btn>
                  <v-divider class="ma-4" />
                  <v-btn flat color="primary" block @click="importFile">
                    Import from File
                  </v-btn>
                  <v-btn flat color="primary" block @click="importClipboard">
                    Import from Clipboard
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-stepper-content>

          <v-stepper-step :complete="nc_step > 2" step="2">
            Frame Selection
            <small v-if="selectedFrame">
              {{ selectedFrame.Source }}
              <strong>{{ selectedFrame.Name }}</strong>
            </small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-toolbar color="primary" nudge-left="200px">
              <v-tooltip top>
                <div class="pt-3" slot="activator">
                  <v-switch color="yellow" v-model="showLocked">
                    <v-icon v-if="showLocked" dark slot="append" color="yellow">
                      lock_open
                    </v-icon>
                    <v-icon v-else dark slot="append">lock</v-icon>
                  </v-switch>
                </div>
                <span v-if="!showLocked">Show unauthorized Frames</span>
                <span v-else>Hide unauthorized Frames</span>
              </v-tooltip>
              <v-spacer />
              <v-text-field
                class="search-field ma-2"
                prepend-icon="search"
                dark
                v-model="search"
                flat
                hide-details
                single-line
                placeholder="Search"
                clearable
              />
            </v-toolbar>
            <v-card light>
              <v-data-table
                :headers="headers"
                :items="frames"
                item-key="id"
                hide-actions
              >
                <template slot="items" slot-scope="props">
                  <tr :class="{ locked: isLocked(props.item) }">
                    <td style="padding: 0!important; width:50px;">
                      <v-tooltip top>
                        <v-btn
                          slot="activator"
                          color="primary"
                          @click="select(props.item)"
                          style="height:95px"
                          class="pa-0 ma-0"
                        >
                          <v-icon size="65">save_alt</v-icon>
                        </v-btn>
                        <span>Select {{ props.item.Name }} Frame</span>
                      </v-tooltip>
                    </td>
                    <td
                      class="text-xs-left clickable mr-0 pr-0"
                      style="height:100px;"
                      @click="spawnPopup(props.item)"
                    >
                      <v-layout>
                        <v-flex shrink>
                          <span class="mt-1 middle">
                            {{ props.item.Source }}
                            <br />
                            <span class="major-title font-weight-bold">
                              {{ props.item.Name }}
                              <v-tooltip v-if="isLocked(props.item)" top>
                                <v-icon
                                  color="warning"
                                  slot="activator"
                                  style="display: inline;"
                                >
                                  warning
                                </v-icon>
                                <span>
                                  {{ pilot.callsign }} does not have the license
                                  necessary to print this frame ({{
                                    props.item.Name
                                  }}
                                  II)
                                </span>
                              </v-tooltip>
                            </span>
                          </span>
                        </v-flex>
                        <v-flex>
                          <v-img
                            :src="props.item.DefaultImage"
                            max-height="100px"
                            :position="`top ${props.item.YPosition}% left 80px`"
                            class="gradient"
                            style="mask-image: linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0));"
                          />
                        </v-flex>
                      </v-layout>
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <v-card-actions>
                <v-btn color="primary" flat @click="nc_step--">
                  <v-icon>chevron_left</v-icon>
                  Back
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-dialog lazy v-model="infoDialog" width="95vw">
              <v-toolbar color="#7E57C2" dark>
                <v-toolbar-title>
                  {{ selectedFrame.Name }}
                  <span class="caption">({{ selectedFrame.Source }}</span>
                </v-toolbar-title>
              </v-toolbar>
              <v-card>
                <v-card-text>
                  <item-card :itemData="selectedFrame" popup />
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-stepper-content>

          <v-stepper-step step="3">Designation</v-stepper-step>
          <v-stepper-content step="3">
            <v-card flat>
              <v-text-field v-model="newConfigName" clearable>
                <v-tooltip top slot="prepend-inner">
                  <v-btn slot="activator" icon flat @click="randomMechname">
                    <v-icon>shuffle</v-icon>
                  </v-btn>
                  <span>Generate Random Designation</span>
                </v-tooltip>
                <span slot="label">
                  Configuration Name
                  <b v-if="!newConfigName" class="red--text">*</b>
                </span>
                <span slot="append-outer">
                  <v-icon v-if="newConfigName" color="green">
                    check_circle
                  </v-icon>
                </span>
              </v-text-field>
            </v-card>
            <v-layout justify-space-between>
              <v-spacer />
              <v-flex shrink>
                <v-btn color="primary" flat @click="nc_step--">
                  <v-icon>chevron_left</v-icon>
                  Back
                </v-btn>
                <v-btn
                  color="success"
                  large
                  class="pl-4"
                  @click="addNewConfig"
                  :disabled="!(selectedFrame && newConfigName)"
                >
                  Confirm &nbsp;
                  <v-icon>done</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import path from 'path'
import io from '@/features/_shared/data_io'
import validator from '../logic/validator'
import { Pilot, Frame, Mech } from '@/class'
import { ItemCard } from '../components/UI'

export default Vue.extend({
  name: 'new-config',
  components: { ItemCard },
  props: {
    pilot: Pilot,
  },
  data: () => ({
    nc_step: 0,
    newConfigName: null,
    showLocked: false,
    search: null,
    headers: [
      { align: 'left', sortable: false },
      { text: 'Frame', align: 'left', value: 'Name' },
    ],
    infoDialog: false,
    selectedFrame: {} as Frame,
  }),
  computed: {
    frames() {
      var vm = this as any
      let i = vm.$store.getters.getItemCollection('Frames')

      if (!vm.showLocked)
        i = i.filter(
          (x: Frame) => vm.pilot.has('License', x.Name, 2) || x.Source === 'GMS'
        )

      if (vm.search)
        i = i.filter((x: Frame) =>
          x.Name.toUpperCase().includes(vm.search.toUpperCase())
        )

      return i
    },
  },
  methods: {
    spawnPopup(frame: Frame) {
      this.selectedFrame = frame
      this.infoDialog = true
    },
    randomMechname() {
      var vm = this as any
      vm.newConfigName = `${io.randomName('mechnames.txt')}`
      vm.$forceUpdate()
    },
    select(frame: Frame) {
      this.selectedFrame = frame
      this.nc_step++
    },
    isLocked(frame: Frame): boolean {
      if (frame.Source === 'GMS') return false
      return !this.pilot.has('License', frame.Name, 2)
    },
    addNewConfig() {
      let newMech = new Mech(this.selectedFrame, this.pilot)
      newMech.Name = this.newConfigName || 'New Config'
      this.pilot.AddMech(newMech)
      this.newConfigName = null
      this.selectedFrame = {} as Frame,
      this.nc_step = 1
      this.$emit('close')
    },
    importFile() {
      const { dialog } = require('electron').remote
      var path = dialog.showOpenDialog({
        title: 'Load Configuration Data',
        buttonLabel: 'Load',
        properties: ['openFile'],
        filters: [{ name: 'Configuration Data', extensions: ['json'] }],
      })
      var data = io.importFile(path[0])
      try {
        var mechData = validator.checkMechVersion(data)
        this.pilot.AddMech(Mech.Deserialize(mechData, this.pilot))
      } catch (error) {
        alert('Config data validation failed')
        console.error(error)
      }
      this.$emit('close')
    },
    importClipboard() {
      var vm = this
      const { clipboard } = require('electron')
      validator.clipboardConfig(clipboard.readText(), function(err, result) {
        if (err) {
          alert(err)
        } else {
          try {
            var mechData = validator.checkMechVersion(result)
            vm.pilot.AddMech(Mech.Deserialize(mechData, vm.pilot))
          } catch (error) {
            alert('Config data validation failed')
            console.error(error)
          }
        }
      })
      this.$parent.$forceUpdate()
      this.$emit('close')
    },
  },
})
</script>

<style scoped>
.locked {
  background-color: #f5f5f5;
}

.middle {
  position: relative;
  top: 15%;
  text-align: left;
}

.gradient {
  opacity: 0.75;
  transition: opacity 0.15s ease-in-out;
}

.gradient:hover {
  opacity: 1;
}
</style>
