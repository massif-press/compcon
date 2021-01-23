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
        <span v-if="pilot.IsLocallyOwned">Current User</span>
        <span v-else-if="!pilot.IsLocallyOwned">Remote Sync</span>
        <span v-else class="stat-text error--text">
          // NOT SYNCED //
        </span>
        <cc-tooltip inline title="Copy Share Code" :content="`Last Sync at:<br>${pilot.LastSync}`">
          <v-icon small class="fadeSelect" @click="copyCode()">mdi-cloud-sync</v-icon>
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
  }),
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
        .writeText(this.pilot.ShareCode)
        .then(() => self.$notify('Cloud share code copied to clipboard.', 'success'))
        .catch(() => self.$notify('Unable to copy cloud share code', 'error'))
    },
    sync() {
      this.syncing = true
      this.$refs.cloud.sync()
    },
  },
})
</script>
