<template>
  <!-- <compendium-browser :headers="headers" items="Mech Weapons" /> -->
  <compendium-browser-new
    :items="weapons"
    :hidden-items="[]"
    item-type="MechWeapon"
    :table-headers="headers"
    initial-group="license"
    initial-view="list"
  />
</template>

<script lang="ts">
import CompendiumBrowserNew from '../../components/CompendiumBrowserNew.vue';
import { CompendiumStore } from '../../store';

export default {
  name: 'Weapons',
  components: { CompendiumBrowserNew },
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
