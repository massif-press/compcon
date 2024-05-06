<template>
  <div class="mt-3 px-10">
    <v-row>
      <pilot-armor-card
        v-for="i in controller.MaxArmorSlots"
        :item="controller.Loadout.Armor[i - 1]"
        :readonly="readonly"
        :pilot="pilot"
        @equip="controller.Loadout.Add($event, i - 1)"
        @remove="controller.Loadout.Remove($event)"
        @save="pilot.SaveController.save()" />
      <pilot-weapon-card
        v-for="i in controller.MaxWeaponSlots"
        :item="controller.Loadout.Weapons[i - 1]"
        :readonly="readonly"
        :pilot="pilot"
        @equip="controller.Loadout.Add($event, i - 1)"
        @remove="controller.Loadout.Remove($event)"
        @save="pilot.SaveController.save()" />
      <pilot-gear-card
        v-for="i in controller.MaxGearSlots"
        :item="controller.Loadout.Gear[i - 1]"
        :readonly="readonly"
        :pilot="pilot"
        @equip="controller.Loadout.Add($event, i - 1)"
        @remove="controller.Loadout.Remove($event)"
        @save="pilot.SaveController.save()" />
    </v-row>
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
