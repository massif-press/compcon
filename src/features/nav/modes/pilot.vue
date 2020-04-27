<template>
  <div>
    <v-btn text color="white" tile to="/pilot_management">Pilot Roster</v-btn>
    <v-divider v-if="pilot" vertical dark class="ml-2 mr-2" />
    <v-menu v-if="pilot" nudge-bottom="35px" open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn light tile color="white" elevation="0" v-on="on">
          {{ pilot.Callsign }}
          <v-icon light>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader>
        <v-list-item :to="`/active/${pilot.ID}`">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-activate</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Active Mode</v-list-item-title>
            <v-list-item-subtitle>
              Gameplay manager for running a pilot in LANCER sessions
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="pilotSheet()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-pilot</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pilot Sheet</v-list-item-title>
            <v-list-item-subtitle>
              View, edit, and update this pilot's information
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="mechHangar()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-frame</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mech Hangar</v-list-item-title>
            <v-list-item-subtitle>
              Build mechs and manage this pilot's library of mech configurations
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import activePilot from '../../pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'pilot-nav-mode',
  methods: {
    pilotSheet() {
      this.$router.push({ name: 'pilot_sheet' })
    },
    mechHangar() {
      this.$router.push({ name: 'mech_hangar' })
    },
  },
})
</script>
