<template>
  <div>
    <cc-loadout-panel
      :loadouts="mech.MechLoadoutController.Loadouts"
      :active-loadout="mech.MechLoadoutController.ActiveLoadout"
      :color="color"
      @set-active="mech.MechLoadoutController.ActiveLoadout = $event"
      @add-loadout="mech.MechLoadoutController.AddLoadout()"
      @clone-loadout="mech.MechLoadoutController.CloneLoadout()"
      @remove-loadout="mech.MechLoadoutController.RemoveLoadout()"
    >
      <v-row density="compact">
        <mount-block
          v-for="(im, j) in mech.MechLoadoutController.ActiveLoadout.IntegratedMounts"
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
          v-if="
            mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting') &&
            mech.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3
          "
          superheavy
          :readonly="readonly"
          :mount="mech.MechLoadoutController.ActiveLoadout.SuperheavyMount"
          :mech="mech"
          :color="color"
        />

        <mount-block
          v-for="(m, k) in mech.MechLoadoutController.ActiveLoadout.EquippableMounts"
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
import MountBlock from './components/mount/_MountBlock.vue';
import SystemsBlock from './components/system/_SystemsBlock.vue';

export default {
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
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
    },
  },
};
</script>
