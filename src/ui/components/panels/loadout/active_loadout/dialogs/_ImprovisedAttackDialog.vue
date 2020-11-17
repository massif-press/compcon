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
        Improvised Attack
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.breakpoint.mdAndDown" class="titlebar-margin" />
      <v-card-text class="mb-0 pb-2">
        <weapon-attack
          ref="main"
          :item="item"
          :mech="mech"
          improv
          @confirm="attackConfirm($event)"
          @reset="attackUndo()"
        />
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
import WeaponAttack from '../components/_WeaponAttack.vue'

export default Vue.extend({
  name: 'improvised-attack-dialog',
  components: { WeaponAttack },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    complete: false,
    activation: null,
    atk: null,
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
    attackConfirm(atk: any) {
      this.atk = atk
      this.complete = true
      this.activation = atk.activation
      this.mech.Pilot.State.CommitAction(this.action, atk.activation)
      this.mech.Pilot.State.LogAttackAction(
        'IMPROVISED ATTACK',
        atk.activation.toUpperCase(),
        atk.damage,
        atk.kill
      )
    },
    attackUndo() {
      this.mech.Pilot.State.UndoLogAttackAction(
        'IMPROVISED ATTACK',
        this.activation.toUpperCase(),
        this.atk.damage,
        this.atk.kill
      )
      this.complete = false
      this.mech.Pilot.State.UndoAction(this.action, this.activation)
      this.atk = null
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
