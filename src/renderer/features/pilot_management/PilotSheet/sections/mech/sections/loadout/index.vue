<template>
  <div class="pb-3 ">
    <cc-title small :color="color">Equipment Loadout</cc-title>
    <cc-loadout-panel
      :loadouts="mech.Loadouts"
      :active-loadout="mech.ActiveLoadout"
      :color="color"
      @set-active="mech.ActiveLoadout = $event"
      @add-loadout="mech.AddLoadout()"
      @clone-loadout="mech.CloneLoadout()"
      @remove-loadout="mech.RemoveLoadout()"
    >
      <v-row>
        <mount-block
          v-for="(im, j) in mech.ActiveLoadout.IntegratedMounts"
          :key="`int_${j}`"
          :mount="im"
          :loadout="mech.ActiveLoadout"
          integrated
          :color="color"
        />

        <mount-block
          v-if="pilot.has('CoreBonus', 'intweapon')"
          :mount="mech.ActiveLoadout.IntegratedWeaponMount"
          :loadout="mech.ActiveLoadout"
          :max-sp="mech.MaxSP"
          intweapon
          :color="color"
        />

        <mount-block
          v-for="(m, k) in mech.ActiveLoadout.AllEquippableMounts(pilot.has('CoreBonus', 'imparm'))"
          :key="`m_${k}`"
          :mount="m"
          :loadout="mech.ActiveLoadout"
          :max-sp="mech.MaxSP"
          :color="color"
        />
      </v-row>

      <v-divider class="my-2" />

      <systems-block :loadout="mech.ActiveLoadout" :mech="mech" :color="color" />
    </cc-loadout-panel>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MountBlock from './components/MountBlock.vue'
import SystemsBlock from './components/SystemsBlock.vue'

export default Vue.extend({
  name: 'mech-loadout-block',
  components: { SystemsBlock, MountBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  methods: {},
})
</script>
