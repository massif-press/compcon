<template>
  <div>
    <cc-loadout-panel
      :loadouts="mech.Loadouts"
      :active-loadout="mech.ActiveLoadout"
      :color="color"
      :readonly="readonly"
      @set-active="mech.ActiveLoadout = $event"
      @add-loadout="mech.AddLoadout()"
      @clone-loadout="mech.CloneLoadout()"
      @remove-loadout="mech.RemoveLoadout()"
    >
      <v-row dense>
        <mount-block
          v-for="(im, j) in mech.ActiveLoadout.IntegratedMounts"
          :key="`int_${j}`"
          integrated
          :mount="im"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-if="mech.Pilot.has('CoreBonus', 'intweapon')"
          int-weapon
          :readonly="readonly"
          :mount="mech.ActiveLoadout.IntegratedWeaponMount"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-if="mech.Pilot.has('CoreBonus', 'imparm')"
          imp-arm
          :readonly="readonly"
          :mount="mech.ActiveLoadout.ImprovedArmamentMount"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-for="(m, k) in mech.ActiveLoadout.EquippableMounts"
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
  },
  computed: {
    color() {
      return this.mech.Frame.Manufacturer.Color
    },
  },
})
</script>
