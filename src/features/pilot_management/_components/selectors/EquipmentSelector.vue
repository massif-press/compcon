<template>
  <cc-compendium-browser
    :items="availableItems"
    item-type="Equipment"
    :options="options"
    equippable
    @equip="$emit('select', $event)"
  >
    <template #header>
      <div class="heading h4 text-center text-primary">
        Add <span v-if="exotic">Exotic</span> Equipment
      </div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { CompendiumItem } from '@/classes/CompendiumItem';
import { PilotLicense } from '@/class';

export default {
  name: 'equipment-selector',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    exotic: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      { title: 'Source', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'SizeInt' },
      { title: 'Type', align: 'left', key: 'WeaponType' },
      { title: 'Range', align: 'left', key: 'Range' },
      { title: 'Damage', align: 'left', key: 'Damage' },
    ],
  }),
  computed: {
    options() {
      return {
        views: ['single', 'table', 'cards'],
        initialView: 'single',
        groups: this.exotic ? ['lcp'] : ['source', 'lcp', 'license'],
        initialGroup: this.exotic ? 'none' : 'lcp',
      };
    },
    availableItems(): CompendiumItem[] {
      return CompendiumStore().allEquipment.filter(
        (x) => !this.pilot.LicenseController.LicensedItems.some((y) => y.ID === x.ID)
      );
    },
    items(): CompendiumItem[] {
      const compendium = CompendiumStore();
      let items = [
        ...(compendium.MechWeapons as CompendiumItem[]),
        ...(compendium.WeaponMods as CompendiumItem[]),
        ...(compendium.MechSystems as CompendiumItem[]),
        ...(compendium.Frames as CompendiumItem[]),
      ];

      if (this.exotic) items = items.concat(compendium.PilotGear as CompendiumItem[]);

      return items.filter((x) => (this.exotic ? x.IsExotic : !x.IsExotic && !x.IsHidden));
    },
  },
};
</script>
