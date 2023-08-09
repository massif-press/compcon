<template>
  <compendium-browser
    :items="weapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Mech Weapons</div></template
    >
  </compendium-browser>
</template>

<script lang="ts">
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';
import { CompendiumStore } from '../../store';

export default {
  name: 'Weapons',
  components: { CompendiumBrowser },
  data: () => ({
    options: {
      views: ['single', 'table', 'cards', 'scatter'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'license',
    },
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
    weapons() {
      let items = CompendiumStore().MechWeapons;

      // TODO: profile

      // const canShowExotics =
      //   this.profile && Object.keys(this.profile).length > 0 && this.profile.GetView('showExotics');

      // if (!canShowExotics) i = i.filter((x) => !x.IsExotic);

      return items.filter((x) => !x.IsHidden);
    },
  },
};
</script>
