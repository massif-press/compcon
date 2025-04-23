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
      @remove-loadout="mech.MechLoadoutController.RemoveLoadout()">
      <masonry-wall :items="mounts" :column-width="600" :gap="16" :min-columns="1" :max-columns="2">
        <template #default="{ item }">
          <mount-block
            :readonly="readonly"
            :integrated="item.isIntegrated"
            :int-weapon="item.isIntWeapon"
            :imp-arm="item.isImpArm"
            :superheavy="item.isSuperheavy"
            :mount="<any>item.mount"
            :mech="mech"
            :color="color" />
        </template>
      </masonry-wall>

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
    mounts(): {
      mount: any;
      isIntegrated: boolean;
      isIntWeapon: boolean;
      isImpArm: boolean;
      isSuperheavy: boolean;
    }[] {
      let items = [] as {
        mount: any;
        isIntegrated: boolean;
        isIntWeapon: boolean;
        isImpArm: boolean;
        isSuperheavy: boolean;
      }[];

      this.mech.MechLoadoutController.ActiveLoadout.IntegratedMounts.forEach((im) => {
        items.push({
          mount: im,
          isIntegrated: true,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        });
      });

      if (this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'))
        items.push({
          mount: this.mech.MechLoadoutController.ActiveLoadout.IntegratedWeaponMount,
          isIntegrated: false,
          isIntWeapon: true,
          isImpArm: false,
          isSuperheavy: false,
        });

      if (this.mech.MechLoadoutController.ActiveLoadout.EquippableMounts.length < 3) {
        if (this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting'))
          items.push({
            mount: this.mech.MechLoadoutController.ActiveLoadout.SuperheavyMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: false,
            isSuperheavy: true,
          });
        else if (this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'))
          items.push({
            mount: this.mech.MechLoadoutController.ActiveLoadout.ImprovedArmamentMount,
            isIntegrated: false,
            isIntWeapon: false,
            isImpArm: true,
            isSuperheavy: false,
          });
      }

      for (const m of this.mech.MechLoadoutController.ActiveLoadout.EquippableMounts) {
        items.push({
          mount: m,
          isIntegrated: false,
          isIntWeapon: false,
          isImpArm: false,
          isSuperheavy: false,
        });
      }

      return items;
    },
  },
};
</script>
