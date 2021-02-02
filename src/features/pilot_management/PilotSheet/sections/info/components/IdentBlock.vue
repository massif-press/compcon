<template>
  <v-container fluid class="pt-0">
    <v-row dense class="stat-text pt-0 pb-0 mt-n2">
      <v-col>
        <div class="overline mb-n3 subtle--text">CALLSIGN</div>
        <cc-short-string-editor @set="pilot.Callsign = $event">
          {{ pilot.Callsign }}
        </cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="overline mb-n3 subtle--text">NAME</div>
        <cc-short-string-editor @set="pilot.Name = $event">{{ pilot.Name }}</cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="overline mb-n3 subtle--text">BACKGROUND</div>
        <cc-short-string-editor class="d-inline" @set="pilot.Background = $event">
          {{ pilot.Background }}
        </cc-short-string-editor>
        <span>
          <cc-background-selector
            :pilot="pilot"
            small
            class="d-inline fadeSelect ml-n1"
            @select="pilot.Background = $event"
          />
        </span>
      </v-col>
    </v-row>
    <v-row dense class="stat-text pt-0 mt-n3">
      <v-col>
        <div class="overline mb-n3 subtle--text">PLAYER</div>
        <cc-short-string-editor @set="pilot.PlayerName = $event">
          {{ pilot.PlayerName || '---' }}
        </cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="overline mb-n3 subtle--text">OMNINET VAULT</div>
        <span v-if="(pilot.CloudOwnerID && pilot.IsLocallyOwned) || pilot.IsUserOwned">
          Current User
        </span>
        <span v-else-if="!pilot.IsLocallyOwned || (!pilot.IsUserOwned && pilot.GistOwner)">
          Remote Sync
        </span>
        <span v-else class="stat-text error--text">
          // NOT SYNCED //
        </span>
        <cc-tooltip
          v-if="currentAuthedUser"
          inline
          title="Copy Vault Sync (COMP/CON Account) Code"
          :content="`Last Sync at:<br>${pilot.LastSync}`"
        >
          <v-icon small class="fadeSelect" @click="copyVault()">mdi-qrcode-scan</v-icon>
        </cc-tooltip>
        <cc-tooltip
          v-if="pilot.IsUserOwned && pilot.GistCode"
          inline
          title="Copy Share Code"
          :content="`Public Share Code<br>Last Sync at:<br>${pilot.LastSync}`"
        >
          <v-icon small class="fadeSelect" @click="copyCode()">mdi-barcode-scan</v-icon>
        </cc-tooltip>
        <cc-tooltip
          v-if="pilot.GistOwner && pilot.GistCode"
          inline
          title="Sync"
          :content="`Public Cloud Save<br>Last Sync at:<br>${pilot.LastSync}`"
        >
          <v-icon small class="fadeSelect" @click="sync()">mdi-reload</v-icon>
        </cc-tooltip>
      </v-col>
      <v-col>
        <div class="overline mb-n3 subtle--text">STATUS</div>
        <span :class="`stat-text ${statusColor()}--text`">{{ pilot.Status }}</span>
        <cc-combo-select :items="pilotStatuses" @set="pilot.Status = $event" />
      </v-col>
    </v-row>
    <cloud-manager ref="cloud" :pilot="pilot" @end-sync="syncing = false" />
  </v-container>
</template>

<script lang="ts">
import CloudManager from '../../../components/CloudManager.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import { Auth } from 'aws-amplify'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'ident-block',
  components: { CloudManager },

  data: () => ({
    pilotStatuses: [
      { text: 'Active', value: 'ACTIVE' },
      { text: 'Inactive', value: 'INACTIVE' },
      { text: 'Retired', value: 'RET' },
      { text: 'Missing In Action', value: 'MIA' },
      { text: 'Killed In Action', value: 'KIA' },
      { text: 'Unknown', value: 'UNKNOWN' },
    ],
    noteColor: '',
    notification: '',
    syncing: false,
    currentAuthedUser: null,
  }),
  async mounted() {
    await Auth.currentAuthenticatedUser().then(res => {
      this.currentAuthedUser = !!res.username
    })
  },
  methods: {
    statusColor(): string {
      switch (this.pilot.Status.toLowerCase()) {
        case 'active':
          return 'success'
          break
        case 'mia':
        case 'kia':
          return 'error'
        default:
          return 'text'
          break
      }
    },
    async copyCode() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      this.copyConfirm = true
      navigator.clipboard
        .writeText(this.pilot.GistCode)
        .then(() => self.$notify('Cloud share code copied to clipboard.', 'success'))
        .catch(() => self.$notify('Unable to copy cloud share code', 'error'))
    },
    async copyVault() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      this.copyConfirm = true
      navigator.clipboard
        .writeText(this.pilot.ShareCode)
        .then(() => self.$notify('Vault sync code copied to clipboard.', 'success'))
        .catch(() => self.$notify('Unable to copy vault sync code', 'error'))
    },
    sync() {
      this.syncing = true
      this.$refs.cloud.sync()
    },
  },
})
</script>
