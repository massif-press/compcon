<template>
  <v-card-text>
    <div class="text-center body-text light-panel mb-4" style="border-radius: 3px">
      Duplicating or Cloning a pilot will remove any Vault links, saving the copied Pilot as a new
      character on your account
    </div>

    <v-row justify="space-around">
      <v-col cols="12" md="6">
        <cc-button
          prepend-icon="mdi-content-copy"
          details="test"
          block
          color="primary"
          tooltip="This will create a copy of this pilot data, registered to your pilot roster."
          @click="copyPilot">
          Duplicate Pilot
        </cc-button>
      </v-col>
      <v-col cols="12" md="6">
        <cc-button
          prepend-icon="mdi-dna"
          large
          block
          color="primary"
          tooltip="This will clone the selected pilot. Cloned characters can’t join a mission in progress,
            and cloned characters receive a random quirk. Additional cloning and subjectivity
            imprinting adds further quirks."
          :disabled="!!quirk"
          @click="rollQuirk">
          Flash Clone Pilot
        </cc-button>
      </v-col>
    </v-row>
    <v-scale-transition>
      <div v-if="quirk">
        <cc-alert color="deep-orange" variant="tonal" class="my-4">
          <div class="text-center heading h3 mb-2">
            <v-icon size="small" class="pb-1" start icon="mdi-alert" />
            <b style="letter-spacing: 15px">WARNING</b>
            <v-icon size="small" class="pb-1" icon="mdi-alert" />
          </div>
          <div class="text-cc-overline" :class="!mobile && 'px-2'">
            Any organizations, individuals, or technologies engaging in or facilitating whole-body
            facsimile cloning are bound by the First Contact Accords of 3002. Any activities that
            violate the principles set forth in the Accords are prohibited, including but not
            limited to:
            <ul class="pb-1">
              <li>
                Reproduction of the subjective personage of a sentient being or other subjective
                continuity in whole or in part.
              </li>
              <li>
                Transfer or the subjective personage of a sentient being or other subjective
                continuity into a manufactured or cultivated substrate.
              </li>
              <li>
                Emulation of a sentient individual's subjective personage in a manufactured or
                cultivated substrate.
              </li>
              <li>
                Intentional decorporealization of a sentient being or other subjective continuity.
              </li>
              <li>
                Engaging in any activity that could potentially subject a sentient being or other
                subjective continuity to process deordering, schizo-ontological dissonance,
                personality dissolution, or other any form of subjective disintegration.
              </li>
            </ul>
            <v-divider class="pb-1" />
            <div class="text-center">
              All forms of whole-subjectivity rapid process cloning are prohibited under Union
              jurisdiction. Any persons found to be in violation of this statute will be subject to
              prosecution by the Union Department of Justice and Human Resource Facsimile Rights
              Department.
            </div>
          </div>
        </cc-alert>

        <v-row align="center" justify="center">
          <v-col cols="12" md="8">
            <div class="text-overline">CLONE QUIRK</div>
            <cc-alert density="compact" color="primary">
              <v-card-text :class="mobile && 'px-0'">
                {{ quirk }}
              </v-card-text>
            </cc-alert>
          </v-col>
          <v-col cols="auto">
            <cc-button
              v-if="!mobile"
              icon="mdi-dice-6"
              variant="outlined"
              tooltip="Reroll quirk"
              @click="rollQuirk" />
            <cc-button v-else prepend-icon="mdi-dice-6" @click="rollQuirk">Reroll Quirk</cc-button>
          </v-col>
        </v-row>

        <v-row v-if="quirk" align="center" justify="center">
          <v-col cols="12" md="8">
            <cc-button large block tile color="secondary" @click="clonePilot">
              Decant Flash Clone
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </v-scale-transition>
  </v-card-text>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
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
