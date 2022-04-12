<template>
  <div>
    <cc-loadout-panel
      :loadouts="mech.MechLoadoutController.Loadouts"
      :active-loadout="mech.MechLoadoutController.ActiveLoadout"
      :color="color"
      :readonly="readonly"
      @set-active="mech.MechLoadoutController.ActiveLoadout = $event"
      @add-loadout="mech.MechLoadoutController.AddLoadout()"
      @clone-loadout="mech.MechLoadoutController.CloneLoadout()"
      @remove-loadout="mech.MechLoadoutController.RemoveLoadout()"
    >
      <v-row dense>
        <mount-block
          v-for="(im, j) in mech.MechLoadoutController.ActiveLoadout.IntegratedMounts"
          :key="`int_${j}`"
          integrated
          :mount="im"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-if="mech.Pilot.has('CoreBonus', 'cb_integrated_weapon')"
          int-weapon
          :readonly="readonly"
          :mount="mech.MechLoadoutController.ActiveLoadout.IntegratedWeaponMount"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-if="
            mech.Pilot.has('CoreBonus', 'cb_improved_armament') &&
            mech.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3
          "
          imp-arm
          :readonly="readonly"
          :mount="mech.MechLoadoutController.ActiveLoadout.ImprovedArmamentMount"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-for="(m, k) in mech.MechLoadoutController.ActiveLoadout.EquippableMounts"
          :key="`m_${k}`"
          :readonly="readonly"
          :mount="m"
          :mech="mech"
          :color="color"
        />
      </v-row>
      <v-divider class="my-2" />
      <systems-block :mech="mech" :color="color" :readonly="readonly" />
    </cc-loadout-panel>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MountBlock from './components/mount/_MountBlock.vue'
import SystemsBlock from './components/system/_SystemsBlock.vue'

export default Vue.extend({
  name: 'mech-loadout-block',
  components: { SystemsBlock, MountBlock },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
  },
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark)
    },
  },
})
</script>
