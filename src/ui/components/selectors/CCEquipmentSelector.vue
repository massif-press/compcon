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
import { PilotLicense } from '@/class';

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
      let pilotLicensedItems = this.pilot.LicenseController.Licenses.flatMap(
        (x: PilotLicense) => x.License.UnlocksByTotalRank(x.Rank)
      ).map((x) => x.ID);

      pilotLicensedItems = pilotLicensedItems.concat(
        this.pilot.SpecialEquipment.map((x) => x.ID)
      );

      return _.sortBy(
        this.items.filter((x) => !pilotLicensedItems.some((y) => y === x.ID)),
        ['Source', 'Name']
      );
    },
  },
  created() {
    const compendium = CompendiumStore();
    const items = (
      compendium.MechWeapons.filter(
        (x) => x.LicenseLevel > 0
      ) as CompendiumItem[]
    )
      .concat(
        compendium.WeaponMods.filter(
          (x) => x.LicenseLevel > 0
        ) as CompendiumItem[]
      )
      .concat(
        compendium.MechSystems.filter(
          (x) => x.LicenseLevel > 0
        ) as CompendiumItem[]
      )
      .concat(
        compendium.Frames.filter((x) => x.LicenseLevel > 0) as CompendiumItem[]
      );

    this.items = items.filter((x) => !x.IsExotic && !x.IsHidden);
  },
};
</script>
