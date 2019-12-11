<template>
  <div>
    <v-menu offset-y top>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="ml-2" icon dark v-on="menu">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader>
        <v-subheader class="heading h2 white--text primary py-0 px-2">Pilot Options</v-subheader>
        <v-list-item @click="$refs.printDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-printer</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Print</v-list-item-title>
            <v-list-item-subtitle>
              Print tabletop-ready character and mech sheets
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.statblockDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-file-document-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Generate Statblock</v-list-item-title>
            <v-list-item-subtitle>
              Get a plaintext representation of this character's build
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.roll20Dialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-dice-d20</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Convert to Roll20</v-list-item-title>
            <v-list-item-subtitle>
              Copy JSON data that can be interpreted by the Roll20 LANCER sheet
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.exportDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-export-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Export Pilot</v-list-item-title>
            <v-list-item-subtitle>Open the pilot export menu</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cloudDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-cloud</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cloud Settings</v-list-item-title>
            <v-list-item-subtitle>
              Manage this pilot's cloud data and share codes
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cloud.sync()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-cloud-sync</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Quick Sync</v-list-item-title>
            <v-list-item-subtitle v-if="!pilot.CloudID && !pilot.IsUserOwned">
              Sync cloud with pilot (creates new cloud data)
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else-if="!pilot.CloudID || pilot.IsUserOwned">
              Sync cloud with pilot (overwrites cloud data)
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else>
              Sync pilot with cloud (overwrites local data)
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item @click="$refs.deleteDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text">Delete Pilot</v-list-item-title>
            <v-list-item-subtitle class="error--text">
              Remove this pilot from the roster
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu offset-y top>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="unskew ml-2" icon dark v-on="menu">
          <v-icon>mdi-view-grid-plus</v-icon>
        </v-btn>
      </template>
      <v-list subheader>
        <v-subheader class="heading h2 white--text primary py-0 px-4">Layout Options</v-subheader>
        <v-list-item-group>
          <v-list-item @click="$emit('set-layout', 'tabbed')">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-view-array</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Tabbed View</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$emit('set-layout', 'classic')">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-view-sequential</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sheet View (Classic View)</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item disabled>
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-playlist-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <cc-tooltip simple content="Feature In Development">
                <v-list-item-title>Manage Custom Views</v-list-item-title>
                <v-list-item-subtitle>Feature In Development</v-list-item-subtitle>
              </cc-tooltip>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <print-dialog ref="printDialog" class="unskew" :pilot="pilot" />
    <export-dialog ref="exportDialog" class="unskew" :pilot="pilot" />
    <statblock-dialog ref="statblockDialog" class="unskew" :pilot="pilot" />

    <roll20-dialog ref="roll20Dialog" class="unskew" :pilot="pilot" />

    <cloud-dialog ref="cloudDialog" class="unskew" :pilot="pilot" />
    <delete-dialog ref="deleteDialog" class="unskew" :pilot="pilot" @delete="deletePilot()" />
    <cloud-manager ref="cloud" class="unskew" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CloudManager from './CloudManager.vue'
import CloudDialog from './CloudDialog.vue'
import StatblockDialog from './StatblockDialog.vue'
import Roll20Dialog from './Roll20Dialog.vue'
import ExportDialog from './ExportDialog.vue'
import PrintDialog from './PrintDialog.vue'
import DeleteDialog from './DeletePilotDialog.vue'

import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'edit-menu',
  components: {
    CloudManager,
    CloudDialog,
    StatblockDialog,
    Roll20Dialog,
    ExportDialog,
    PrintDialog,
    DeleteDialog,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deletePilot() {
      this.$router.push('/pilot_management')
      const store = getModule(PilotManagementStore, this.$store)
      store.deletePilot(this.pilot)
    },
  },})

</script>
