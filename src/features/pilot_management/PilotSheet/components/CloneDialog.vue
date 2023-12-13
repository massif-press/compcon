<template>
  <cc-solo-dialog ref="dialog" icon="mdi-dna" large no-confirm title="Clone Pilot">
    <v-card-text>
      <div class="text-center body-text light-panel mb-4" style="border-radius: 3px">
        Duplicating or Cloning a pilot will remove any Vault links, saving the copied Pilot as a new
        character on your account
      </div>

      <v-row density="compact" justify="space-around">
        <v-col cols="5" class="text-center">
          <cc-tooltip
            inline
            title="Duplication"
            content="This will create a copy of this pilot data, registered to your pilot roster."
          >
            <v-btn large block color="primary" @click="copyPilot">Duplicate Pilot</v-btn>
          </cc-tooltip>
        </v-col>
        <v-col cols="5" class="text-center">
          <cc-tooltip
            inline
            title="Clone"
            content="This will clone the selected pilot. Cloned characters can’t join a mission in progress, and cloned characters receive a random quirk. Additional cloning and subjectivity imprinting adds further quirks."
          >
            <v-btn large block color="primary" :disabled="!!quirk" @click="rollQuirk">
              Flash Clone Pilot
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
      <v-scale-transition>
        <div v-if="quirk">
          <v-alert color="deep-orange" variant="tonal" density="compact" class="my-4">
            <div class="text-center pb-1">
              <v-icon size="small" icon="mdi-alert" /><b style="letter-spacing: 10px"> WARNING</b>
              <v-icon size="small" icon="mdi-alert" />
            </div>
            <div class="text-overline" style="line-height: 18px">
              Any organizations, individuals, or technologies facilitating whole-body facsimile
              cloning are bound by the First Contact Accords of 3002. Any activities that violate
              the principles set forth in the Accords are prohibited, including, but not limited to:
              <ul class="pb-1">
                <li>
                  Reproducing the subjective personage of a sentient being in whole or in part.
                </li>
                <li>
                  Transferring the subjective personage of a sentient being into a manufactured or
                  cultivated substrate.
                </li>
                <li>
                  Emulation of a sentient being's subjective personage in a manufactured or
                  cultivated substrate.
                </li>
                <li>
                  Intentional decorporealization of a sentient being or other subjective continuity.
                </li>
              </ul>
              <v-divider class="pb-1" />
              <div class="text-center">
                All forms of whole-subjectivity rapid process cloning are prohibited under Union
                jurisdiction. Any persons found to be in violation of this statute will be subject
                to prosecution by the Union Department of Justice and Human Resource's Facsimile
                Rights Department.
              </div>
            </div>
          </v-alert>

          <v-row align="center">
            <v-col>
              <div class="text-overline">CLONE QUIRK</div>
              <v-alert density="compact" color="primary" variant="outlined" left>
                <div class="body-text text-stark font-weight-bold">
                  {{ quirk }}
                </div>
              </v-alert>
            </v-col>
            <v-col cols="auto">
              <cc-tooltip simple content="Reroll quirk">
                <v-btn icon large @click="rollQuirk">
                  <v-icon color="secondary" large>mdi-dice-6</v-icon>
                </v-btn>
              </cc-tooltip>
            </v-col>
          </v-row>
          <v-row v-if="quirk" align="center" justify="center">
            <v-col cols="6">
              <v-btn large block tile color="secondary darken-2" @click="clonePilot">
                Decant Flash Clone
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-scale-transition>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { CompendiumStore, PilotStore } from '@/stores';
import _ from 'lodash';
import { Pilot } from '@/class';

export default {
  name: 'clone-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    quirk: null,
  }),
  methods: {
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      this.quirk = null;
      (this.$refs.dialog as any).hide();
    },
    rollQuirk() {
      const compendium = CompendiumStore();
      this.quirk = _.sample(compendium.Tables.quirks);
    },
    clonePilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot as Pilot));
      newPilot.CloudController.reset();
      newPilot.RenewID();
      this.pilot.Name += '※';
      this.pilot.AddQuirk(this.quirk);
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      this.hide();
      this.$router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    },
    copyPilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot as Pilot));
      newPilot.CloudController.reset();
      newPilot.RenewID();
      newPilot.Callsign += '″';
      newPilot.Name += ' (COPY)';
      newPilot.Status = 'ACTIVE';
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      this.hide();
      this.$router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    },
  },
};
</script>
