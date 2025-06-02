<template>
  <div v-if="mech.ID">
    <div class="mt-4 text-center text-white" :style="`background-color: ${color}`">
      <cc-short-string-editor
        :readonly="mech.Pilot.IsRemote"
        :placeholder="mech.Name"
        :max-width="mobile && '90vw'"
        justify="center"
        :absolute="mobile"
        @set="mech.Name = $event">
        <span class="heading" style="font-size: clamp(12px, 6.5vw, 50px)">
          {{ mech.Name }}
        </span>
      </cc-short-string-editor>
    </div>

    <div class="heading h3 text-center pt-1" style="line-height: 0">
      <v-icon start size="small" class="mb-1" :icon="mech.Frame.Manufacturer.Icon" />
      <span :style="`color: ${color}`">
        {{ mech.Frame.Manufacturer.Name }}
      </span>
      <br v-if="mobile" />
      <span class="text-text pl-2">{{ mech.Frame.Name }}</span>
      <cc-dialog
        ref="frameInfoDialog"
        icon="cc:frame"
        :color="color"
        no-actions
        large
        :title="`${mech.Frame.Manufacturer.Name} ${mech.Frame.Name}`">
        <template #activator="{ open }">
          <v-btn icon size="x-small" variant="plain" @click="open">
            <v-icon size="large" icon="mdi-information-outline" />
          </v-btn>
        </template>

        <p class="pa-2" v-html-safe="mech.Frame.Description" />
      </cc-dialog>
    </div>

    <div v-if="mobile" class="mb-2">
      <cc-img :src="mech.Portrait" style="max-height: 80vh" />
      <div class="text-right mt-n3">
        <cc-modal v-if="!mech.Pilot.IsRemote" title="set mech image" icon="cc:frame">
          <template #activator="{ open }">
            <cc-button
              variant="tonal"
              color="secondary"
              size="small"
              prepend-icon="mdi-circle-edit-outline"
              @click="open">
              Set Mech Image
            </cc-button>
          </template>
          <cc-image-selector ref="imageSelector" :item="mech" type="mech" />
        </cc-modal>
      </div>
    </div>

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

          <section-header title="Licenses Required" />
          <div class="pt-1">
            <requirement-item v-for="l in reqLicenses" :license="l" />
          </div>

          <status-alerts :mech="mech" />

          <section-header
            :title="`${mech.Frame.Source} ${mech.Frame.Name} Frame Traits`"
            class="mt-2" />
          <cc-trait-item v-for="t in mech.Frame.Traits" :trait="t" :color="color" class="ma-3" />
        </v-col>

        <v-col v-if="!mobile" cols="auto">
          <cc-img :src="mech.Portrait" width="22vw" position="top center" />
          <div class="text-right mt-n3">
            <cc-modal v-if="!mech.Pilot.IsRemote" title="set mech image" icon="cc:frame">
              <template #activator="{ open }">
                <cc-button
                  variant="tonal"
                  color="secondary"
                  size="small"
                  prepend-icon="mdi-circle-edit-outline"
                  @click="open">
                  Set Mech Image
                </cc-button>
              </template>
              <cc-image-selector ref="imageSelector" :item="mech" type="mech" />
            </cc-modal>
          </div>
        </v-col>
      </v-row>

      <attributes-block :color="color" :mech="mech" :pilot="pilot" />

      <section-header
        :title="`${mech.Frame.Source} ${mech.Frame.Name} Core System`"
        class="mt-6 mb-1" />
      <frame-core-system-panel :cs="mech.Frame.CoreSystem" />

      <!-- <core-block :mech="mech" :color="color" /> -->

      <loadout-block :mech="mech" />
    </v-container>
  </div>
</template>

<script lang="ts">
import MechNav from './components/MechNav.vue';
import RequirementItem from './components/RequirementItem.vue';
import AttributesBlock from './sections/attributes/index.vue';
import { Pilot, Mech } from '@/class';
import { PilotStore } from '@/stores';
import LoadoutBlock from './sections/LoadoutBlock.vue';
import SectionHeader from '../components/SectionHeader.vue';
import { FrameCoreSystemPanel } from '@/ui/components/cards/frame';
import StatusAlerts from './components/StatusAlerts.vue';

export default {
  name: 'mech-sheet',
  components: {
    MechNav,
    RequirementItem,
    AttributesBlock,
    LoadoutBlock,
    SectionHeader,
    FrameCoreSystemPanel,
    StatusAlerts,
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
  mounted() {
    if (this.mech && this.mech.Frame)
      document.title = `${this.mech.Name} (${this.mech.Frame.Source} ${this.mech.Frame.Name})`;
  },
  computed: {
    mobile(): Boolean {
      return this.$vuetify.display.smAndDown;
    },
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
    reqLicenses() {
      return this.mech.RequiredLicenses;
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
