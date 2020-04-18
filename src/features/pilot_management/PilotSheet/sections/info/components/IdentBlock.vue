<template>
  <v-container fluid class="pt-0">
    <v-row class="stat-text pt-0 pb-0">
      <v-col class="pt-0">
        <span class="overline">CALLSIGN</span>
        <cc-short-string-editor @set="pilot.Callsign = $event">
          {{ pilot.Callsign }}
        </cc-short-string-editor>
      </v-col>
      <v-col class="pt-0">
        <span class="overline">NAME</span>
        <cc-short-string-editor @set="pilot.Name = $event">{{ pilot.Name }}</cc-short-string-editor>
      </v-col>
      <v-col class="pt-0">
        <span class="overline">BACKGROUND</span>
        <br />
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
    <v-row class="stat-text pt-0 mt-n3">
      <v-col class="pt-0" dense>
        <span class="overline">RM-4://(IDENT)</span>
        <br />
        {{ pilot.ID }}
      </v-col>
      <v-col class="pt-0" dense>
        <span class="overline">OMNINET UPLINK ID</span>
        <br />
        <span v-if="pilot.CloudID">
          {{ pilot.CloudID }}
        </span>
        <span v-else class="stat-text error--text">
          // NOT SYNCED //
        </span>
        <cc-tooltip
          v-if="!syncing"
          inline
          :title="!pilot.CloudID || pilot.IsUserOwned ? 'Save to Cloud' : 'Update from Cloud'"
          :content="`Last Sync at:<br>${pilot.LastCloudUpdate}`"
        >
          <v-icon small class="fadeSelect" @click="sync()">mdi-cloud-sync</v-icon>
        </cc-tooltip>
        <cc-tooltip v-else simple inline content="Syncing...">
          <v-progress-circular indeterminate size="20" width="2" color="secondary" />
        </cc-tooltip>
      </v-col>
      <v-col />
    </v-row>
    <v-row class="stat-text pt-0 mt-n3">
      <v-col class="pt-0" dense>
        <span class="overline">PLAYER</span>
        <cc-short-string-editor @set="pilot.PlayerName = $event">
          {{ pilot.PlayerName || '---' }}
        </cc-short-string-editor>
      </v-col>
      <v-col class="pt-0" dense>
        <span class="overline">FACTION</span>
        <br />
        ---
        <cc-tooltip simple inline content="Feature In Development">
          <v-icon small class="fadeSelect" @click.stop>
            mdi-circle-edit-outline
          </v-icon>
        </cc-tooltip>
      </v-col>
      <v-col class="pt-0" dense>
        <span class="overline">STATUS</span>
        <br />
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
    setCloudID(id: string) {
      if (id && id != '// NOT SYNCED //') {
        this.pilot.CloudID = id
      }
    },
    sync() {
      this.syncing = true
      this.$refs.cloud.sync()
    },
  },
})
</script>
