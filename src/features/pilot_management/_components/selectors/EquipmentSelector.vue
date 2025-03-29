<template>
  <cc-compendium-browser
    :items="availableItems"
    item-type="Equipment"
    :options="options"
    equippable
    @equip="$emit('select', $event)">
    <template #header>
      <div class="heading h4 text-center text-primary">
        Add
        <span v-if="exotic">Exotic</span>
        Equipment
      </div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { CompendiumItem } from '@/classes/CompendiumItem';

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
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'SizeInt' },
      { title: 'Type', align: 'left', key: 'WeaponTypes' },
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
        showExotics: this.exotic,
      };
    },
    availableItems(): CompendiumItem[] {
      if (this.exotic) return CompendiumStore().allEquipment.filter((x) => x.IsExotic);

      return CompendiumStore().allEquipment.filter(
        (x) => !this.pilot.LicenseController.LicensedItems.some((y) => y.ID === x.ID)
      );
    },
  },
};
</script>
