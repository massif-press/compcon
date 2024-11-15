<template>
  <div v-if="mech.ID">
    <div class="mt-8" :style="`background-color: ${color}`">
      <cc-short-string-editor
        large
        :readonly="mech.Pilot.IsRemote"
        :placeholder="mech.Name"
        @set="mech.Name = $event">
        <span class="heading text-white" style="font-size: 75px; line-height: 85px">
          {{ mech.Name }}
        </span>
      </cc-short-string-editor>
    </div>

    <v-row align="center" justify="center" dense class="heading h2">
      <v-col cols="auto">
        <v-icon :icon="mech.Frame.Manufacturer.Icon" />
      </v-col>
      <v-col cols="auto">
        <span :style="`color: ${color}`">
          {{ mech.Frame.Manufacturer.Name }}
        </span>
        <span class="text-text pl-2">{{ mech.Frame.Name }}</span>
      </v-col>
      <v-col cols="auto" class="px-0 ml-n2">
        <v-btn icon size="small" variant="plain" @click="($refs as any).frameInfoDialog.show()">
          <v-icon icon="mdi-information-outline" />
        </v-btn>
        <cc-solo-dialog
          ref="frameInfoDialog"
          icon="cc:frame"
          :color="color"
          no-actions
          large
          :title="`${mech.Frame.Manufacturer.Name} ${mech.Frame.Name}`">
          <v-container class="px-12 pt-1">
            <p v-html-safe="mech.Frame.Description" class="flavor-text text-text" />
          </v-container>
        </cc-solo-dialog>
      </v-col>
    </v-row>

    <mech-nav
      :selected="0"
      :pilot="pilot"
      :mech="mech"
      :mechID="mech.ID"
      @delete="($refs as any).deleteDialog.show()" />

    <v-container>
      <v-row align="start">
        <v-col>
          <section-header title="Operator Notes" />
          <cc-rich-text-area
            v-model="mech.Notes"
            :readonly="mech.Pilot.IsRemote"
            class="mb-3 mt-2" />
          <license-requirement-block :mech="mech" :color="color" />
          <trait-block :mech="mech" :color="color" />
        </v-col>
        <v-col cols="auto">
          <cc-img :src="mech.Portrait" width="22vw" position="top center" />
          <div class="text-right mt-n3">
            <v-btn
              v-if="!mech.Pilot.IsRemote"
              variant="tonal"
              color="secondary"
              size="small"
              @click="($refs as any).imageSelector.open()">
              <v-icon start>mdi-circle-edit-outline</v-icon>
              Set Mech Image
            </v-btn>
          </div>

          <cc-image-selector ref="imageSelector" :item="mech" type="mech" />
        </v-col>
      </v-row>

      <attributes-block :color="color" :mech="mech" :pilot="pilot" />

      <core-block :mech="mech" :color="color" />

      <loadout-block :mech="mech" />

      <delete-mech-dialog ref="deleteDialog" :mech="mech" @delete="deleteMech()" />
    </v-container>
  </div>
</template>

<script lang="ts">
import MechNav from './components/MechNav.vue';
import LicenseRequirementBlock from './sections/license_requirements/index.vue';
import TraitBlock from './sections/TraitBlock.vue';
import AttributesBlock from './sections/attributes/index.vue';
import DeleteMechDialog from '../hangar/components/DeleteMechDialog.vue';
import { Pilot, Mech } from '@/class';
import { PilotStore } from '@/stores';
import CoreBlock from './sections/CoreBlock.vue';
import LoadoutBlock from './sections/LoadoutBlock.vue';
import SectionHeader from '../components/SectionHeader.vue';

export default {
  name: 'mech-sheet',
  components: {
    MechNav,
    LicenseRequirementBlock,
    TraitBlock,
    AttributesBlock,
    DeleteMechDialog,
    CoreBlock,
    LoadoutBlock,
    SectionHeader,
  },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
    mechID: {
      type: String,
      required: true,
    },
  },
  computed: {
    pilot(): Pilot {
      return PilotStore().Pilots.find((p) => p.ID === this.pilotID) as Pilot;
    },
    mech(): Mech {
      if (!this.pilot) return {} as Mech;
      return this.pilot.Mechs.find((m: Mech) => m.ID === this.mechID) as Mech;
    },
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
    },
  },
  methods: {
    deleteMech() {
      this.$router.push({ name: 'mech_hangar' });
      this.pilot.RemoveMech(this.mech);
    },
  },
};
</script>
