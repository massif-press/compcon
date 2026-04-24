<template>
  <cc-compendium-browser :items="weapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">Mech Weapons</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '../../store';

export default {
  name: 'Weapons',

  data: () => ({
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license', 'none'],
      initialGroup: 'license',
    },
    headers: [
      { title: '', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'Size' },
      {
        title: 'Type',
        align: 'left',
        key: 'WeaponTypes',
        sortRaw(a, b) {
          const typeA = a.WeaponTypes.join(',');
          const typeB = b.WeaponTypes.join(',');
          if (typeA < typeB) return -1;
          if (typeA > typeB) return 1;
          return 0;
        },
      },
      { title: 'Tags', align: 'center', key: 'Tags' },
      {
        title: 'Range',
        align: 'left',
        key: 'Range',
        sortRaw(a, b) {
          return a.SelectedProfile.RangeSum() - b.SelectedProfile.RangeSum();
        },
      },
      {
        title: 'Damage',
        align: 'left',
        key: 'Damage',
        sortRaw(a, b) {
          return a.MaxDamage - b.MaxDamage;
        },
      },
    ],
  }),
  computed: {
    weapons() {
      const items = CompendiumStore().MechWeapons;

      return orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
