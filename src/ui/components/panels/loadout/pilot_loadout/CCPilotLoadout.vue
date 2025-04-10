<template>
  <div :class="mobile ? 'px-2' : 'px-6'" class="mt-3">
    <cc-loadout-panel
      :loadouts="controller.Loadouts"
      :active-loadout="controller.ActiveLoadout"
      color="primary"
      :readonly="readonly"
      @set-active="controller.ActiveLoadout = $event"
      @add-loadout="controller.AddLoadout()"
      @clone-loadout="controller.CloneLoadout()"
      @remove-loadout="controller.RemoveLoadout()">
      <v-row :dense="mobile">
        <pilot-armor-card
          v-for="i in controller.MaxArmorSlots"
          :item="controller.ActiveLoadout.Armor[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
        <pilot-weapon-card
          v-for="i in controller.MaxWeaponSlots"
          :item="controller.ActiveLoadout.Weapons[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
        <pilot-gear-card
          v-for="i in controller.MaxGearSlots"
          :item="controller.ActiveLoadout.Gear[i - 1]"
          :readonly="readonly"
          :pilot="pilot"
          @equip="controller.ActiveLoadout.Add($event, i - 1)"
          @remove="controller.ActiveLoadout.Remove($event)"
          @save="pilot.SaveController.save()" />
      </v-row>
    </cc-loadout-panel>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import PilotArmorCard from './_PLArmorCard.vue';
import PilotWeaponCard from './_PLWeaponCard.vue';
import PilotGearCard from './_PLGearCard.vue';
import { PilotGear, ItemType } from '@/class';

export default {
  name: 'cc-pilot-loadout',
  components: { PilotArmorCard, PilotWeaponCard, PilotGearCard },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    controller() {
      return this.pilot.PilotLoadoutController;
    },
    gear(): PilotGear[] {
      return (CompendiumStore().PilotGear as PilotGear[]).filter(
        (x: PilotGear) => x.ItemType === ItemType.PilotGear && !x.IsHidden
      );
    },
    armor(): PilotGear[] {
      return (CompendiumStore().PilotGear as PilotGear[]).filter(
        (x: PilotGear) => x.ItemType === ItemType.PilotArmor && !x.IsHidden
      );
    },
    weapons(): PilotGear[] {
      return (CompendiumStore().PilotGear as PilotGear[]).filter(
        (x: PilotGear) => x.ItemType === ItemType.PilotWeapon && !x.IsHidden
      );
    },
  },
  methods: {
    exotics(type: string) {
      return this.pilot.SpecialEquipment.filter((x) => x.ItemType === type);
    },
  },
};
</script>
