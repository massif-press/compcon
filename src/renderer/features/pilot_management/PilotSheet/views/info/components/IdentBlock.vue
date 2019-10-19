<template>
  <v-container fluid class="pt-0">
    <v-row class="stat-text pt-0 pb-0" dense>
      <v-col cols="4" dense class="pt-0">
        <span class="overline">CALLSIGN</span>
        <cc-short-string-editor @set="pilot.Callsign = $event">{{ pilot.Callsign }}</cc-short-string-editor>
      </v-col>
      <v-col cols="4" dense>
        <span class="overline">NAME</span>
        <cc-short-string-editor @set="pilot.Name = $event">{{ pilot.Name }}</cc-short-string-editor>
      </v-col>
      <v-col cols="4" dense>
        <span class="overline">BACKGROUND</span>
        <br />
        <cc-short-string-editor
          class="d-inline"
          @set="pilot.Background = $event"
        >{{ pilot.Background }}</cc-short-string-editor>
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
    <v-row class="stat-text pt-0 mt-n3" dense>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">RM-4://(IDENT)</span>
        <br />
        {{ pilot.ID }}
      </v-col>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">OMNINET UPLINK STATUS</span>
        <br />
        <span class="stat-text error--text">// NOT SYNCHED //</span>
      </v-col>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">UN::OMNISYNC ID</span>
        <br />---
        <v-icon small class="fadeSelect" @click="''">mdi-cloud-sync</v-icon>
      </v-col>
    </v-row>
    <v-row class="stat-text pt-0 mt-n3" dense>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">PLAYER</span>
        <cc-short-string-editor @set="pilot.PlayerName = $event">{{ pilot.PlayerName || '---' }}</cc-short-string-editor>
      </v-col>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">FACTION</span>
        <br />---
        <cc-tooltip simple inline content="Feature In Development">
          <v-icon small class="fadeSelect" @click="''">mdi-circle-edit-outline</v-icon>
        </cc-tooltip>
      </v-col>
      <v-col cols="4" class="pt-0" dense>
        <span class="overline">STATUS</span>
        <br />
        <span :class="`stat-text ${statusColor()}--text`">{{ pilot.Status }}</span>
        <cc-simple-select :items="pilotStatuses" @set="pilot.Status = $event" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'ident-block',
  data: () => ({
    pilotStatuses: [
      { text: 'Active', value: 'ACTIVE' },
      { text: 'Inactive', value: 'INACTIVE' },
      { text: 'Retired', value: 'RET' },
      { text: 'Missing In Action', value: 'MIA' },
      { text: 'Killed In Action', value: 'KIA' },
      { text: 'Unknown', value: 'UNKNOWN' },
    ],
  }),
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
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
  },
})
</script>