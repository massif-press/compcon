<template>
  <div>
    <v-alert v-if="pilot.Status === 'KIA'" prominent outlined color="error" icon="mdi-skull">
      <div class="heading h2 text-center pb-2">KILLED IN ACTION</div>
      <v-row no-gutters>
        <v-col cols="auto" class="ml-auto">
          <v-menu offset-y offset-x>
            <template v-slot:activator="{ on }">
              <v-btn color="secondary" small outlined class="mx-2 fadeSelect" v-on="on">
                Flash Clone Pilot
              </v-btn>
            </template>
            <cc-confirmation
              content="This will clone the selected pilot. Cloned characters can’t join a mission in progress, and cloned characters receive a random quirk. Additional cloning and subjectivity imprinting adds further quirks."
              @confirm="setQuirk"
            />
          </v-menu>
        </v-col>
      </v-row>
    </v-alert>
    <v-row v-else-if="pilot.Quirk" align="center">
      <v-col>
        <div class="flavor-text font-weight-bold stark--text">CLONE QUIRK</div>
        <v-alert icon="mdi-dna" prominent dense color="primary" outlined>
          <div class="body-text stark--text font-weight-bold">{{ pilot.Quirk }}</div>
        </v-alert>
      </v-col>
      <v-col cols="auto">
        <v-menu offset-y offset-x>
          <template v-slot:activator="{ on }">
            <cc-tooltip
              title="Clear Quirk"
              content="This will remove this Pilot's clone quirt and clear their cloned status."
            >
              <v-btn small icon class="fadeSelect" v-on="on" @click="pilot.Quirk = ''">
                <v-icon small>close</v-icon>
              </v-btn>
            </cc-tooltip>
          </template>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import data from 'lancer-data'
import _ from 'lodash'

export default vueMixins(activePilot).extend({
  name: 'clone-block',
  methods: {
    setQuirk() {
      this.pilot.Callsign += '※'
      this.pilot.Name += ' (CLONE)'
      this.pilot.Status = 'Active'
      this.pilot.Heal()
      this.pilot.Quirk = _.sample(data.quirks)
    },
  },
})
</script>
