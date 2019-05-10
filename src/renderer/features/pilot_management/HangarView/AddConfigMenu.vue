<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex>
        <v-stepper v-model="nc_step" vertical>
          <v-stepper-step :complete="nc_step > 1" step="1">
            Editor Mode<small v-if="nc_step > 1">Create New</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-text>
                <div class="ml-5 mr-5">
                  <v-btn large color="primary" block @click="nc_step = 2">Create New</v-btn>
                  <v-divider class="ma-4"/>
                  <v-btn flat color="primary" block @click="importFile">Import from File</v-btn>
                  <v-btn flat color="primary" block @click="importClipboard">Import from Clipboard</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-stepper-content>

          <v-stepper-step :complete="nc_step > 2" step="2">Frame Selection
            <small>Unauthorized Frames <em :class="`font-weight-bold ${showLocked ? 'red--text' : ''}`">{{showLocked ? 'SHOWN' : 'HIDDEN'}}</em></small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-toolbar color="primary" nudge-left="200px">
              <v-tooltip top>
                <div class="pt-3" slot="activator">
                  <v-switch color="yellow" v-model="showLocked">
                    <v-icon v-if="showLocked" dark slot="append" color="yellow">lock_open</v-icon>
                    <v-icon v-else dark slot="append">lock</v-icon>
                  </v-switch>
                </div>
                <span v-if="!showLocked">Show unauthorized Frames</span>
                <span v-else>Hide unauthorized Frames</span>
              </v-tooltip>
              <v-spacer />
              <v-text-field class="search-field ma-2" prepend-icon="search"
                v-model="search" flat hide-details single-line placeholder="Search" clearable />
            </v-toolbar>
            <v-card light>
              <v-data-table :headers="headers" :items="frames" item-key="id" hide-actions>
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded" :class="{ locked: isLocked(props.item.name) }">
                    <td style="padding: 0!important;"><v-btn color="primary" icon @click="select(props.item)" class="p-0 m-0"><v-icon>save_alt</v-icon></v-btn></td>
                    <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
                    <td class="text-xs-left">
                      <span class="subheading font-weight-bold">{{ props.item.name }} 
                        <v-tooltip v-if="isLocked(props.item.name)" top>
                          <v-icon small color="warning" slot="activator">warning</v-icon>
                          <span>{{pilot.callsign}} does not have the license necessary to print this frame ({{props.item.name}} II)</span>
                        </v-tooltip>
                    </span>
                    </td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.size === 0.5 ? '½' : props.item.stats.size }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.armor }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.hp }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.evasion }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{props.item.stats.edef}}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.heatcap }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.repcap }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.sensor_range }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.tech_attack }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{props.item.stats.save}}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.speed }}</span></td>
                    <td class="text-xs-right"><span class="subheading">{{ props.item.stats.sp }}</span></td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <frame-statblock :frame="props.item" hide-statblock />
                </template>
              </v-data-table>
              <v-card-actions>
                <v-btn color="primary" flat @click="nc_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-step step="3">Designation</v-stepper-step>
          <v-stepper-content step="3">
            <v-card flat>
              <v-text-field v-model="newConfigName" clearable>
                <v-tooltip top slot="prepend-inner">
                  <v-btn slot="activator" icon flat @click="randomMechname"><v-icon>shuffle</v-icon></v-btn>
                  <span>Generate Random Designation</span>
                </v-tooltip>
                <span slot="label">Configuration Name <b v-if="!newConfigName" class="red--text">*</b></span>
                <span slot="append-outer">
                    <v-icon v-if="newConfigName" color="green">check_circle</v-icon>
                </span>
              </v-text-field>
            </v-card>
            <v-layout justify-space-between>
              <v-spacer />
              <v-flex shrink>
                <v-btn color="primary" flat @click="nc_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn color="success" large class="pl-4" @click="addNewConfig" :disabled="!newFrameId || !newConfigName">Confirm &nbsp;<v-icon>done</v-icon></v-btn>
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
  import io from '@/features/_shared/data_io'
  import { FrameStatblock } from '../components/UI'
  import validator from '../logic/validator'

  export default Vue.extend({
    name: 'new-config',
    components: { FrameStatblock },
    data: () => ({
      nc_step: 0,
      newFrameId: null,
      newFrameName: null,
      newConfigName: null,
      showLocked: false,
      search: null,
      headers: [
        {align: 'left', sortable: false},
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'Frame', align: 'left', value: 'name'},
        {text: 'Size', align: 'right', value: 'stats.size'},
        {text: 'Armor', align: 'right', value: 'stats.armor'},
        {text: 'HP', align: 'right', value: 'stats.hp'},
        {text: 'Evasion', align: 'right', value: 'stats.evasion'},
        {text: 'E-Defense', align: 'right', value: 'stats.edef'},
        {text: 'Heat Capacity', align: 'right', value: 'stats.heatcap'},
        {text: 'Repair Capacity', align: 'right', value: 'stats.repcap'},
        {text: 'Sensor Range', align: 'right', value: 'stats.sensor_range'},
        {text: 'Tech Attack', align: 'right', value: 'stats.tech_attack'},
        {text: 'Save', align: 'right', value: 'stats.save'},
        {text: 'Speed', align: 'right', value: 'stats.speed'},
        {text: 'SP', align: 'right', value: 'stats.sp'}
      ],
      licenses: [] as string[]
    }),
    computed: {
      frames () {
        var vm = this as any
        // filter by type
        var i = vm.$store.getters['getItemCollection']('Frames')
        if (!vm.showLocked) i = i.filter((x: Frame) => vm.licenses.includes(x.name))

        if (vm.search) i = i.filter((x: Frame) => x.name.toUpperCase().includes(vm.search.toUpperCase()))

        return i
      },
      pilot (): Pilot {
        return this.$store.getters['getPilot']
      }
    },
    methods: {
      randomMechname () {
        var vm = this as any
        vm.newConfigName = `${io.randomName('mechnames.txt')}`
        vm.$forceUpdate()
      },
      select (frame: Frame) {
        var vm = this as any
        vm.newFrameId = frame.id
        vm.newFrameName = frame.name
        vm.nc_step++
      },
      isLocked (name: string): boolean {
        return !this.licenses.includes(name)
      },
      addNewConfig () {
        this.$store.dispatch('addConfig', {
          pilot_id: this.pilot.id,
          name: this.newConfigName,
          frame_id: this.newFrameId,
          brew: this.$store.getters['getItemById']('Frames', this.newFrameId).brew || null
        })
        this.$emit('close')
      },
      importFile () {
        const { dialog } = require('electron').remote
        var path = dialog.showOpenDialog({
          title: 'Load Configuration Data',
          buttonLabel: 'Load',
          properties: [
            'openFile'
          ],
          filters: [
            { name: 'Configuration Data', extensions: ['json'] }
          ]
        })
        var data = io.importFile(path[0])
        if (validator.config(data)) {
          this.$store.dispatch('importConfig', data)
          this.$parent.$forceUpdate()
          this.$emit('close')
        } else {
          alert('Config data validation failed')
          this.$emit('close')
        }
      },
      importClipboard () {
        var vm = this
        const {clipboard} = require('electron')
        validator.clipboardConfig(clipboard.readText(), function (err, result) {
          if (err) {
            alert(err)
          } else {
            vm.$store.dispatch('importConfig', result)
          }
        })
        this.$parent.$forceUpdate()
        this.$emit('close')
      }
    },
    created () {
      var licenses = ['EVEREST']
      for (let i = 0; i < this.pilot.licenses.length; i++) {
        var l = this.pilot.licenses[i]
        if (l.level > 1) licenses.push(l.name)
      }
      this.licenses = licenses
    }
  })
</script>


<style scoped>
  .locked {
    background-color: #F5F5F5;
  }

</style>


