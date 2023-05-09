<template>
  <div>
    <v-alert
      v-if="pilot.Status === 'KIA' || pilot.IsDead"
      prominent
      density="compact"
      variant="outlined"
      color="error"
    >
      <v-icon slot="prepend" size="80" class="mr-2">mdi-skull</v-icon>
      <div :class="`heading ${$vuetify.display.mdAndUp ? 'h1' : 'h3'} pb-2 text-center`">
        KILLED IN ACTION
      </div>
      <div style="position: relative">
        <div
          :style="
            $vuetify.display.mdAndUp
              ? 'position: absolute; bottom: -3px; right: -3px'
              : 'text-align: center'
          "
        >
          <v-menu offset-y offset-x>
            <template #activator="{ props }">
              <v-btn color="secondary" x-small variant="outlined" v-bind="props"
                >Flash Clone Pilot</v-btn
              >
            </template>
            <cc-confirmation
              content="This will clone the selected pilot. Cloned characters can’t join a mission in progress, and cloned characters receive a random quirk. Additional cloning and subjectivity imprinting adds further quirks."
              @confirm="setQuirk"
            />
          </v-menu>
          <v-menu offset-y offset-x>
            <template #activator="{ props }">
              <v-btn color="pimary" x-small class="fade-select ml-3" v-bind="props">
                <v-icon small left>mdi-reload</v-icon>
                Revert
              </v-btn>
            </template>
            <cc-confirmation
              content="This will restore the selected pilot and clear the KIA and Down and Out statuses."
              @confirm="pilot.Restore()"
            />
          </v-menu>
        </div>
      </div>
    </v-alert>
    <div v-if="pilot.Quirks.length && !hideQuirks">
      <div class="flavor-text font-weight-bold text-stark">CLONE QUIRKS</div>
      <v-row v-for="(q, i) in pilot.Quirks" density="compact" align="start">
        <v-col>
          <v-alert icon="mdi-dna" prominent density="compact" color="primary" outlined>
            <v-textarea
              :value="q"
              density="compact"
              hide-details
              rows="1"
              auto-grow
              class="body-text"
              :readonly="readonly"
              @change="updateQuirk(i, $event)"
              @blur="pilot.SaveController.save()"
            />
          </v-alert>
        </v-col>
        <v-col v-if="!readonly" cols="auto">
          <v-menu offset-y offset-x>
            <template #activator="{ props }">
              <cc-tooltip content="Remove Clone Quirk">
                <v-btn icon class="fade-select" v-bind="props" @click="pilot.RemoveQuirk(i)">
                  <v-icon large>close</v-icon>
                </v-btn>
              </cc-tooltip>
            </template>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import _ from 'lodash';

export default {
  name: 'clone-block',
  props: {
    hideQuirks: { type: Boolean },
    readonly: { type: Boolean },
  },
  methods: {
    setQuirk() {
      if (!this.pilot.Callsign.includes('※')) this.pilot.Callsign += '※';
      if (!this.pilot.Callsign.includes('※')) this.pilot.Name += '※';
      this.pilot.Heal();
      const compendium = CompendiumStore();
      this.pilot.AddQuirk(_.sample(compendium.Tables.quirks));
    },
    updateQuirk(index, str) {
      this.$set(this.pilot.Quirks, index, str);
    },
  },
};
</script>
