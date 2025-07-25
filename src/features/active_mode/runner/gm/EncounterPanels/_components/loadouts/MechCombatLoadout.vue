<template>
  <masonry-wall :items="mounts" :column-width="600" :gap="16" :min-columns="1" :max-columns="2">
    <template #default="{ item }">
      <fieldset class="pb-2 px-3" style="border-color: rgba(155, 155, 155, 0.6)">
        <legend class="heading h4 mx-2 px-2 text-accent">
          {{ item.mount.Name }}
          <span class="text-cc-overline" v-if="item.isImpArm">(IMPROVED ARMAMENT)</span>
          <span class="text-cc-overline" v-if="item.isSuperheavy">(SUPERHEAVY MOUNTING)</span>
        </legend>

        <cb-card v-for="b in item.mount.Bonuses" :bonus="b" />
        <sh-lock-card v-if="item.mount.IsLocked" />
        <div v-for="s in item.mount.Slots">
          <mech-weapon-card
            v-if="s && s.Weapon"
            :key="s.ID"
            :item="s.Weapon"
            :mech="mech"
            :mount="item.mount"
            :int-weapon="item.isIntWeapon || item.isIntegrated" />
        </div>
        <!-- <weapon-slot-card
      v-if="!item.mount.IsLocked"
      v-for="s in item.mount.Slots"
      :weapon-slot="s"
      :mech="mech"
      :mount="item.mount" /> -->
      </fieldset>
    </template>
  </masonry-wall>
</template>

<script lang="ts">
import MechWeaponCard from './_mechWeaponCard.vue';

export default {
  name: 'mech-combat-loadout',
  components: {
    MechWeaponCard,
  },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mounts() {
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
