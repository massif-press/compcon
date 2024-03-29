<template>
  <div>
    <v-menu offset-y offset-x>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="ml-2" icon :dark="!light" v-on="menu">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader color="panel">
        <v-subheader v-if="!dense" class="heading h2 white--text primary py-0 px-2">
          Pilot Options
        </v-subheader>
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
        <v-list-item @click="$refs.cloneDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-dna</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Clone</v-list-item-title>
            <v-list-item-subtitle>Duplicate or Flash Clone this character</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.statblockDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Generate Statblock</v-list-item-title>
            <v-list-item-subtitle>
              Get a plaintext representation of this character's build
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="pilot.CloudController.IsRemoteResource"
          :disabled="!isAuthed"
          :loading="loading"
          @click="remoteUpdate()"
        >
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-cloud-sync</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download Latest Data</v-list-item-title>
            <v-list-item-subtitle>
              Download all remote changes to this pilot, overwriting local data.
              <br />
              <b v-show="!isAuthed">Requires a COMP/CON cloud account.</b>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else :disabled="!isAuthed" @click="$refs.shareDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-code-json</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Get Share Code</v-list-item-title>
            <v-list-item-subtitle>
              Generate a share code that other users can use to import and sync this character.
              <br />
              <b v-show="!isAuthed">Requires a COMP/CON cloud account.</b>
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
    <print-dialog ref="printDialog" :pilot="pilot" />
    <export-dialog ref="exportDialog" :pilot="pilot" />
    <statblock-dialog ref="statblockDialog" :pilot="pilot" />
    <delete-dialog ref="deleteDialog" :pilot="pilot" @delete="delete_pilot()" />
    <clone-dialog ref="cloneDialog" :pilot="pilot" />
    <cc-solo-dialog title="Share Code Management" ref="shareDialog" no-confirm>
      <share-dialog :pilot="pilot" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CloneDialog from './CloneDialog.vue'
import StatblockDialog from './StatblockDialog.vue'
import ExportDialog from './ExportDialog.vue'
import ShareDialog from './ShareDialog.vue'
import PrintDialog from './PrintDialog.vue'
import DeleteDialog from './DeletePilotDialog.vue'

import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { RemoteSyncItem } from '@/cloud/item_sync'

export default Vue.extend({
  name: 'edit-menu',
  components: {
    StatblockDialog,
    ExportDialog,
    PrintDialog,
    DeleteDialog,
    CloneDialog,
    ShareDialog,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    light: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isAuthed() {
      return getModule(UserStore, this.$store).IsLoggedIn
    },
  },
  methods: {
    delete_pilot() {
      this.pilot.SaveController.delete()
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management')
    },
    async remoteUpdate() {
      this.loading = true
      try {
        await RemoteSyncItem(this.pilot)
        this.$notify('Pilot synced to remote', 'success')
      } catch (error) {
        console.error(error)
        this.$notify('An error occurred while attempting to download remote data', 'error')
      }
      this.loading = false
    },
  },
})
</script>
