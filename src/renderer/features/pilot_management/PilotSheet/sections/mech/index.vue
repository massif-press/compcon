<template>
  <div>
    <header-overlay :mech="mech" />
    <mech-nav :selected="0" :pilot="pilot" :mech="mech" />
    <v-row no-gutters>
      <v-col cols="auto">
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
      <v-col cols="auto" class="ml-2">
        <cc-tooltip v-if="!mech.IsActive" simple content="Set as Active">
          <v-btn icon @click.stop="pilot.ActiveMech = mech">
            <v-icon x-large>cci-activate</v-icon>
          </v-btn>
        </cc-tooltip>
        <v-icon v-else class="mt-n1" x-large color="success">cci-activate</v-icon>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="8">
        <v-row v-if="mech.StatusString">
          <status-alert :type="mech.StatusString" />
        </v-row>
        <v-row>
          <v-col>
            <cc-title small :color="color">Operator Notes</cc-title>
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
        <v-row>
          <license-requirement-block :mech="mech" :color="color" />
        </v-row>
        <v-row>
          <trait-block :mech="mech" :color="color" />
        </v-row>
      </v-col>
      <v-col cols="4">
        <div class="text-center">
          <div class="border">
            <v-img :src="mech.Portrait" min-height="100%" max-width="100%" position="top center" />
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

          <cc-image-selector ref="imageSelector" :pilot="pilot" />
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-n6 mb-2">
      <attributes-block :color="color" :mech="mech" :pilot="pilot" />
    </v-row>
    <cc-title small :color="color">
      {{ mech.Frame.Source }} {{ mech.Frame.Name }} CORE System
    </cc-title>
    <core-item :core-system="mech.Frame.CoreSystem" :color="color" />
    <loadout-block :color="color" :mech="mech" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechNav from './components/MechNav.vue'
import StatusAlert from './components/StatusAlert.vue'
import HeaderOverlay from './components/HeaderOverlay.vue'
import CoreItem from './components/CoreItem.vue'
import LicenseRequirementBlock from './sections/license_requirements/index.vue'
import TraitBlock from './sections/traits/index.vue'
import AttributesBlock from './sections/attributes/index.vue'
import LoadoutBlock from './sections/loadout/index.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'mech-sheet',
  components: {
    MechNav,
    LicenseRequirementBlock,
    StatusAlert,
    HeaderOverlay,
    TraitBlock,
    AttributesBlock,
    LoadoutBlock,
    CoreItem,
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
  data: () => ({
    pilot: {},
    mech: {},
    color: '#000',
  }),
  mounted() {
    const store = getModule(PilotManagementStore, this.$store)
    this.pilot = store.ActivePilot
    this.mech = store.ActivePilot.Mechs.find(x => x.ID === this.mechID)
    this.color = this.mech.Frame.Manufacturer.Color
  },
})
</script>
