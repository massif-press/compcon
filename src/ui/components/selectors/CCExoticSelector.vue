<template>
  <div>
    <cc-selector-table
      :items="availableItems"
      :headers="headers"
      no-filter
      sp-ignore
      equipment-add
      @equip="$emit('select', $event)"
    />
  </div>
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
  },
  data: () => ({
    items: [],
    headers: [
      { title: '', align: 'left', value: 'Info' },
      { title: 'Type', align: 'left', value: 'ItemType' },
      { title: 'Source', align: 'left', value: 'Source' },
      { title: 'Equipment', align: 'left', value: 'Name' },
      { title: '', align: 'center', value: 'Add' },
    ],
  }),
  computed: {
    availableItems(): CompendiumItem[] {
      const pilotLicensedItems = this.pilot.SpecialEquipment.map((x) => x.ID);

      return _.sortBy(
        this.items.filter((x) => !pilotLicensedItems.some((y) => y === x.ID)),
        ['Name']
      );
    },
  },
  created() {
    const compendium = CompendiumStore();
    const items = (
      compendium.MechWeapons.filter((x) => x.IsExotic) as CompendiumItem[]
    )
      .concat(
        compendium.WeaponMods.filter((x) => x.IsExotic) as CompendiumItem[]
      )
      .concat(
        compendium.MechSystems.filter((x) => x.IsExotic) as CompendiumItem[]
      )
      .concat(compendium.Frames.filter((x) => x.IsExotic) as CompendiumItem[])
      .concat(
        compendium.PilotGear.filter((x) => x.IsExotic) as CompendiumItem[]
      );

    this.items = items.filter((x) => !x.IsHidden);
  },
};
</script>
