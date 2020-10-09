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
        Barrage
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      select two weapons or one superheavy weapon

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
