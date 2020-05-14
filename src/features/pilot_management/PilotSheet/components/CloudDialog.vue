<template>
  <div>
    <cloud-manager
      ref="cloud"
      :pilot="pilot"
      @start-sync="syncing = true"
      @end-sync="syncing = false"
    />
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-cloud-outline"
      large
      no-confirm
      title="Omninet Vault Settings"
    >
      <v-card-text>
        <p class="flavor-text">
          // UNI OMNINET VAULT REMIT INTERFACE v.7.3.1 rev. 3 //
          <br />
          <span class="caption">
            PLEASE NOTE THAT ALL TRANSMIT RECORDS OF DATA SENT OR RECEIVED THROUGH THIS REMIT
            INTERFACE BY UNION PERSONNEL MAY BE AUTOMATICALLY LOGGED, MONITORED AND/OR RECORDED BY
            UNION NAVAL INTELLIGENCE NHP PERSONNEL PERSUANT TO 5014 OMNINET (TRANSMIT NODE
            PROTOCOLS) (PARACAUSAL) REGULATIONS.
          </span>
        </p>
        <v-slide-x-transition group mode="in-out" />
        <div v-if="!syncing" key="nosync" class="flavor-text">
          <span class="heading h3 accent--text">Pilot status:&nbsp;</span>
          <span v-if="!pilot.CloudID">No Vault data found</span>
          <span v-else-if="pilot.IsUserOwned">
            {{ pilot.Callsign }}'s data is stored in
            <b class="accent--text">your</b>
            Vault
          </span>
          <span v-else>
            {{ pilot.Callsign }}'s data is stored in
            <b class="accent--text">someone else's</b>
            Vault
          </span>
          <br />
          <span class="heading h3 accent--text">Pilot Share Code:&nbsp;</span>
          <span v-if="!pilot.CloudID">No Vault data found</span>
          <span v-else>
            {{ pilot.CloudID }}
            <cc-tooltip simple inline content="Copy Share Code to clipboard">
              <v-icon :color="copyConfirm ? 'success' : 'grey'" @click="copyCode()">
                {{ copyConfirm ? 'mdi-check-outline' : 'mdi-clipboard-text-outline' }}
              </v-icon>
            </cc-tooltip>
            <v-fade-transition>
              <span v-if="copyConfirm" class="subtle--text">Copied!</span>
            </v-fade-transition>
          </span>
          <br />
          <span class="heading h3 accent--text">Last Update:&nbsp;</span>
          <span v-if="!pilot.CloudID">Never</span>
          <span v-else-if="!pilot.IsUserOwned">Vault updated at {{ pilot.LastCloudUpdate }}</span>
          <span v-else>Local data updated at {{ pilot.LastCloudUpdate }}</span>
        </div>
        <div v-else key="syncing">
          <v-row>
            <v-progress-circular
              :size="70"
              :width="7"
              color="secondary"
              class="ml-auto mr-auto"
              indeterminate
            />
          </v-row>
        </div>
        <v-divider class="my-2" />
        <v-row>
          <v-col>
            <v-btn
              large
              block
              tile
              outlined
              color="primary"
              :disabled="!pilot.IsUserOwned || !pilot.CloudID"
              @click="$refs.cloud.save()"
            >
              Save Pilot Data to Vault
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-n1">
            <cc-tooltip
              simple
              inline
              :content="
                `Saves local pilot data to the Cloud, <b class='accent--text'>overwriting</b> any cloud data that currently exists. ${
                  !pilot.IsUserOwned
                    ? 'Because this pilot did not originate from your Vault, you are unable to overwrite its cloud data. Using the \'Create New Vault Record\' option will allow you to create a unique Cloud copy of this pilot you can save over.'
                    : ''
                }`
              "
            >
              <v-icon class="mt-1 ml-n3">mdi-information-outline</v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              block
              tile
              outlined
              color="accent"
              :disabled="!pilot.CloudID"
              @click="$refs.cloud.load()"
            >
              Load Pilot Data from Vault
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-n1">
            <cc-tooltip
              simple
              inline
              content="Loads local pilot data from the Cloud, <b class='accent--text'>overwriting any local changes that don't exist on the cloud save</b>"
            >
              <v-icon class="mt-1 ml-n3">mdi-information-outline</v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn large block tile outlined color="accent" @click="$refs.cloud.new()">
              Create new Vault record
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-n1">
            <cc-tooltip
              simple
              inline
              :content="
                `This option creates a new, unique pilot cloud record and links that record to this pilot data on your system. ${
                  pilot.CloudID
                    ? 'Selecting this option will <b class=\'accent--text\'>break the link</b> between this pilot and the current Vault record it is linked with'
                    : ''
                }`
              "
            >
              <v-icon class="mt-1 ml-n4">mdi-information-outline</v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloudManager from './CloudManager.vue'
import { Plugins } from '@capacitor/core'
const { Clipboard } = Plugins

export default Vue.extend({
  name: 'cloud-dialog',
  components: { CloudManager },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    syncing: false,
    copyConfirm: false,
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    async copyCode() {
      this.copyConfirm = true
      await Clipboard.write({
        string: this.pilot.CloudID,
      })
      setTimeout(() => {
        this.copyConfirm = false
      }, 1200)
    },
  },
})
</script>
