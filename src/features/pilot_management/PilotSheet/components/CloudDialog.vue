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
      title="Cloud Download Settings"
    >
      <v-card-text>
        <v-alert prominent dense icon="mdi-alert" colored-border color="panel">
          <div class="heading h3"><b>Cloud Service Update</b></div>
          <div class="body-text">
            These tools are exclusively for the old, public cloud save service. Users with COMP/CON
            accounts have their cloud exports managed automatically, synced to their local instance
            of the app. Both systems are compatible, but
            <b class="accent--text">
              public cloud data made prior to v. 2.2.6 must be re-synced
            </b>
            <br />
            If you have a COMP/CON account and want to sync pilot data with users who do not have
            accounts, you can use this service to do so.
            <br />
            <br />
            Cloud Download will be deprecated and, eventually, removed after COMP/CON account
            creation exits the Patreon-only phase and Vault Import becomes available to everyone.
          </div>
        </v-alert>

        <!-- <p class="flavor-text">
          // UNI OMNINET VAULT REMIT INTERFACE v.7.3.1 rev. 3 //
          <br />
          <span class="caption">
            PLEASE NOTE THAT ALL TRANSMIT RECORDS OF DATA SENT OR RECEIVED THROUGH THIS REMIT
            INTERFACE BY UNION PERSONNEL MAY BE AUTOMATICALLY LOGGED, MONITORED AND/OR RECORDED BY
            UNION NAVAL INTELLIGENCE NHP PERSONNEL PERSUANT TO 5014 OMNINET (TRANSMIT NODE
            PROTOCOLS) (PARACAUSAL) REGULATIONS.
          </span>
        </p> -->
        <v-slide-x-transition group mode="in-out" />
        <div v-if="!syncing" key="nosync" class="flavor-text">
          <span class="heading h3 accent--text">Pilot status:&nbsp;</span>
          <span v-if="!pilot.GistCode">No public data found</span>
          <span v-else-if="pilot.IsUserOwned">
            {{ pilot.Callsign }}'s data is synced to
            <b class="accent--text">your</b>
            local data
          </span>
          <span v-else>
            {{ pilot.Callsign }}'s data is synced to
            <b class="accent--text">someone else's</b>
            data
          </span>
          <br />
          <span class="heading h3 accent--text">Pilot Share Code:&nbsp;</span>
          <span v-if="!pilot.GistCode">No public data found</span>
          <span v-else>
            {{ pilot.GistCode }}
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
          <span v-if="!pilot.GistCode">Never</span>
          <span v-else-if="!pilot.IsLocallyOwned">Last updated at {{ pilot.LastSync }}</span>
          <span v-else>Local data updated at {{ pilot.LastSync }}</span>
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
              color="accent"
              :disabled="!pilot.IsUserOwned || !pilot.GistCode"
              @click="$refs.cloud.save()"
            >
              Publish pilot data
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-n1">
            <cc-tooltip
              simple
              inline
              :content="
                `Saves local pilot data to the Cloud, <b class='accent--text'>overwriting</b> any cloud data that currently exists. ${
                  !pilot.IsUserOwned
                    ? 'Because this pilot did not originate from you, you are unable to overwrite its cloud data. Using the \'Create New Record\' option will allow you to create a unique Cloud copy of this pilot you can save over.'
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
              :disabled="!pilot.GistCode"
              @click="$refs.cloud.load()"
            >
              Load Pilot Data
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
              Create new record
            </v-btn>
          </v-col>
          <v-col cols="auto" class="ml-n1">
            <cc-tooltip
              simple
              inline
              :content="
                `This option creates a new, unique pilot cloud record and links that record to this pilot data on your system. ${
                  pilot.GistCode
                    ? 'Selecting this option will <b class=\'accent--text\'>break the link</b> between this pilot and the current record it is linked with'
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

      navigator.clipboard.writeText(this.pilot.GistCode).then(
        function() {
          Vue.prototype.$notify('Cloud ID copied to clipboard.', 'confirmation')
        },
        function() {
          Vue.prototype.$notifyError('Unable to copy Cloud ID')
        }
      )
      setTimeout(() => {
        this.copyConfirm = false
      }, 1200)
    },
  },
})
</script>
