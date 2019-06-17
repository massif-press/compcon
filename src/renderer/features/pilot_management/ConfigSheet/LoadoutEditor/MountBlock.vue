<template>
  <!-- <div v-if="!mount.imparm || (mount.imparm && hasImpArm)"> -->
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">
        {{ mount.MountName }}
        <v-tooltip top>
          <v-btn
            v-if="isCbVisible()"
            slot="activator"
            icon
            class="ma-0"
            @click="
              coreBonusSelectorModal = true
              cbsLoader = true
            "
          >
            <v-icon :color="'yellow'">mdi-progress-download</v-icon>
          </v-btn>
          <span>Apply CORE Bonus Effects</span>
        </v-tooltip>
      </span>
      <v-card-text v-if="mount.IsLocked" class="bordered ml-3 pt-4">
        <v-card color="grey darken-1">
          <v-card-text class="blockquote text-xs-center">
            LOCKED
            <br />
            <span class="caption">SUPERHEAVY WEAPON BRACING</span>
            <br />
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text v-else class="bordered ml-3 pt-4">
        <mech-weapon-item
          v-for="(ws, i) in mount.Slots"
          :key="`ws_${i}`"
          :weapon-slot="ws"
          :mount="mount"
          :loadout="loadout"
          :maxSP="maxSP"
          :no-mod="integratedWeapon"
        />

        <v-card
          v-for="(cb, j) in mount.BonusEffects"
          :key="`mb_${j}`"
          color="grey darken-1"
          class="ma-2"
        >
          <v-card-text class="text-xs-center">
            <b>{{ cb.Name }}</b>
            <br />
            <i class="caption">{{ cb.MountedEffect }}</i>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- CB Benefit -->
    <v-dialog v-model="coreBonusSelectorModal" width="70vw" lazy hide-overlay>
      <v-card dark>
        <core-benefit-selector
          v-if="cbsLoader"
          :loadout="loadout"
          :mount="mount"
          @close="coreBonusSelectorModal = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import MechWeaponItem from './MechWeaponItem.vue'
import WeaponTable from './WeaponTable.vue'
import CoreBenefitSelector from './CoreBenefitSelector.vue'
import ModTable from './ModTable.vue'
import { LazyDialog } from '../../components/UI'
import { Mount, MechWeapon, WeaponMod, Pilot } from '@/class'

export default Vue.extend({
  name: 'mount-block',
  props: {
    mount: Object,
    loadout: Object,
    maxSP: Number,
    integratedWeapon: Boolean,
  },
  data: () => ({
    weaponSelectorModal: false,
    shLockDialog: false,
    coreBonusSelectorModal: false,
    cbsLoader: false,
    weaponIndex: 0,
    size: '',
    current_equip: {} || null,
    current_equip_mod: {},
    pendingSuperheavy: {},
    modModal: false,
    modLoader: false,
    modWeapon: {},
    weaponReload: 0,
  }),
  components: {
    MechWeaponItem,
    WeaponTable,
    CoreBenefitSelector,
    ModTable,
    LazyDialog,
  },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
  methods: {
    isCbVisible(): boolean {
      return (
        !this.integratedWeapon &&
        (this.pilot.has('CoreBonus', 'hardpoints') ||
          this.pilot.has('CoreBonus', 'burnout') ||
          this.pilot.has('CoreBonus', 'retrofit'))
      )
    },
  },
})
</script>
