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
    <v-row class="stat-text pt-0" dense>
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'ident-block',
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
  },
})
</script>