<template>
  <weapon-attack
    ref="main"
    :item="item"
    :mech="mech"
    improv
    @confirm="attackConfirm($event)"
    @reset="attackUndo()"
  />
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
  },
})
</script>
