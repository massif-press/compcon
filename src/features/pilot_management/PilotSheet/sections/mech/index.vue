<template>
  <div>
    <header-overlay :mech="mech" />
    <mech-nav :selected="0" :pilot="pilot" :mech="mech" @delete="$refs.deleteDialog.show()" />
    <v-row no-gutters>
      <v-col cols="auto" class="mt-4">
        <cc-title large :color="color">{{ mech.Name }}&emsp;</cc-title>
        <cc-logo size="large" :source="mech.Frame.Manufacturer" />
        <span class="heading h2" style="position: relative; top: -11px">
          <span :style="`color: ${color}`" class="pt-n3">{{ mech.Frame.Manufacturer.Name }}</span>
          <span class="text--text">{{ mech.Frame.Name }}</span>
          <v-icon right class="fadeSelect mt-n1" @click="$refs.frameInfoDialog.show()">
            mdi-information-outline
          </v-icon>
          <cc-solo-dialog
            ref="frameInfoDialog"
            icon="cci-frame"
            :color="color"
            no-confirm
            large
            :title="`${mech.Frame.Manufacturer.Name} ${mech.Frame.Name}`"
          >
            <p class="flavor-text mt-3 text--text" v-html="mech.Frame.Description" />
          </cc-solo-dialog>
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto mt-4">
        <cc-tooltip v-if="!mech.IsActive" simple content="Set as Active">
          <v-btn icon @click.stop="pilot.ActiveMech = mech">
            <v-icon x-large>cci-activate</v-icon>
          </v-btn>
        </cc-tooltip>
        <v-icon v-else class="mt-n1" x-large color="success">cci-activate</v-icon>
      </v-col>
    </v-row>
    <cc-mech-status-alert
      v-for="s in mech.StatusString"
      :key="`status-${s}`"
      :type="s"
      @clear-ejected="mech.Ejected = false"
      @clear-status="mech.Repair()"
    />
    <v-row align="center">
      <v-col cols="8">
        <v-row class="px-3">
          <v-col>
            <div class="ml-n3">
              <cc-title small :color="color" class="pl-3">Operator Notes</cc-title>
            </div>
            <v-textarea
              v-model="mech.Notes"
              class="mt-2"
              outlined
              :color="color"
              rows="2"
              auto-grow
              label="Notes"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row class="px-3">
          <license-requirement-block :mech="mech" :color="color" />
        </v-row>
        <v-row class="px-3">
          <trait-block :mech="mech" :color="color" />
        </v-row>
      </v-col>
      <v-col cols="4">
        <div class="text-center">
          <div class="border">
            <v-img
              :key="mech.Image"
              :src="mech.Portrait"
              min-height="100%"
              max-width="100%"
              position="top center"
            />
          </div>
          <v-btn
            outlined
            color="secondary"
            small
            block
            class="fadeSelect"
            @click="$refs.imageSelector.open()"
          >
            <v-icon left>mdi-circle-edit-outline</v-icon>
            Set Mech Image
          </v-btn>

          <cc-image-selector-web v-if="$platform" ref="imageSelector" :item="mech" type="mech" />
          <cc-image-selector v-else ref="imageSelector" :item="mech" type="mech" />
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-n6 mb-2 px-3">
      <attributes-block :color="color" :mech="mech" :pilot="pilot" />
    </v-row>
    <cc-title small :color="color">
      {{ mech.Frame.Source }} {{ mech.Frame.Name }} CORE System
    </cc-title>
    <core-item :core-system="mech.Frame.CoreSystem" :color="color" />
    <cc-title small :color="color" class="mb-2">Equipment Loadout</cc-title>
    <cc-mech-loadout :mech="mech" class="px-3" />
    <delete-mech-dialog ref="deleteDialog" :mech="mech" @delete="deleteMech()" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechNav from './components/MechNav.vue'
import HeaderOverlay from './components/HeaderOverlay.vue'
import CoreItem from './components/CoreItem.vue'
import LicenseRequirementBlock from './sections/license_requirements/index.vue'
import TraitBlock from './sections/traits/index.vue'
import AttributesBlock from './sections/attributes/index.vue'
import DeleteMechDialog from '../hangar/components/DeleteMechDialog.vue'
import { Pilot, Mech } from '@/class'

export default Vue.extend({
  name: 'mech-sheet',
  components: {
    MechNav,
    LicenseRequirementBlock,
    HeaderOverlay,
    TraitBlock,
    AttributesBlock,
    CoreItem,
    DeleteMechDialog,
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
      return this.$store.state.management.Pilots.find(p => p.ID === this.pilotID)
    },
    mech(): Mech {
      return this.pilot.Mechs.find((m: Mech) => m.ID === this.mechID)
    },
    color() {
      return this.mech.Frame.Manufacturer.Color
    },
  },
  methods: {
    deleteMech() {
      this.$router.push({ name: 'mech_hangar' })
      this.pilot.RemoveMech(this.mech)
    },
  },
})
</script>
