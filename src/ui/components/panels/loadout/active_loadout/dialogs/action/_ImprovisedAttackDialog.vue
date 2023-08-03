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
import WeaponAttack from '../../components/_WeaponAttack.vue'

export default Vue.extend({
  name: 'improvised-attack-dialog',
  components: { WeaponAttack },
  props: {
    used: { type: Boolean },
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
    activation: null,
    atk: null,
  }),
  computed: {
    item(): MechWeapon {
      if (this.mech.Pilot.has('talent', 't_brawler', 2)) {
        return new MechWeapon({
          id: 'improv_attack',
          name: 'Improvised Attack',
          mount: WeaponSize.Main,
          type: WeaponType.Melee,
          damage: [
            {
              type: DamageType.Kinetic,
              val: '2d6 + 2',
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
          tags: [
            {
              id: 'tg_knockback',
              val: 2,
            },
          ],
          effect: '',
        })
      } else
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
  watch: {
    used: {
      immediate: true,
      deep: true,
      handler: function (newval) {
        if (!this.$refs.main)
          Vue.nextTick().then(() => {
            if (!newval) this.$refs.main.init()
          })
        else if (!newval) this.$refs.main.init()
      },
    },
  },
  methods: {
    attackConfirm(atk: any) {
      this.$emit('use', atk)
    },
    attackUndo() {
      this.$emit('undo')
    },
  },
})
</script>
