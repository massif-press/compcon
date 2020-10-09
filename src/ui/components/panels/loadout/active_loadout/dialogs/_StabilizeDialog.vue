<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--full">
        <v-icon x-large>mdi-hexagon-slice-6</v-icon>
        Stabilize
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="flavor-text pb-0">
        <p class="pt-2 text--text">
          Enact emergency protocols in order to purge your mech‘s systems of excess heat, repair
          your chassis where you can, and buy your system time to eliminate hostile code.
        </p>
        <div class="heading h3 error--text text-center">
          <b>// WARNING: THIS ACTION CANNOT BE UNDONE //</b>
        </div>
        <p class="text-center heading h3 pb-0">
          <span class="flavor-text">Choose one of the following:</span>
          <v-radio-group v-model="stabilizeMajor">
            <v-radio
              label="Cool Mech, resetting the heat gauge and ending the exposed status"
              value="cool"
            />
            <v-radio
              :label="
                `Spend 1 Repair to refill HP to maximum. ${
                  !mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //' : ''
                }`
              "
              value="repair"
              :disabled="!mech.CurrentRepairs"
            />
          </v-radio-group>
          <v-divider class="mt-2 mb-2 ml-5 mr-5" />
          <span class="flavor-text">And one of the following:</span>
          <v-radio-group v-model="stabilizeMinor">
            <v-radio label="Reload all weapons with the Loading Tag" value="reload" />
            <v-radio
              label="End all Burn currently affecting your mech"
              value="end_burn"
              :disabled="mech.Burn === 0"
            />
            <v-radio
              label="End a condition affecting your mech"
              value="end_self_condition"
              :disabled="!mech.Conditions.length"
            />
            <v-radio
              label="End a condition affecting an adjacent ally"
              value="end_ally_condition"
            />
          </v-radio-group>
        </p>
      </v-card-text>

      <v-slide-y-reverse-transition>
        <div v-if="complete">
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" tile @click="dialog = false">DISMISS</v-btn>
          </v-card-actions>
        </div>
      </v-slide-y-reverse-transition>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { RangeType, WeaponType, MechWeapon, WeaponSize } from '@/class'
import { DamageType } from '@/classes/enums'
import Vue from 'vue'
// import WeaponAttack from '../components/_WeaponAttack.vue'

export default Vue.extend({
  name: 'improvised-attack-dialog',
  // components: { WeaponAttack },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    complete: false,
  }),
  computed: {
    item(): MechWeapon {
      return new MechWeapon({
        id: 'improv_attack',
        name: 'Improvised Attack',
        mount: WeaponSize.Main,
        type: WeaponType.Melee,
        damage: [
          {
            type: DamageType.Kinetic,
            val: '1d6',
          },
        ],
        range: [
          {
            type: RangeType.Threat,
            val: 1,
          },
        ],
        source: 'GMS',
        license: 'GMS',
        license_level: 0,
        description: '',
        selected_profile: 0,
        sp: 0,
        tags: [],
        effect: '',
      })
    },
  },
  methods: {
    attackConfirm() {
      this.complete = true
    },
    attackUndo() {
      this.complete = false
    },
    reset() {
      this.$refs.main.reset()
      if (this.extraAux) this.$refs.aux.reset()
    },
    confirm(): void {
      this.dialog = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
